---
title: Thiết kế remote terminal/WebSocket dashboard cho AI agents
description: >-
  Ghi chú kỹ thuật về cách thiết kế một dashboard realtime để theo dõi và điều
  khiển AI agents chạy trong terminal bằng WebSocket.
pubDatetime: '2023-12-07T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Technical Notes
  - WebSocket
  - AI Agents
  - Dashboard
  - Remote Terminal
  - Developer Tools
  - Realtime System
categories:
  - Technical
  - AI
---

## Mở bài

Khi làm việc với AI coding agents như Claude Code, ChatGPT CLI hoặc các agent chạy bằng terminal, vấn đề không còn chỉ là “agent có code được không”. Một vấn đề thực tế hơn là: **làm sao biết agent đang làm gì, đang chạy task nào, có bị treo không, và có cần mình can thiệp không?**

Tôi xem lại các pattern browser-based terminal control và thấy ý tưởng khá thực tế: biến trình duyệt thành một giao diện terminal để theo dõi và điều khiển các agent đang chạy. Các hệ thống kiểu này thường kết hợp browser terminal, rendering kiểu Xterm.js và process bridge để người dùng có thể xem một phiên đang chạy mà không cần dựng workflow SSH đầy đủ.

Bài này không phải hướng dẫn clone một công cụ có sẵn. Tôi muốn ghi lại một thiết kế nhỏ hơn: **remote terminal/WebSocket dashboard cho AI agents**, áp dụng cho một project cá nhân hoặc team nhỏ.

## 1. Vấn đề

Khi chạy nhiều AI agents song song, ta thường gặp các vấn đề này:

- Mỗi agent chạy ở một terminal khác nhau.
- Không biết agent nào đang phân tích code, agent nào đang chạy test, agent nào đã lỗi.
- Nếu để agent chạy lâu, ta phải quay lại máy chính để kiểm tra.
- Không có trạng thái tập trung để nhìn toàn bộ phiên làm việc.
- Nếu agent sửa code hoặc chạy command nguy hiểm, ta cần cơ chế quan sát và kiểm soát.

Với một người làm product hoặc engineering, đây là bài toán **observability cho developer workflow**.

Ta không chỉ cần terminal. Ta cần một dashboard trả lời nhanh:

```text
Agent nào đang chạy?
Nó đang làm task gì?
Output mới nhất là gì?
Có lỗi không?
Có thể pause/stop/restart không?
Có log để xem lại không?
```

## 2. Ý tưởng hệ thống

Thiết kế đơn giản nhất gồm 4 phần:

```text
Browser Dashboard
      ↓ WebSocket
Backend Gateway
      ↓ process/session manager
Terminal / Agent Sessions
      ↓ logs/events
Storage / Log History
```

Trong đó:

- **Browser Dashboard**: giao diện xem danh sách agent sessions, terminal output, status, current task.
- **WebSocket Gateway**: giữ kết nối realtime giữa browser và backend.
- **Session Manager**: quản lý agent process, terminal session, command input/output.
- **Log Storage**: lưu lại event và output quan trọng để debug sau này.

WebSocket phù hợp vì browser và server cần trao đổi hai chiều liên tục: server push output mới về browser, browser gửi command/pause/stop về server.

## 3. Vì sao dùng WebSocket?

Nếu dùng HTTP polling, frontend phải hỏi server liên tục:

```text
Có log mới chưa?
Có log mới chưa?
Có log mới chưa?
```

Cách này đơn giản nhưng phí request và không thật sự realtime.

WebSocket mở một kết nối hai chiều giữa browser và server. Sau khi kết nối được mở, server có thể đẩy output về browser ngay khi terminal sinh log mới. Browser cũng có thể gửi command ngược lại server mà không cần tạo request mới.

Với dashboard AI agents, WebSocket hợp cho các luồng như:

- stream terminal output
- update trạng thái agent
- gửi command từ browser
- theo dõi progress realtime
- báo lỗi hoặc cảnh báo

## 4. Data model tối thiểu

Một session không nên chỉ là text output. Nó nên có metadata rõ ràng.

```ts
export type AgentSession = {
  id: string;
  name: string;
  projectPath: string;
  status: "idle" | "running" | "error" | "stopped";
  currentTask?: string;
  branch?: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentEvent = {
  id: string;
  sessionId: string;
  type: "stdout" | "stderr" | "status" | "command" | "system";
  message: string;
  createdAt: string;
};
```

Điểm quan trọng là tách **session state** và **event stream**. Session state dùng để render danh sách nhanh. Event stream dùng để xem log chi tiết.

## 5. WebSocket message contract

Đừng để WebSocket gửi text lung tung. Nên có contract rõ ràng.

```ts
type ClientMessage =
  | { type: "subscribe"; sessionId: string }
  | { type: "send_command"; sessionId: string; command: string }
  | { type: "stop_session"; sessionId: string }
  | { type: "set_title"; sessionId: string; title: string };

type ServerMessage =
  | { type: "session_snapshot"; session: AgentSession }
  | { type: "session_event"; event: AgentEvent }
  | { type: "session_status"; sessionId: string; status: AgentSession["status"] }
  | { type: "error"; message: string };
```

Tôi thích cách này vì sau này frontend, backend và agent runner có thể phát triển độc lập hơn.

## 6. UI dashboard nên có gì?

Một dashboard đơn giản có thể chia thành 3 cột:

```text
Left: Agent Sessions
Center: Terminal Output
Right: Session Info / Actions
```

### Left — Session list

Hiển thị:

- session name
- project name
- current task
- running/error/idle badge
- last active time

### Center — Terminal output

Hiển thị:

- stdout/stderr stream
- syntax highlight nhẹ nếu cần
- auto-scroll toggle
- search log
- copy output

### Right — Control panel

Hiển thị:

- project path
- branch hiện tại
- current task
- buttons: pause, stop, restart
- command input nếu cho phép điều khiển từ xa

## 7. Điểm cần cẩn thận

Remote terminal là thứ khá nhạy cảm. Nếu làm không cẩn thận, nó có thể trở thành một cánh cửa mở vào máy hoặc server.

Một số nguyên tắc tối thiểu:

- Không mở public nếu chưa có authentication.
- Không cho chạy command tự do nếu chưa có allowlist.
- Log mọi command được gửi từ dashboard.
- Tách quyền read-only và control mode.
- Không stream secrets ra frontend.
- Có nút kill session.
- Có timeout cho session quá lâu không hoạt động.

Với bản đầu tiên, tôi sẽ làm dashboard **read-only** trước: chỉ xem session, trạng thái và output. Khi hệ thống ổn mới thêm command input.

## 8. Ví dụ flow hoạt động

```text
1. User mở dashboard.
2. Frontend gọi API lấy danh sách sessions.
3. User chọn một session.
4. Frontend mở WebSocket và subscribe session đó.
5. Backend gửi snapshot hiện tại.
6. Mỗi khi terminal có output mới, backend gửi session_event.
7. Nếu agent lỗi, backend gửi session_status = error.
8. User có thể stop hoặc restart session nếu có quyền.
```

Ví dụ pseudo-code phía frontend:

```ts
const socket = new WebSocket("ws://localhost:3001/ws");

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: "subscribe",
    sessionId: selectedSessionId,
  }));
};

socket.onmessage = event => {
  const message = JSON.parse(event.data);

  if (message.type === "session_event") {
    appendTerminalLine(message.event);
  }

  if (message.type === "session_status") {
    updateSessionStatus(message.sessionId, message.status);
  }
};
```

## 9. Tôi sẽ áp dụng vào đâu?

Với các project AI workflow, tôi có thể dùng dashboard này để theo dõi:

- agent đang đọc codebase OneClick CRM
- agent đang viết test cho API
- agent đang chạy evaluation cho prompt pipeline
- agent đang migrate dữ liệu hoặc generate docs
- agent đang chạy computer vision training script

Điều quan trọng là dashboard không chỉ làm đẹp. Nó giúp tôi kiểm soát workflow tốt hơn khi AI bắt đầu tham gia vào quá trình phát triển phần mềm.

## 10. Kết luận

Remote terminal/WebSocket dashboard cho AI agents không phải là một ý tưởng quá xa vời. Nó là một lớp quan sát và điều khiển cho developer workflow hiện đại.

Bài học chính của tôi:

- WebSocket hợp với realtime terminal output.
- Session metadata quan trọng không kém terminal log.
- Nên bắt đầu bằng read-only dashboard trước.
- Security phải được nghĩ từ đầu.
- AI agents càng chạy tự động, con người càng cần dashboard để quan sát.

## Nguồn tham khảo

- MDN WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- MDN WebSocket object: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

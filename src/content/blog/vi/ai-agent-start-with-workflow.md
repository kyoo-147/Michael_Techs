---
title: 'AI Agent không nên bắt đầu từ agent, mà từ workflow'
description: >-
  Trước khi nói đến AI Agent, tool use hay autonomous system, nên bắt đầu từ
  workflow thật: ai làm gì, dữ liệu ở đâu, bước nào cần tự động hóa và bước nào
  cần con người giữ quyền kiểm soát.
pubDatetime: '2025-05-08T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - AI Product Thinking
  - AI Agents
  - Workflow Automation
  - Product Design
  - Business Process
  - Applied AI
categories:
  - AI
  - Product
---

Gần đây ai cũng nói về AI Agent.

Agent đặt lịch. Agent gửi email. Agent gọi API. Agent tự làm task. Agent tự suy nghĩ. Nghe rất hấp dẫn.

Nhưng nếu bắt đầu bằng câu “mình sẽ build một AI Agent”, tôi nghĩ rất dễ đi sai hướng. Vì agent không phải là sản phẩm. Agent chỉ là một cách triển khai.

Cái nên bắt đầu là workflow.

## 1. Workflow là phần thật sự tồn tại trong doanh nghiệp

Trong một doanh nghiệp nhỏ, người ta không nói:

> Tôi cần một autonomous multi-agent system.

Họ thường nói:

- Tôi quên follow-up khách.
- Lead từ website bị rơi mất.
- Nhân viên nhập dữ liệu CRM không đều.
- Tạo báo giá mất thời gian.
- Không biết khách nào cần ưu tiên trước.
- Mỗi ngày phải copy dữ liệu từ form sang sheet rồi nhắn Zalo thủ công.

Đây mới là vấn đề thật.

Nếu nhìn theo workflow, ta có thể vẽ rất đơn giản:

```txt
Lead đến từ website
    ↓
Lưu vào CRM
    ↓
Phân loại nhu cầu
    ↓
Gửi phản hồi đầu tiên
    ↓
Tạo deal hoặc task follow-up
    ↓
Manager xem dashboard
```

Sau khi workflow rõ rồi, mình mới quyết định bước nào cần rule, bước nào cần automation, bước nào cần LLM, bước nào cần con người duyệt.

## 2. Agentic workflow không có nghĩa là bỏ hết cho AI tự chạy

IBM định nghĩa agentic workflows là các quy trình AI-driven, nơi agent có thể lập kế hoạch, dùng công cụ, phối hợp và thực hiện tác vụ với mức độ tự chủ nhất định. Nhưng điểm quan trọng là workflow vẫn là workflow: có mục tiêu, có bước xử lý, có input/output, có giới hạn.

Nói đơn giản hơn:

> Agent tốt không phải agent làm mọi thứ. Agent tốt là agent biết làm đúng phần của nó trong một quy trình được thiết kế rõ.

Ví dụ:

```txt
Không tốt:
AI Agent tự xử lý toàn bộ sales process.

Tốt hơn:
AI hỗ trợ phân loại lead, tóm tắt nhu cầu, gợi ý next action, nhưng các bước gửi báo giá hoặc cam kết giá trị vẫn cần người duyệt.
```

## 3. Một workflow tốt thường có 5 phần

Khi thiết kế AI workflow, tôi thường chia thành 5 phần:

### Input

Dữ liệu đi vào từ đâu?

- form website,
- email,
- CRM,
- file PDF,
- đoạn chat,
- cuộc gọi được transcript.

### Context

AI cần biết gì để xử lý?

- thông tin khách hàng,
- lịch sử tương tác,
- sản phẩm/dịch vụ,
- chính sách giá,
- rule nội bộ.

### Decision

AI cần đưa ra quyết định hay chỉ hỗ trợ?

- phân loại lead,
- tóm tắt nội dung,
- gợi ý câu trả lời,
- đánh dấu rủi ro,
- đề xuất bước tiếp theo.

### Action

Hệ thống sẽ làm gì sau đó?

- tạo task,
- cập nhật CRM,
- gửi draft message,
- gọi API,
- tạo quote,
- ghi log.

### Control

Ai kiểm tra? Khi nào cần dừng lại?

- human approval,
- confidence threshold,
- audit log,
- rollback,
- notification nếu lỗi.

Nếu 5 phần này chưa rõ, thêm agent vào chỉ làm hệ thống khó kiểm soát hơn.

## 4. Ví dụ: AI Agent cho CRM lead follow-up

Một thiết kế vừa đủ có thể như sau:

```txt
Website form submitted
    ↓
Backend lưu lead vào PostgreSQL
    ↓
AI đọc nội dung và tóm tắt nhu cầu
    ↓
Rule engine kiểm tra source, budget, urgency
    ↓
AI gợi ý next action
    ↓
Sales duyệt hoặc chỉnh sửa
    ↓
Hệ thống tạo activity log + follow-up reminder
```

Ở đây có thể có AI Agent, nhưng nó không “tự do bay nhảy”. Nó có nhiệm vụ cụ thể:

- đọc lead,
- gọi tool lấy dữ liệu khách hàng,
- tạo summary,
- đề xuất next action,
- không tự gửi cam kết quan trọng nếu chưa được duyệt.

Cách này ít sexy hơn demo agent tự làm mọi thứ, nhưng dùng được trong sản phẩm thật.

## 5. Những thứ cần log lại

Với AI workflow, log không chỉ để debug. Log còn để biết vì sao hệ thống quyết định như vậy.

Tối thiểu nên ghi:

```json
{
  "workflow_id": "lead_followup_001",
  "lead_id": "lead_123",
  "input_summary": "Khách hỏi tư vấn CRM cho đội sales 5 người",
  "ai_action": "suggest_next_action",
  "ai_output": "Gợi ý gọi tư vấn và gửi demo CRM",
  "human_approved": true,
  "created_task_id": "task_789"
}
```

Không cần phức tạp ngay từ đầu, nhưng phải có dấu vết.

Vì một ngày nào đó bạn sẽ hỏi: “Tại sao AI lại gửi gợi ý này?” Nếu không có log, bạn chỉ có cảm giác, không có bằng chứng.

## 6. Khi nào nên dùng agent?

Tôi sẽ dùng agent khi task có đủ 3 yếu tố:

1. cần nhiều bước xử lý,
2. cần đọc ngữ cảnh hoặc chọn tool,
3. kết quả có thể kiểm tra được.

Ví dụ hợp lý:

- phân tích lead rồi tạo draft follow-up,
- đọc tài liệu rồi trả lời câu hỏi có nguồn,
- kiểm tra trạng thái đơn hàng qua API rồi tóm tắt,
- gom dữ liệu dashboard rồi giải thích insight.

Ví dụ chưa nên dùng agent:

- lưu form vào database,
- gửi email cố định,
- tính tổng doanh thu,
- validate số điện thoại,
- tạo reminder đơn giản.

Những cái này automation truyền thống làm tốt hơn, rẻ hơn, dễ debug hơn.

## 7. Kết luận

AI Agent là một công cụ rất mạnh, nhưng không nên là điểm bắt đầu.

Điểm bắt đầu nên là một workflow thật:

> Ai đang làm việc gì, bước nào đau nhất, dữ liệu ở đâu, quyết định nào quan trọng, và AI nên hỗ trợ ở đâu mà không làm mất kiểm soát?

Khi workflow rõ, agent mới có chỗ đứng. Khi workflow chưa rõ, agent chỉ làm mọi thứ trông thông minh hơn một chút, nhưng hệ thống lại khó tin hơn rất nhiều.

## Nguồn tham khảo

- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- Andrew Ng — Writing: Agents on the Desktop / Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

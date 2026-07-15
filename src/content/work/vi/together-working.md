---
locale: vi
title: "Together Working"
summary: "AI Department Operating System dạng CLI cho local AI worker teams, task orchestration, review, verification và integration."
description: "Together Working là local AI worker control plane được nâng cấp thành CLI/TUI chạy trên máy developer. Dự án giúp điều phối nhiều AI coding agent như Codex, Claude, Gemini, Amp, OpenCode và các agent CLI khác thông qua task contract, worker routing, daemon-owned state, review/approval flow, verification gate và operator report."
overview: "Thay vì giao toàn bộ dự án cho một agent trong context ngày càng lớn, Together Working chia công việc thành các task nhỏ, route đến worker phù hợp, theo dõi trạng thái qua CLI, và giữ Codex ở vai trò coordinator/integrator cuối cùng. Dự án đang được phát triển tích cực và thử nghiệm trong các phiên làm việc của dev để cải tiến workflow và đo hiệu suất."
problem: "Các phiên AI coding lớn dễ bị phình context, khó phân quyền, khó biết worker nào sửa file nào, khó kiểm chứng output và khó tích hợp kết quả từ nhiều agent. Khi provider lỗi, chưa đăng nhập hoặc trả kết quả kém, toàn bộ workflow cũng dễ bị gián đoạn nếu không có readiness, fallback, review và verification rõ ràng."
approach: "Together Working sử dụng Rust CLI, local daemon, task monitor, task views, settings, skill bridge, worker registry, readiness checks, scoped task contracts, approval/review commands, verification artifacts và reporting. Control/state nằm ở daemon; CLI/TUI là lớp điều khiển mỏng để developer theo dõi, gửi task, review kết quả, approve hoặc chặn integration."
role: "Founder / Product Builder / AI Systems Engineer"
period: "2026 - hiện tại"
featured: true
order: 2
heroImage: "/work/together-working/main.png"
showBody: false
metrics:
  - value: "CLI/TUI"
    label: "control plane terminal-first cho AI workers"
  - value: "Task Contracts"
    label: "scope, files, deliverables và success criteria"
  - value: "Verification"
    label: "evidence, diff, test và approval trước integration"
outcomes:
  - "Nâng cấp Together Working thành giao diện dòng lệnh/terminal UI cho quản lý task, monitor, worker state, settings, review và approval trong workflow AI coding."
  - "Thiết kế mô hình local control plane với daemon sở hữu state, CLI/TUI làm client, và Codex giữ vai trò coordinator, verifier và integrator."
  - "Xây dựng task contract để giới hạn scope, allowed files, denied files, deliverables, success criteria, reviewer và verification requirement."
  - "Phát triển worker routing theo readiness, capability fit, fallback, degraded state và cooldown để tránh giao task cho worker không sẵn sàng."
  - "Tạo review/verification flow để kết quả từ agent phải có evidence, diff, test result và approval trước khi được tích hợp."
  - "Đang được phát triển tích cực và thử nghiệm trong các phiên làm việc của dev nhằm cải tiến workflow, đo hiệu suất, đánh giá cost/token và verification quality."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/together_working"
    note: "Dự án đang phát triển nhanh; bản public có thể không phản ánh đầy đủ CLI/TUI, daemon, packaging và các thử nghiệm workflow mới nhất."
highlights:
  - title: "Task Monitor"
    description: "Theo dõi tiến trình task, worker status, events, pending review, blocked work và các điểm cần developer can thiệp."
    src: "/work/together-working/task-monitor.png"
  - title: "Task Queue"
    description: "Quản lý danh sách task theo trạng thái, owner, worker, priority, scope và verification requirement."
    src: "/work/together-working/tasks.png"
  - title: "Task Detail"
    description: "Inspect task contract, allowed files, diff evidence, logs, review status, verification result và integration decision."
    src: "/work/together-working/task.png"
  - title: "Settings"
    description: "Cấu hình providers, routing policy, daemon/client behavior, approval defaults, local artifacts và workflow preferences."
    src: "/work/together-working/settings.png"
timeline:
  - date: "01.2026"
    label: "AI Department OS positioning cho local AI worker teams"
  - date: "02.2026"
    label: "Worker registry, provider discovery, readiness checks và routing model"
  - date: "03.2026"
    label: "Task contract, file scope policy, verification artifacts và benchmark harness"
  - date: "04.2026"
    label: "Rust CLI, local daemon, client protocol, status/settings/review commands"
  - date: "05.2026"
    label: "Terminal UI, task monitor, approval/review flow và Windows packaging"
  - date: "Hiện tại"
    label: "Đang thử nghiệm trong workflow dev để đo hiệu suất, reliability và verification quality"
storyBlocks:
  - title: "AI departments, not AI chats"
    body: "Together Working xem các AI coding agent như worker có vai trò, năng lực, trạng thái và phạm vi quyền hạn riêng. Codex không cần ôm toàn bộ context; nó điều phối, kiểm chứng và tích hợp kết quả từ các worker chuyên biệt."
  - title: "CLI-first operating layer"
    body: "Sản phẩm hiện được nâng lên thành CLI/TUI để phù hợp với môi trường làm việc thật của developer. Developer có thể kiểm tra trạng thái daemon, xem task, theo dõi monitor, gửi yêu cầu review, approve kết quả và điều chỉnh settings ngay trong terminal."
  - title: "Task contract thay cho prompt mở"
    body: "Mỗi task có scope, allowed files, denied files, deliverables, success criteria, reviewer và verification requirement. Điều này giảm rủi ro agent sửa ngoài phạm vi và giúp kết quả có thể kiểm tra trước khi integration."
  - title: "Đo hiệu suất bằng workflow thật"
    body: "Together Working đang được thử nghiệm trong các phiên làm việc của dev để quan sát context size, task latency, fallback rate, verification pass rate, diff quality và effort của con người khi review. Những chỉ số này là nền cho routing intelligence và benchmark đáng tin cậy."
gallery:
  - label: "System analysis 1"
    src: "/work/together-working/system-analysis-1.png"
  - label: "System analysis 2"
    src: "/work/together-working/system-analysis-2.png"
  - label: "System analysis 3"
    src: "/work/together-working/system-analysis-3.png"
  - label: "System analysis 4"
    src: "/work/together-working/system-analysis-4.png"
  - label: "System analysis 5"
    src: "/work/together-working/system-analysis-5.png"
  - label: "System analysis 6"
    src: "/work/together-working/system-analysis-6.png"
  - label: "System analysis 7"
    src: "/work/together-working/system-analysis-7.png"
  - label: "System analysis 8"
    src: "/work/together-working/system-analysis-8.png"
---

## Context

Together Working là CLI-first AI Department Operating System cho local AI worker teams, tập trung vào task nhỏ, worker chuyên biệt, state rõ ràng, review/verification bắt buộc và integration có kiểm soát.

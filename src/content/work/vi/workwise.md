---
locale: vi
title: "WorkWise"
summary: "Governed workflow router cho company operations, AI agent actions, policy, approval, audit và tối ưu chi phí model."
description: "WorkWise là lớp điều phối workflow cho các request vận hành có tiền, rủi ro, approval và audit. Dự án route từng bước qua parser, rule engine, small model, strong model hoặc human approval để giảm token waste nhưng vẫn giữ policy enforcement, approval path, evidence và audit trail."
overview: "WorkWise tập trung vào các operations request không nên xử lý như chat tự do: procurement intake, invoice exception handling và AI agent spend/action control. Dự án hiện ở giai đoạn phát triển và thử nghiệm, với mục tiêu kiểm chứng workflow routing, cost comparison, risk gating và human-in-the-loop approval trước khi mở rộng thương mại."
problem: "Khi doanh nghiệp đưa AI vào vận hành, các request liên quan đến invoice, procurement, refund, data export hoặc agent action không thể để model tự trả lời rồi tự chạy. Một single-model response có thể tốn token, bỏ sót policy, thiếu approval, thiếu evidence, khó audit, hoặc cho phép hành động vượt quyền."
approach: "WorkWise biến mỗi request thành một workflow có kiểm soát. Hệ thống phân loại workflow, trích xuất field quan trọng, chạy policy checks, tính risk level, chọn route rẻ nhất đủ dùng, yêu cầu approval khi cần, tạo action package và ghi lại audit trail theo từng step. Kiến trúc nhấn mạnh policy gate, model routing, tool permissions, spend tracking, workflow trace và reliability loop."
role: "Founder / Product Builder / Full Stack Developer"
period: "2026 - hiện tại"
featured: true
order: 6
heroImage: "/work/workwise/agent-registry.png"
showBody: false
metrics:
  - value: "3 Workflows"
    label: "procurement, invoice exception và agent control"
  - value: "Token Routing"
    label: "parser, rules, small model, strong model hoặc approval"
  - value: "Policy Audit"
    label: "risk scoring, approval path và audit trail"
outcomes:
  - "Xây dựng MVP direction cho ba workflow chính: procurement intake, invoice exception handling và AI agent spend/action control."
  - "Thiết kế Operations Inbox để gom request vận hành, phân loại workflow, nhận diện missing data, risk level và route xử lý phù hợp."
  - "Tạo routing model so sánh hybrid route với naive single-model baseline nhằm giảm token/cost cho các bước không cần model mạnh."
  - "Định nghĩa structured action package gồm extracted fields, missing data, risk factors, policy result, approval path, recommended action, evidence và audit timeline."
  - "Thiết kế control plane cho agent governance, tool permissions, action approvals, AI spend tracking, model routing, policy gate và workflow reliability."
  - "Dự án đang trong giai đoạn phát triển và thử nghiệm để kiểm chứng decision quality, cost saving, approval accuracy và khả năng vận hành theo shadow-mode."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/WorkWise"
    note: "Repository hiện đại diện cho MVP/prototype đang phát triển. Một số màn hình sản phẩm, system design và hướng governance đang được thử nghiệm trước khi thương mại hóa."
highlights:
  - title: "System overview"
    description: "WorkWise hoạt động như AI Ops Control Plane cho agents, models, tools, workflows, policy, approvals, spend và audit events."
    src: "/work/workwise/system-overview.png"
  - title: "System architecture"
    description: "Kiến trúc chia thành UI, application/control plane, gateway/SDK, integrations và data/storage để giữ governance ở tầng nền."
    src: "/work/workwise/system-architecture.png"
  - title: "Action lifecycle"
    description: "Một action đi qua model/tool gateway, policy gate, approval decision, execution, audit log, trace, retry và escalation."
    src: "/work/workwise/action-lifecycle.png"
  - title: "MVP product map"
    description: "Các màn cốt lõi gồm Agent Registry, Pending Approvals, AI Spend Dashboard, Workflow Trace và Policy Center."
    src: "/work/workwise/mvp-product-map.png"
timeline:
  - date: "01.2026"
    label: "Product framing cho token-efficient routing và governed company operations"
  - date: "02.2026"
    label: "MVP workflows cho procurement, invoice exception và AI agent spend/action control"
  - date: "03.2026"
    label: "Request analysis API, workflow templates và structured action package"
  - date: "04.2026"
    label: "Policy gate, approval queue, spend tracking và workflow trace design"
  - date: "05.2026"
    label: "System design cho agent governance, model routing, permissions và reliability"
  - date: "Hiện tại"
    label: "Đang phát triển và thử nghiệm workflow routing, risk gating, cost comparison và shadow-mode validation"
storyBlocks:
  - title: "Không phải chatbot vận hành"
    body: "WorkWise bắt đầu từ vấn đề thực tế: nhiều operations request có tiền, dữ liệu, tool access và trách nhiệm phê duyệt. Những request này cần workflow có policy, audit và approval, không chỉ một câu trả lời AI."
  - title: "Route theo bước, không đẩy hết vào model lớn"
    body: "Một request được tách thành nhiều bước. Parser xử lý cấu trúc, rule engine xử lý điều kiện rõ ràng, small model xử lý phân loại đơn giản, strong model chỉ dùng khi cần reasoning, còn human approval giữ quyền quyết định ở hành động rủi ro."
  - title: "Action package là đơn vị quyết định"
    body: "Kết quả không phải đoạn chat mà là action package: field đã trích xuất, dữ liệu còn thiếu, risk factors, policy result, approval path, recommended action, evidence và timeline. Điều này giúp người duyệt hiểu vì sao hệ thống đề xuất approve, reject, request info hoặc block."
  - title: "Phát triển theo hướng thử nghiệm có kiểm soát"
    body: "WorkWise hiện đang ở giai đoạn phát triển và thử nghiệm. Hướng triển khai phù hợp là shadow-mode: để hệ thống phân tích và đề xuất song song với quy trình thật, đo cost saving, decision quality và approval accuracy trước khi tự động hóa sâu hơn."
gallery:
  - label: "Agent Registry"
    src: "/work/workwise/agent-registry.png"
  - label: "Agent Governance"
    src: "/work/workwise/agent-governance.png"
  - label: "Tool Permissions and Access Control"
    src: "/work/workwise/tool-permissions.png"
  - label: "Agent Action Approvals"
    src: "/work/workwise/action-approvals.png"
  - label: "AI Spend Limit and Cost Tracking"
    src: "/work/workwise/spend-tracking.png"
  - label: "Model Routing Optimization"
    src: "/work/workwise/model-routing.png"
  - label: "Policy Gate"
    src: "/work/workwise/policy-gate.png"
  - label: "Workflow Reliability"
    src: "/work/workwise/workflow-reliability.png"
---

## Context

WorkWise là governed workflow router cho company operations, được phát triển để kiểm soát các request và AI actions có rủi ro bằng routing, policy, approval, audit và cost governance.

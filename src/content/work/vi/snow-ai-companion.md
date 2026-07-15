---
locale: vi
title: "Snow AI Companion"
summary: "AI companion an toàn cho trẻ em, tập trung vào hội thoại có kiểm soát, routine support, parent dashboard và kiến trúc AI safety."
description: "Snow AI Companion là dự án AI companion an toàn dành cho trẻ em, đặc biệt hướng tới các nhóm trẻ cần tương tác nhẹ nhàng, có cấu trúc và có giám sát. Phiên bản mới nhất vẫn chưa được cập nhật và công khai đầy đủ vì dự án vẫn đang trong quá trình phát triển và nâng cấp."
overview: "Snow kết hợp giao diện trẻ em, AI hội thoại, routine flow, parent dashboard, lớp kiểm soát chủ đề, giới hạn hành vi AI và kiến trúc backend/frontend được thiết kế riêng cho trải nghiệm an toàn. Các hình ảnh hiện tại mô tả luồng chat, routine, dashboard phụ huynh, use-case, ERD và kiến trúc hệ thống."
problem: "AI companion cho trẻ em không thể chỉ là chatbot mở. Hệ thống cần kiểm soát chủ đề, tone phản hồi, lịch sử tương tác, quyền của phụ huynh, routine hằng ngày, giới hạn dữ liệu cá nhân và cơ chế tránh phản hồi không phù hợp."
approach: "Dự án được thiết kế quanh các flow có cấu trúc: chat flow, routine flow, parent dashboard flow, use-case, ERD, frontend architecture và backend architecture. Về AI, trọng tâm là prompt policy, guardrails, context giới hạn, memory có kiểm soát, parent-approved topics và các lớp kiểm tra trước/sau phản hồi để giữ trải nghiệm an toàn."
role: "Founder / Product Builder / AI Product Engineer"
period: "2026"
featured: true
order: 5
heroImage: "/work/snow-ai-companion/main.png"
highlights:
  - title: "Main product screen"
    description: "Child-friendly AI companion interface for guided interaction."
    src: "/work/snow-ai-companion/main.png"
  - title: "Chat flow"
    description: "Structured conversation flow with safer AI interaction boundaries."
    src: "/work/snow-ai-companion/sequence-chat-flow.png"
  - title: "Routine flow"
    description: "Daily routine support designed for predictable, low-friction guidance."
    src: "/work/snow-ai-companion/sequence-routine-flow.png"
  - title: "Parent dashboard"
    description: "Parent-side control and monitoring flow for safety and visibility."
    src: "/work/snow-ai-companion/sequence-parent-dashboard-flow.png"
gallery:
  - label: "Snow main UI"
    src: "/work/snow-ai-companion/main.png"
  - label: "Chat sequence flow"
    src: "/work/snow-ai-companion/sequence-chat-flow.png"
  - label: "Routine sequence flow"
    src: "/work/snow-ai-companion/sequence-routine-flow.png"
  - label: "Parent dashboard flow"
    src: "/work/snow-ai-companion/sequence-parent-dashboard-flow.png"
  - label: "System overview architecture"
    src: "/work/snow-ai-companion/system-overview.png"
  - label: "Backend architecture"
    src: "/work/snow-ai-companion/backend-architecture.png"
  - label: "Frontend architecture"
    src: "/work/snow-ai-companion/frontend-architecture.png"
  - label: "ERD"
    src: "/work/snow-ai-companion/erd.png"
  - label: "Use case diagram"
    src: "/work/snow-ai-companion/use-case.png"
storyBlocks:
  - title: "AI có ranh giới"
    body: "Snow được thiết kế theo hướng AI companion có kiểm soát: phản hồi nằm trong chủ đề được cho phép, có giới hạn hành vi, có dashboard phụ huynh và không dựa vào một chatbot mở không kiểm soát."
  - title: "Flow cho trẻ em"
    body: "Các flow chính gồm chat, routine hằng ngày và hỗ trợ cảm xúc nhẹ. Mục tiêu là tạo trải nghiệm dễ đoán, lặp lại được và không gây quá tải cho trẻ."
  - title: "Đang thử nghiệm thực tế"
    body: "Impact hiện tại nằm ở giai đoạn khảo sát và thử nghiệm với nhóm trẻ em tại Việt Nam, Úc, nhằm đánh giá tính phù hợp của tương tác, routine support và mức độ chấp nhận của phụ huynh."
showBody: false
metrics:
  - value: "Pilot"
    label: "khảo sát thực tế với trẻ em Việt Nam và Úc"
  - value: "Safe AI"
    label: "guardrails, topic control và parent oversight"
  - value: "Routine"
    label: "chat flow, routine flow và dashboard phụ huynh"
outcomes:
  - "Đang được thử nghiệm và khảo sát thực tế với các nhóm trẻ em tại Việt Nam, Úc và một số bối cảnh sử dụng ban đầu."
  - "Thiết kế được hệ thống AI companion có kiểm soát, cân bằng giữa hỗ trợ giao tiếp, routine hằng ngày và giám sát của phụ huynh."
  - "Xây dựng bộ flow và kiến trúc sản phẩm gồm chat, routine, parent dashboard, use-case, ERD, frontend/backend architecture."
  - "Phiên bản mới nhất vẫn đang được phát triển và nâng cấp nên chưa được public đầy đủ."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/agentkid_snow"
    note: "Phiên bản mới nhất vẫn chưa được cập nhật và công khai đầy đủ vì dự án vẫn đang trong quá trình phát triển và nâng cấp."
---

## Context

Snow AI Companion là một dự án AI companion an toàn dành cho trẻ tự kỉ, kết hợp AI hội thoại, giọng nói, nhân vật tương tác, routine hằng ngày và bảng điều khiển dành cho phụ huynh. Dự án tập trung vào việc xây dựng một người bạn ảo nhẹ nhàng, có kiểm soát, giúp trẻ luyện giao tiếp, nhận diện cảm xúc và duy trì thói quen sinh hoạt.

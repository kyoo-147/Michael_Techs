---
locale: vi
title: "DotX Aero"
summary: "Trợ lý giọng nói smart home chạy cục bộ và hệ thống điều khiển IoT qua AI server, MQTT và ESP32."
description: "DotX Aero là kiến trúc local-first cho smart-home voice assistant và IoT control. Dự án kết hợp wake-word detection, STT/TTS tiếng Việt, Ollama reasoning cục bộ, MQTT, ESP32 firmware và lớp thực thi thiết bị, đồng thời là nền tảng phát triển cho Gardon."
overview: "Hệ thống được thiết kế để triển khai thực tế trong nhà dân: voice client nhận lệnh, AI server suy luận ý định, còn thiết bị nhúng thực thi qua MQTT."
problem: "Các hệ thống smart home điều khiển bằng giọng nói thường phụ thuộc nhiều vào cloud service và integration dễ vỡ. Dự án thử nghiệm một kiến trúc local có thể hiểu lệnh tiếng Việt, điều khiển relay vật lý và giữ latency thấp trên phần cứng phổ thông."
approach: "Dự án nghiên cứu kiến trúc embedded nhẹ, điều khiển AI cục bộ latency thấp, MQTT device routing và firmware pattern có thể chạy trên vi mạch nhúng và mạng nội bộ gia đình."
role: "Founder / AI Engineer / IoT Developer"
period: "2024"
featured: true
order: 7
heroImage: "/work/dotx/system.png"
highlights:
  - title: "System architecture"
    description: "Local voice assistant, AI server, MQTT and ESP32 device execution layers."
    src: "/work/dotx/system.png"
video:
  src: "/work/dotx/demo.mp4"
  label: "DotX Aero demo"
  description: "Demo of local AI voice control for smart-home devices."
gallery:
  - label: "DotX Aero system architecture"
    src: "/work/dotx/system.png"
  - label: "DotX Aero video demo"
    src: "/work/dotx/demo.mp4"
showBody: false
metrics:
  - value: "Homes"
    label: "lắp đặt và sử dụng tại căn hộ nhà dân"
  - value: "ESP32"
    label: "lớp thực thi thiết bị qua MQTT"
  - value: "Gardon"
    label: "nền tảng cho hệ smart-garden"
outcomes:
  - "Triển khai lắp đặt và sử dụng thành công tại các căn hộ của nhà dân."
  - "Thiết kế kiến trúc local AI + MQTT + ESP32 tối ưu cho smart-home control trên vi mạch nhúng."
  - "Trở thành nền phát triển cho Gardon, ứng dụng quản lý và thiết kế nâng cấp thêm cho hệ thống này."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/DotX_Aero"
    note: "Thông báo lưu trữ: Dự án được phát triển khoảng 2 năm trước và hiện không còn hoạt động. Các cập nhật hiện tại chỉ phục vụ mục đích lưu trữ; công nghệ sử dụng có thể đã cũ và repository chỉ nên được xem như tài liệu tham khảo."
  - label: "Gardon continuation"
    href: "/vi/work/gardon"
    note: "Gardon mở rộng nền tảng IoT/smart-home này thành hệ thống smart-garden hoàn chỉnh hơn."
---

## Context

DotX Aero là voice assistant local archive cho smart home và IoT control.

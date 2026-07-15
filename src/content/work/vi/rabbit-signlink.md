---
locale: vi
title: "Rabbit SignLink"
summary: "Dự án nghiên cứu và dạy học về nhận diện ngôn ngữ ký hiệu bằng computer vision, CNN/SIFT và phản hồi bằng giọng nói."
description: "Rabbit SignLink là prototype nghiên cứu và dạy học cho bài toán học/nghiên cứu ngôn ngữ ký hiệu. Dự án bao gồm quá trình thu thập dữ liệu, gán nhãn gesture, huấn luyện và kiểm thử pipeline nhận diện, thiết kế giao diện PyQt và kiến trúc hệ thống để chuyển ký hiệu thành text và voice feedback."
overview: "Dự án được giữ ở phạm vi nghiên cứu học thuật: minh họa đầy đủ vòng lặp từ chuẩn bị dữ liệu, nhận diện gesture, kiểm thử, hiển thị kết quả đến phản hồi bằng giọng nói."
problem: "Một công cụ học ngôn ngữ ký hiệu cần có dữ liệu rõ ràng, quy trình kiểm thử lặp lại được và phản hồi đủ nhanh trong khi camera, model inference và audio playback chạy đồng thời."
approach: "Hệ thống kết hợp OpenCV để xử lý vùng tay, CNN classification cho ASL alphabet signs, SIFT/FLANN matching cho custom gestures, PyQt threading, local language processing và Edge TTS playback."
role: "Founder / Computer Vision Engineer / AI Developer"
period: "2023"
featured: true
order: 10
heroImage: "/work/rabbit-signlink/demo.png"
video:
  src: "/work/rabbit-signlink/demo-small.mp4"
  label: "Rabbit SignLink demo"
  description: "Short walkthrough of the sign-language learning and recognition prototype."
gallery:
  - label: "Rabbit SignLink demo UI"
    src: "/work/rabbit-signlink/demo.png"
  - label: "Rabbit SignLink video demo"
    src: "/work/rabbit-signlink/demo-small.mp4"
showBody: false
metrics:
  - value: "Research"
    label: "prototype học computer vision"
  - value: "Dataset"
    label: "thu thập, gán nhãn và kiểm thử gesture"
  - value: "Teaching"
    label: "workflow gọn cho dạy AI/CV"
outcomes:
  - "Xây dựng prototype nhận diện ngôn ngữ ký hiệu phục vụ nghiên cứu và dạy học."
  - "Bao phủ quy trình chuẩn bị dữ liệu, huấn luyện gesture, kiểm thử nhận diện và phản hồi UI."
  - "Triển khai pipeline hybrid CNN và SIFT/FLANN kèm phản hồi giọng nói cho ký hiệu nhận diện được."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/Rabbit-SignLink"
    note: "Dành cho cộng đồng học thuật & nghiên cứu: Dự án ban đầu được thiết kế như một sáng kiến nghiên cứu open-source nhằm khám phá giải pháp hỗ trợ tiếp cận cho cộng đồng người khiếm thính và khó nghe. Trạng thái archive: Dự án đã chính thức được lưu trữ và không còn được phát triển tích cực; các dependency lõi như Keras/TensorFlow phiên bản cũ có thể đã lỗi thời. Mục đích lưu trữ: Mọi cập nhật và cấu hình hiện tại chỉ phục vụ bảo tồn lịch sử, lưu trữ và tham khảo học thuật."
---

## Context

Rabbit SignLink là dự án assistive AI archive cho gesture recognition và voice feedback.

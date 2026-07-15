---
title: 'Computer vision trên edge device: học từ Meta Mask R-CNN2Go'
description: >-
  Một bài ngắn về edge AI, latency và các câu hỏi cần trả lời trước khi đưa
  computer vision xuống thiết bị thật.
pubDatetime: '2023-01-17T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Computer Vision
  - Edge AI
  - Meta
  - Mask R-CNN2Go
  - Real-time Inference
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Edge AI nghe rất hấp dẫn: model chạy ngay trên thiết bị, không cần gửi dữ liệu lên server, latency thấp hơn, riêng tư hơn.

Nhưng edge AI cũng là nơi mọi thứ trở nên thực tế hơn rất nhiều. Thiết bị có giới hạn. CPU/GPU có giới hạn. Bộ nhớ có giới hạn. Môi trường chạy không sạch như notebook.

Meta Mask R-CNN2Go là một case tốt để nhìn edge AI bằng con mắt production.

### 1. Vì sao on-device computer vision quan trọng?

Có những bài toán không nên hoặc không thể gửi ảnh/video lên cloud liên tục:

- camera công nghiệp cần phản hồi nhanh;
- ứng dụng mobile cần realtime AR;
- dữ liệu hình ảnh nhạy cảm;
- mạng không ổn định;
- chi phí upload/inference cloud quá cao.

Khi đó, chạy model gần nguồn dữ liệu là lựa chọn hợp lý.

### 2. Meta Mask R-CNN2Go cho thấy điều gì?

Meta nói Mask R-CNN2Go là model computer vision tối ưu cho embedded/mobile devices và hỗ trợ các use case như object detection, person segmentation, body pose estimation với realtime inference.

Điều này cho thấy một hướng quan trọng: để một model vào sản phẩm, phải tối ưu theo điều kiện chạy thật.

Không phải cứ model lớn nhất là tốt nhất.

### 3. Checklist khi đưa CV xuống edge

Trước khi deploy, nên hỏi:

- FPS yêu cầu là bao nhiêu?
- Mỗi frame được phép xử lý trong bao nhiêu ms?
- Có cần batch không hay infer từng frame?
- Ảnh đầu vào có cần resize/crop không?
- Model có chạy ổn khi ánh sáng thay đổi không?
- Có cần lưu ảnh lỗi để review lại không?
- Khi model không chắc chắn, hệ thống làm gì?

Ví dụ với QC camera, một false negative có thể khiến sản phẩm lỗi lọt qua. Khi đó threshold, review workflow và logging quan trọng không kém model.

### 4. Một flow edge CV đơn giản

```text
Industrial Camera
→ Frame Capture
→ Crop/Normalize
→ Edge Model Inference
→ Decision Rule
→ UI Alert / PLC Signal
→ Store Result for Audit
```

Điểm hay là flow này không quá phức tạp, nhưng nó buộc mình suy nghĩ từ đầu đến cuối.

### 5. Kết luận

Edge AI không chỉ là “model chạy local”. Nó là bài toán sản phẩm: latency, privacy, hardware, reliability, monitoring và fallback.

Nếu làm computer vision cho sản xuất, đây là mindset rất cần: model chỉ là một block trong hệ thống lớn hơn.

## Nguồn tham khảo

- Meta Engineering — Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN: https://arxiv.org/abs/1703.06870

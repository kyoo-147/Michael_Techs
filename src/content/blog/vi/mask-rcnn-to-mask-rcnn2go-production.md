---
title: >-
  Từ Mask R-CNN đến Mask R-CNN2Go: khi computer vision research đi vào
  production
description: >-
  Một bài ghi chú về cách một ý tưởng computer vision từ research có thể được
  tối ưu để chạy trên thiết bị thật.
pubDatetime: '2023-02-09T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Computer Vision
  - Edge AI
  - Mask R-CNN2Go
  - Production ML
  - Segmentation
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Một paper tốt chưa tự động trở thành một sản phẩm tốt.

Trong computer vision, khoảng cách giữa research và production thường nằm ở những thứ rất đời thường: model chạy có đủ nhanh không, có chạy được trên thiết bị thật không, tốn bao nhiêu bộ nhớ, có ổn định khi ánh sáng thay đổi không, và có dễ tích hợp vào pipeline hiện tại không.

Mask R-CNN2Go của Meta là một case đáng học vì nó không chỉ nói về thuật toán, mà nói về hướng đưa computer vision xuống thiết bị mobile/embedded.

### 1. Từ Mask R-CNN

Mask R-CNN là một framework mạnh cho instance segmentation. Nó phát hiện object và đồng thời tạo mask cho từng object instance.

Về mặt research, nó rất quan trọng vì gom được nhiều bài toán lại gần nhau:

- object detection;
- instance segmentation;
- keypoint detection;
- phân tích object ở mức chi tiết hơn bounding box.

Nhưng research model thường chưa tối ưu trực tiếp cho môi trường bị giới hạn tài nguyên.

### 2. Đến Mask R-CNN2Go

Meta công bố Mask R-CNN2Go như một model computer vision tối ưu cho embedded và mobile devices. Theo bài viết của Meta Engineering, model này phục vụ các use case on-device như:

- object detection;
- classification;
- person segmentation;
- body pose estimation;
- real-time inference.

Điểm đáng học ở đây là: bài toán không còn là “accuracy cao nhất trên benchmark”, mà là “accuracy đủ tốt, latency đủ thấp, chạy được trên thiết bị thật”.

### 3. Production thay đổi câu hỏi kỹ thuật

Khi làm production, câu hỏi thường chuyển thành:

- Model có chạy được realtime không?
- Có cần gửi ảnh lên server không, hay chạy local?
- Thiết bị có đủ RAM/CPU/GPU không?
- Nếu model sai thì user/system phản ứng thế nào?
- Có cần update model thường xuyên không?
- Có log được lỗi để cải thiện dataset không?

Với camera QC trong nhà máy, câu hỏi cũng tương tự. Một model detect lỗi tốt nhưng inference quá chậm thì dây chuyền vẫn bị nghẽn. Một model chính xác trong lab nhưng fail khi ánh sáng thay đổi thì chưa đủ dùng.

### 4. Ví dụ nhỏ: camera QC

Giả sử hệ thống kiểm tra vỉ thuốc:

```text
Camera → Preprocess → Model inference → Classification → QC decision → Report
```

Nếu chạy ở edge device, ta cần quan tâm:

- ảnh đầu vào có cố định kích thước không;
- có cần crop vùng quan tâm trước khi infer không;
- model có thể chạy trong giới hạn thời gian mỗi sản phẩm không;
- false negative có nguy hiểm hơn false positive không;
- kết quả có cần lưu lại để audit không.

Ở đây, edge AI không chỉ là “deploy model nhỏ hơn”. Nó là thiết kế toàn bộ luồng xử lý sao cho phù hợp với môi trường thật.

### 5. Bài học rút ra

Tôi thích case Mask R-CNN2Go vì nó nhắc một điều khá quan trọng: research là điểm bắt đầu, production mới là nơi kỹ thuật bị kiểm tra.

Computer vision product không chỉ cần model. Nó cần camera, dữ liệu, preprocessing, inference, UI, logging, fallback và quy trình vận hành.

## Nguồn tham khảo

- Meta Engineering — Facebook joins MLPerf, open-sources Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN paper: https://arxiv.org/abs/1703.06870
- FAIR at 5: https://engineering.fb.com/2018/12/05/ai-research/fair-fifth-anniversary/

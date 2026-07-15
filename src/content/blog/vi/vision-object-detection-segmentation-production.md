---
title: 'Vision, object detection và segmentation: hiểu đúng trước khi đưa vào sản phẩm'
description: >-
  Ghi chú ngắn về object detection, segmentation và lý do các bài toán computer
  vision thật thường cần nhiều hơn một bounding box.
pubDatetime: '2023-03-02T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Computer Vision
  - Object Detection
  - Segmentation
  - Mask R-CNN
  - AI Research
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Nhiều người bắt đầu học computer vision bằng một demo rất quen thuộc: đưa ảnh vào model, model vẽ bounding box quanh người, xe, chai nước hoặc một vật thể nào đó.

Demo đó hay, nhưng nếu đem vào sản phẩm thật thì vẫn còn thiếu khá nhiều.

Một hệ thống vision trong production thường không chỉ cần biết **có vật thể gì**, mà còn cần biết **vật thể nằm chính xác ở đâu**, **biên của nó như thế nào**, **nó có ảnh hưởng gì đến quyết định tiếp theo**, và **sai số nào là chấp nhận được**.

Bài này ghi lại ngắn gọn sự khác nhau giữa object detection và segmentation, dựa trên Mask R-CNN và các bài viết/nghiên cứu liên quan.

### 1. Object detection trả lời câu hỏi gì?

Object detection thường trả lời ba câu hỏi:

- Trong ảnh có object nào?
- Object đó thuộc class gì?
- Object đó nằm trong bounding box nào?

Ví dụ trong camera kiểm tra sản phẩm, model có thể trả về:

```json
{
  "class": "defect",
  "confidence": 0.91,
  "box": [120, 80, 260, 190]
}
```

Như vậy là đủ cho nhiều bài toán: đếm vật thể, phát hiện lỗi rõ ràng, cảnh báo khi có người đi vào vùng nguy hiểm.

Nhưng bounding box vẫn là một hình chữ nhật. Nó không mô tả chính xác hình dạng thật của vật thể. Nếu vật thể bị cong, méo, bị che khuất, hoặc có vùng lỗi rất nhỏ thì bounding box có thể quá thô.

### 2. Segmentation đi sâu hơn một bước

Segmentation không chỉ vẽ hộp. Nó cố gắng phân vùng từng pixel thuộc về object.

Có ba kiểu thường gặp:

- **Semantic segmentation:** mỗi pixel thuộc class nào, ví dụ road, sky, person.
- **Instance segmentation:** phân biệt từng object riêng lẻ, ví dụ người số 1, người số 2.
- **Panoptic segmentation:** kết hợp semantic và instance.

Mask R-CNN là một framework nổi tiếng vì nó vừa detect object, vừa tạo segmentation mask cho từng object instance. Paper Mask R-CNN trình bày cách mở rộng Faster R-CNN bằng thêm một nhánh dự đoán mask song song với nhánh classification và bounding box.

Điểm đáng chú ý là: object detection cho ta “vật này ở đây”, còn instance segmentation cho ta “vật này chiếm đúng vùng này”.

### 3. Vì sao chuyện này quan trọng trong sản phẩm thật?

Trong sản xuất công nghiệp, segmentation có thể hữu ích khi lỗi không nằm gọn trong một hình chữ nhật đẹp.

Ví dụ:

- vỉ thuốc bị lệch mép;
- viên thuốc biến dạng;
- nhãn bị rách một vùng nhỏ;
- bề mặt có vết xước mảnh;
- vật thể dính chồng lên nhau.

Nếu chỉ nhìn bounding box, hệ thống biết “có lỗi”. Nhưng nếu cần đo diện tích lỗi, vị trí lỗi, mức độ lan rộng hoặc so sánh với tiêu chuẩn QC, segmentation sẽ cho dữ liệu tốt hơn.

Trong xe tự hành, segmentation cũng quan trọng vì xe không chỉ cần biết “có người phía trước”, mà còn cần hiểu vùng đường, làn xe, vỉa hè, vật cản, vùng có thể đi được và vùng không nên đi vào.

### 4. Một cách suy nghĩ thực tế

Khi chọn detection hay segmentation, tôi sẽ không hỏi “model nào xịn hơn”, mà hỏi:

- Quyết định cuối cùng của hệ thống là gì?
- Bounding box có đủ để đưa ra quyết định không?
- Có cần biết hình dạng chính xác của object không?
- Sai số pixel-level có ảnh hưởng tới safety hoặc chất lượng không?
- Latency có cho phép chạy segmentation không?

Ví dụ với một dashboard đếm số sản phẩm lỗi, detection có thể đủ. Nhưng với một máy QC cần phân loại mức độ lỗi trên bề mặt, segmentation đáng cân nhắc hơn.

### 5. Kết luận

Object detection là điểm khởi đầu tốt. Nhưng khi sản phẩm đi vào môi trường thật, câu hỏi sẽ chuyển từ “model detect được không?” sang “kết quả đó có đủ tốt để hệ thống ra quyết định không?”.

Đây cũng là khác biệt giữa demo AI và product AI.

## Nguồn tham khảo

- Mask R-CNN: https://arxiv.org/abs/1703.06870
- Meta Research — Mask R-CNN: https://research.facebook.com/publications/mask-r-cnn/
- Meta Engineering — Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/

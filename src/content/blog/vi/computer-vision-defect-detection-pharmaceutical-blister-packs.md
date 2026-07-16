---
title: "Computer vision defect detection cho vỉ thuốc pharmaceutical blister packs"
description: "Case study về dự án computer vision defect detection cho vỉ thuốc, từ luồng kiểm tra, tư duy dataset, validation đến ràng buộc sản xuất."
pubDatetime: "2026-07-15T08:00:00.000Z"
locale: vi
author: Michael
featured: true
tags:
  - Computer Vision Defect Detection Project
  - Pharmaceutical QC
  - Machine Vision
  - Applied AI
  - Case Study
categories:
  - AI
  - Technical
  - Product
---

Kiểm tra lỗi vỉ thuốc là ví dụ rõ cho việc dự án computer vision cần nhiều hơn một model.

Bài toán nghe đơn giản: phát hiện lỗi trên blister pack. Nhưng khi đi vào thực tế, hệ thống phải xử lý ánh sáng, phản chiếu, sai khác bao bì, vị trí camera, ngưỡng chấp nhận và chi phí của quyết định sai.

Đây là cách tôi tiếp cận một **computer vision defect detection project** cho kiểm soát chất lượng dược phẩm.

## Bài toán kiểm tra

Máy cần phát hiện các trạng thái như thiếu viên, seal lỗi, viên đặt sai vị trí, nhiễm bẩn bề mặt, viên vỡ hoặc trạng thái bao bì bất thường.

Điểm quan trọng không chỉ là detect. Hệ thống phải đi được vào luồng kiểm tra sản xuất:

```txt
Chụp ảnh
    -> chuẩn hóa ánh sáng và vùng quan tâm
    -> kiểm tra từng ô blister
    -> phân loại lỗi
    -> hiển thị frame bằng chứng
    -> đưa ra pass/fail
    -> lưu trace để review
```

Trong môi trường kiểm soát chất lượng, kết quả không có bằng chứng là kết quả yếu. Operator cần thấy vì sao hệ thống loại một pack.

## Tư duy dataset

Dataset thường là phần khó nhất.

Model chỉ học từ mẫu đẹp có thể demo tốt nhưng fail trong xưởng. Dataset thực tế cần:

- pack bình thường dưới nhiều điều kiện ánh sáng;
- mẫu borderline mà con người cũng dễ tranh luận;
- dữ liệu từ nhiều batch bao bì;
- mẫu lỗi gắn với rule kiểm tra rõ ràng;
- ảnh lấy từ setup camera thật, không chỉ từ lab.

Mục tiêu không phải tối đa một benchmark. Mục tiêu là ổn định trước sai khác sản xuất.

## Thiết kế hệ thống

Tôi thích cách tiếp cận nhiều lớp:

1. Dùng xử lý ảnh deterministic cho alignment, crop và phát hiện vùng rõ ràng.
2. Dùng ML/CV model cho phân loại lỗi và anomaly detection.
3. Giữ UI review cho trường hợp không chắc chắn.
4. Log mọi kết quả kèm ảnh bằng chứng và metadata kiểm tra.

Không phải phần nào cũng cần deep learning. Xử lý ảnh truyền thống thường ổn định hơn cho alignment và hình học đơn giản. AI nên tập trung vào phần đánh giá hình ảnh khó.

## Đo thành công

Metric hữu ích phải gần sản xuất:

- false reject rate;
- false accept rate;
- latency kiểm tra mỗi pack;
- tỷ lệ operator override;
- defect recall theo từng loại;
- độ ổn định khi đổi ánh sáng hoặc batch.

Accuracy không đủ. Model reject quá nhiều pack tốt sẽ làm chậm dây chuyền. Model accept pack lỗi tạo rủi ro chất lượng.

## Điều tôi rút ra

Computer vision trong sản xuất là một hệ thống kỹ thuật, không chỉ là notebook.

Camera, ánh sáng, UI, workflow operator, evidence trail và kế hoạch bảo trì quan trọng ngang model. Một hệ thống defect detection tốt cần đủ dễ hiểu cho operator, đủ đo được cho engineer và đủ ổn định cho production.

Dự án liên quan: [Pharmaceutical QC Defect Detection Machine](/vi/work/computer-vision-qc-system).


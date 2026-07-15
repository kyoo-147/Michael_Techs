---
title: ML platform cần những khối nào? Học từ Uber Michelangelo
description: >-
  Phân tích Uber Michelangelo để hiểu một ML platform production cần data,
  training, deployment, prediction và monitoring.
pubDatetime: '2022-02-17T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - ML Systems & MLOps
  - Uber
  - Michelangelo
  - ML Platform
  - Model Serving
  - Monitoring
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Một model ML chạy tốt trong notebook chưa phải là một hệ thống ML.

Production ML cần nhiều thứ hơn: dữ liệu đúng, training có thể lặp lại, deployment an toàn, prediction ổn định, monitoring sau deploy và khả năng rollback khi có lỗi.

Uber Michelangelo là một case kinh điển để hiểu vì sao công ty lớn cần ML platform.

### 1. Michelangelo giải quyết vấn đề gì?

Theo Uber Engineering, Michelangelo được thiết kế để giúp các team build, deploy và operate machine learning solutions ở scale của Uber.

Nó bao phủ end-to-end ML workflow:

- data management;
- training;
- evaluation;
- deployment;
- prediction;
- monitoring.

Nói đơn giản, Michelangelo cố gắng biến ML từ các project riêng lẻ thành một nền tảng chung.

### 2. Vì sao ML platform cần thiết?

Khi mỗi team tự build một pipeline riêng, vấn đề sẽ xuất hiện:

- dữ liệu training và serving không nhất quán;
- model khó reproduce;
- deploy thủ công;
- không biết model đang drift hay không;
- không có cách theo dõi prediction quality;
- mỗi project phải tự làm lại những thứ giống nhau.

ML platform sinh ra để giảm những phần lặp lại đó.

### 3. Một ML platform tối giản có thể gồm gì?

Với project nhỏ, mình không cần build Michelangelo. Nhưng có thể học cấu trúc:

```text
Data Source
→ Feature / Dataset Version
→ Training Pipeline
→ Evaluation Report
→ Model Registry
→ Model Serving API
→ Monitoring
→ Rollback
```

Một version cực gọn cho portfolio:

```text
PostgreSQL / CSV
→ Training script
→ Evaluation metrics
→ Saved model
→ FastAPI endpoint
→ Docker deployment
→ Basic logs + latency metrics
```

### 4. Ví dụ: lead scoring trong CRM

Một CRM muốn score lead có thể cần:

- dữ liệu lead;
- lịch sử tương tác;
- kết quả deal;
- feature extraction;
- model training;
- API dự đoán score;
- dashboard hiển thị score;
- monitoring xem score có còn hữu ích không.

Nếu chỉ train model rồi dừng lại, hệ thống chưa tạo được nhiều giá trị. Giá trị nằm ở chỗ score đi vào workflow: lead nào cần gọi trước, follow-up nào nên gửi, quote nào cần ưu tiên.

### 5. Kết luận

Uber Michelangelo cho thấy ML platform không phải thứ xa xỉ. Nó là phản ứng tự nhiên khi ML đi vào production và nhiều team cùng dùng.

Với project nhỏ, không cần copy toàn bộ. Nhưng nên học nguyên tắc: ML phải có vòng đời rõ ràng, không chỉ có notebook.

## Nguồn tham khảo

- Uber Engineering — Meet Michelangelo: Uber's Machine Learning Platform: https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/
- Uber Engineering — Scaling Machine Learning at Uber with Michelangelo: https://www.uber.com/us/en/blog/scaling-michelangelo/

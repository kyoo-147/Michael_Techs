---
title: Microservice Architecture Patterns for Scalable ML Systems
description: >-
  Ghi chú thực tế về cách chia một hệ thống Machine Learning thành các service
  nhỏ hơn để dễ deploy, monitor và mở rộng.
pubDatetime: '2022-12-01T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - ML Systems & MLOps
  - Microservices
  - ML Systems
  - Scalable Architecture
  - Deployment
  - Monitoring
  - Recommendation Systems
categories:
  - Technical
  - AI
---

Có một điểm khá dễ nhầm khi học Machine Learning: mình cứ nghĩ làm ra model tốt là xong.

Nhưng trong sản phẩm thật, model chỉ là một phần nhỏ. Còn lại là dữ liệu đi vào ở đâu, model được deploy ra sao, service nào gọi model, lỗi thì biết bằng cách nào, version mới có làm hỏng workflow cũ không, và nếu traffic tăng thì hệ thống có chịu nổi không.

Đó là lý do tôi muốn đọc về **microservice architecture cho ML systems**. Không phải vì microservice lúc nào cũng tốt, mà vì nó buộc mình phải nhìn ML như một hệ thống production, không phải một notebook chạy xong rồi để đó.

## 1. Vấn đề thật sự

Một ML system đơn giản thường bắt đầu như thế này:

```txt
Data → Train model → Save model → API predict → Frontend hiển thị kết quả
```

Ở giai đoạn demo, flow này ổn.

Nhưng khi vào production, mọi thứ bắt đầu phức tạp hơn:

- dữ liệu thay đổi theo thời gian;
- model có nhiều version;
- inference cần latency thấp;
- một số task cần chạy background;
- có service cần scale nhiều hơn service khác;
- lỗi có thể nằm ở data, model, API, queue, database hoặc frontend;
- monitoring không tốt thì model chết âm thầm mà không ai biết.

Bài paper *Microservice Architecture Patterns for Scalable Machine Learning Systems* mô tả hướng chia ML workflow thành các service độc lập thay vì để mọi thứ trong một khối monolith. Ý chính là: training, inference, preprocessing, monitoring, deployment có thể được đóng gói thành những component riêng để dễ mở rộng và vận hành hơn.

## 2. Không nên hiểu microservice như một trào lưu

Microservice không phải là cứ tách càng nhỏ càng tốt.

Nếu project còn nhỏ, tách quá sớm sẽ làm hệ thống rối hơn: nhiều repo hơn, nhiều API hơn, nhiều config hơn, nhiều điểm lỗi hơn. Nhưng nếu hệ thống bắt đầu có nhiều loại workload khác nhau, microservice trở nên có lý.

Ví dụ trong một AI workflow:

```txt
Frontend CRM
  ↓
Backend API
  ↓
Workflow Service
  ↓
LLM Service / ML Inference Service
  ↓
Database + Vector Database + Logging
```

Ở đây, `Backend API` và `ML Inference Service` không nhất thiết phải scale giống nhau. Dashboard CRM có thể nhiều request đọc dữ liệu, còn inference service có thể tốn GPU/CPU hơn. Nếu để chung một app, tối ưu sẽ khó hơn.

## 3. Một cách chia service dễ hiểu

Với một ML system thực tế, có thể chia thành các nhóm sau:

### Data Service

Chịu trách nhiệm lấy dữ liệu, validate schema, làm sạch dữ liệu, lưu metadata.

Ví dụ:

```txt
lead_events
customer_profiles
conversation_logs
product_catalog
```

Trong CRM, service này đảm bảo dữ liệu lead không bị thiếu email, phone, source, stage hoặc timestamp.

### Training Service

Chịu trách nhiệm train hoặc fine-tune model. Service này không nhất thiết chạy liên tục. Có thể chạy theo lịch hoặc theo trigger.

```txt
new labeled data → train model → evaluate → register version
```

### Inference Service

Đây là phần nhận request và trả prediction.

Ví dụ:

```http
POST /predict/lead-score
{
  "lead_source": "website",
  "industry": "restaurant",
  "last_message": "I need a CRM demo"
}
```

Response:

```json
{
  "score": 0.82,
  "priority": "high",
  "reason": "Lead requested a demo and provided business context"
}
```

### Monitoring Service

Theo dõi latency, error rate, input distribution, output distribution, business metric.

Đây là phần nhiều người bỏ qua. Nhưng production ML mà không có monitoring thì giống như lái xe ban đêm mà không bật đèn.

### Workflow Service

Chịu trách nhiệm nối model với business action.

Ví dụ:

```txt
lead score > 0.8
→ tạo deal
→ gửi follow-up
→ nhắc sales gọi lại
→ cập nhật CRM activity
```

Model không tự tạo value. Workflow mới là nơi value xuất hiện.

## 4. Ví dụ nhỏ: AI lead scoring cho CRM

Giả sử tôi build một workflow cho OneClick CRM:

> Khi khách hàng điền form trên website, hệ thống tự phân tích lead, chấm điểm, tạo deal, rồi đề xuất follow-up.

Thiết kế đơn giản có thể là:

```txt
Website Form
  ↓
Lead API Service
  ↓
Database
  ↓
Lead Scoring Service
  ↓
Workflow Automation Service
  ↓
Notification / Email / CRM Update
```

Nếu lead scoring bị lỗi, hệ thống vẫn nên lưu lead. Không nên để model lỗi làm mất dữ liệu khách hàng.

Một nguyên tắc tôi rút ra là:

> ML service nên tăng giá trị cho workflow, nhưng không nên làm workflow chết hoàn toàn nếu model lỗi.

Vì vậy có thể dùng fallback:

```txt
Nếu model lỗi → dùng rule-based score tạm thời → đánh dấu cần review
```

## 5. Monitoring trong ML system cần nhìn nhiều lớp

Với backend bình thường, mình thường monitor:

- request count;
- error rate;
- latency;
- CPU/RAM;
- database query time.

Với ML system, cần thêm:

- input data có lệch không;
- output có bất thường không;
- model version nào đang chạy;
- prediction có tạo business action đúng không;
- metric offline có còn phản ánh metric thật không.

Ví dụ lead scoring model đột nhiên chấm 95% lead là `high priority`. Backend vẫn chạy, API vẫn 200 OK, nhưng product có thể đang sai.

## 6. Trade-off

Microservice giúp:

- scale từng phần độc lập;
- deploy model riêng với backend chính;
- rollback dễ hơn;
- rõ trách nhiệm từng service;
- dễ monitor từng layer.

Nhưng nó cũng làm tăng:

- độ phức tạp vận hành;
- network latency;
- chi phí logging/monitoring;
- rủi ro version mismatch;
- yêu cầu DevOps cao hơn.

Nên với project nhỏ, tôi nghĩ nên bắt đầu bằng **modular monolith** trước:

```txt
Một repo, một backend, nhưng chia module rõ:
- leads
- workflows
- inference
- monitoring
- notifications
```

Khi một phần thật sự cần scale riêng, lúc đó mới tách service.

## 7. Kết luận

Microservice trong ML không phải để nhìn cho “enterprise”. Nó chỉ có ý nghĩa khi giúp hệ thống dễ deploy, dễ scale, dễ debug và dễ rollback hơn.

Điều quan trọng nhất tôi học được là: production ML không chỉ là model. Nó là một chuỗi service, dữ liệu, API, monitoring và workflow business chạy cùng nhau.

Nếu một model tốt nhưng không được deploy đúng, không được monitor đúng, không gắn với hành động cụ thể, thì nó vẫn chỉ là một thí nghiệm.

## Nguồn tham khảo

- [Microservice Architecture Patterns for Scalable Machine Learning Systems](https://arxiv.org/abs/2603.13672)
- [Design, Monitoring, and Testing of Microservices Systems: The Practitioners' Perspective](https://arxiv.org/abs/2108.03384)
- [ElasticRec: A Microservice-based Model Serving Architecture Enabling Elastic Resource Scaling for Recommendation Models](https://arxiv.org/abs/2406.06955)

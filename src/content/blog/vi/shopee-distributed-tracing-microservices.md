---
title: 'Shopee và distributed tracing: nhìn request đi qua microservices như thế nào?'
description: >-
  Phân tích case Shopee dùng ClickHouse cho distributed tracing và bài học cho
  các hệ thống nhiều service.
pubDatetime: '2022-06-14T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Shopee
  - Distributed Tracing
  - ClickHouse
  - Microservices
  - Observability
categories:
  - Technical
draft: false
---

## Mở bài

Khi một hệ thống còn nhỏ, log thường đủ dùng.

Nhưng khi một request phải đi qua nhiều service, nhiều database, nhiều queue, nhiều API bên ngoài, câu hỏi “lỗi ở đâu?” bắt đầu trở nên khó chịu.

Case Shopee dùng ClickHouse cho distributed tracing là một ví dụ tốt để hiểu vì sao observability không chỉ là dashboard đẹp, mà là khả năng nhìn thấy đường đi thật của request trong hệ thống.

### 1. Vấn đề của microservices

Một workflow đơn giản trên giao diện có thể ẩn sau nó rất nhiều bước:

```text
User request
→ API Gateway
→ Auth Service
→ Order Service
→ Payment Service
→ Notification Service
→ Database
→ External Provider
```

Nếu request chậm, chỉ nhìn log từng service riêng lẻ sẽ rất khó biết bottleneck nằm ở đâu.

Distributed tracing giải quyết bằng cách gắn một trace id vào request, rồi theo dõi request đó đi qua các service nào, mỗi bước mất bao lâu, bước nào lỗi.

### 2. Shopee dùng tracing để nhìn “bức tranh lớn”

Theo bài viết của ClickHouse, Shopee cần visibility trong một kiến trúc microservices phức tạp. Distributed tracing giúp theo dõi request khi nó đi qua nhiều service, từ đó nhanh hơn trong việc tìm bottleneck hoặc error.

Điểm đáng chú ý là Shopee dùng ClickHouse như storage/query engine cho tracing data. Đây là lựa chọn hợp lý vì trace data thường rất lớn, nhiều dòng, cần query nhanh theo thời gian, service, trace id, latency hoặc error.

### 3. Bài học cho hệ thống nhỏ hơn

Một CRM/AI workflow nhỏ chưa cần một tracing platform lớn ngay từ đầu. Nhưng pattern thì vẫn giống.

Ví dụ một lead đi vào hệ thống:

```text
Website Form
→ Lead API
→ CRM Database
→ Enrichment Service
→ AI Scoring
→ Message Workflow
→ Dashboard
```

Nếu khách báo “lead không được gửi tin nhắn follow-up”, ta cần biết lỗi nằm ở đâu:

- form không gửi request;
- API validate fail;
- database insert fail;
- AI scoring timeout;
- message provider lỗi;
- dashboard chưa refresh.

Nếu mỗi bước có cùng một `trace_id`, việc debug sẽ dễ hơn rất nhiều.

### 4. Một trace đơn giản có thể trông như thế nào?

```json
{
  "trace_id": "lead_20260623_001",
  "steps": [
    {"service": "lead-api", "status": "ok", "latency_ms": 42},
    {"service": "crm-db", "status": "ok", "latency_ms": 18},
    {"service": "ai-scoring", "status": "timeout", "latency_ms": 5000},
    {"service": "follow-up-worker", "status": "skipped"}
  ]
}
```

Chỉ nhìn vào đây đã thấy vấn đề nằm ở AI scoring. Không cần đoán mò.

### 5. Kết luận

Tracing không phải chỉ dành cho Big Tech. Big Tech dùng nó ở scale lớn, nhưng tư duy phía sau rất phù hợp với product nhỏ: khi hệ thống có nhiều bước, phải có cách nhìn được request đi qua những bước nào.

Một hệ thống tốt không chỉ chạy được lúc demo. Nó phải debug được khi có lỗi.

## Nguồn tham khảo

- ClickHouse — Seeing the Big Picture: Shopee's Journey to Distributed Tracing with ClickHouse: https://clickhouse.com/blog/seeing-the-big-picture-shopees-journey-to-distributed-tracing-with-clickhouse
- ClickHouse video — Distributed Tracing in ClickHouse at Shopee: https://clickhouse.com/videos/distributed-tracing-clickhouse-shopee

---
title: 'Netflix Microservices: vì sao observability quan trọng hơn bạn nghĩ?'
description: >-
  Đọc bài Netflix về microservices để hiểu vì sao hệ phân tán cần quan sát theo
  nhiều tầng: request flow, bottleneck và instance-level metrics.
pubDatetime: '2022-03-24T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Netflix
  - Microservices
  - Observability
  - Monitoring
  - Distributed Systems
categories:
  - Technical
  - AI
---

Microservices nghe rất hay khi vẽ architecture diagram.

Mỗi service nhỏ, độc lập, deploy riêng, scale riêng. Nhưng khi production lỗi, cảm giác có thể rất khác: request đi qua 8 service, 2 cache, 1 database, 1 queue, rồi timeout ở đâu đó không ai biết chắc.

Đó là lý do tôi thích bài **A Microscope on Microservices** của Netflix. Nó không nói microservices bằng khẩu hiệu. Nó nói về một vấn đề rất thật: khi hệ thống quá lớn, một công cụ monitoring tổng quát là không đủ. Cần nhiều “độ phóng đại” khác nhau để nhìn hệ thống.

## Nguồn tôi đọc

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. Microservices làm tăng số câu hỏi cần trả lời

Trong monolith, khi một request chậm, ít nhất bạn biết nó nằm trong một codebase.

Trong microservices, request có thể đi như sau:

```txt
API Gateway
  → Auth Service
  → CRM Service
  → Activity Service
  → Notification Service
  → AI Suggestion Service
  → Database / Cache / Queue
```

Khi user nói “dashboard bị chậm”, câu hỏi không còn là “function nào chậm?” mà là:

- service nào đang chậm?
- downstream nào bị nghẽn?
- chậm do CPU, network, database hay external API?
- lỗi xảy ra ở tất cả users hay một workspace?
- deploy mới có liên quan không?
- p99 tăng hay chỉ average tăng?

Không có observability, câu trả lời thường là đoán.

## 2. Netflix dùng hình ảnh “microscope” rất đúng

Trong bài của Netflix, họ nói về việc quan sát hệ thống theo nhiều mức:

### 10x — request flow

Nhìn request đi qua những service nào. Service nào gọi service nào. Demand nằm ở đâu.

### 100x — bottleneck

Khi một service chậm, xem metric nào tương quan với thay đổi đó: CPU, GC, downstream call, database, error, timeout.

### 1000x — instance-level metrics

Có khi vấn đề nằm ở một instance cụ thể: thread runaway, CPU không đều, host bất thường, metric chỉ hiện rõ ở độ phân giải cao.

Đây là điểm rất quan trọng: hệ thống phân tán không thể hiểu bằng một biểu đồ duy nhất.

## 3. Observability không chỉ là logs

Nhiều project nhỏ nghĩ “có log là đủ”. Nhưng log chỉ là một phần.

Một bộ observability cơ bản thường gồm:

```txt
Logs      → chuyện gì đã xảy ra?
Metrics   → hệ thống đang khỏe hay yếu?
Traces    → request đi qua đâu và mất thời gian ở đâu?
Alerts    → khi nào cần người vào xem?
Dashboards→ nhìn xu hướng và so sánh theo thời gian
```

Ví dụ một AI workflow:

```txt
POST /api/leads
  → validate lead
  → save database
  → call enrichment API
  → call LLM
  → create follow-up task
  → send notification
```

Nếu workflow này chậm, log “request timeout” không đủ. Ta cần biết:

- LLM call mất bao lâu?
- enrichment API lỗi bao nhiêu phần trăm?
- database insert có chậm không?
- queue backlog có tăng không?
- retry có làm hệ thống bị dội traffic không?

## 4. Ví dụ nhỏ: observability cho AI workflow

Tôi sẽ bắt đầu rất đơn giản:

### Metrics

```txt
ai_workflow_requests_total
ai_workflow_latency_ms
llm_call_latency_ms
llm_call_error_total
workflow_queue_depth
workflow_retry_total
```

### Logs có context

```json
{
  "workflow_id": "wf_123",
  "workspace_id": "ws_001",
  "lead_id": "lead_456",
  "step": "llm_follow_up_generation",
  "latency_ms": 2310,
  "status": "success"
}
```

### Trace

```txt
Lead Created Request
  ├── DB insert: 24ms
  ├── Enrichment API: 410ms
  ├── LLM call: 2310ms
  ├── Task creation: 18ms
  └── Notification: 90ms
```

Chỉ cần như vậy, khi lỗi xảy ra, ta đã bớt mù rất nhiều.

## 5. Microservices không nên đến trước observability

Một sai lầm dễ gặp: tách service quá sớm, nhưng không có logging, metrics, tracing, alerting.

Kết quả là kiến trúc nhìn hiện đại hơn, nhưng debug khó hơn.

Với team nhỏ, đôi khi modular monolith + observability tốt còn đáng tin hơn microservices nhưng không ai nhìn thấy gì bên trong.

Thứ tự hợp lý hơn:

```txt
1. Monolith/module rõ
2. Log có context
3. Metrics cơ bản
4. Background jobs
5. Trace các flow quan trọng
6. Tách service khi có lý do thật
```

## Kết

Microservices không làm hệ thống tự nhiên tốt hơn. Nó chỉ chia hệ thống thành nhiều phần nhỏ hơn. Nếu không có observability, bạn chỉ biến một lỗi lớn thành nhiều lỗi nhỏ khó tìm hơn.

Với AI product nhỏ, bài học rất rõ: trước khi nói đến scale lớn, hãy làm cho hệ thống của mình quan sát được đã. Biết request đang đi đâu, mất bao lâu, lỗi ở bước nào — chỉ vậy thôi đã giúp sản phẩm trưởng thành hơn rất nhiều.

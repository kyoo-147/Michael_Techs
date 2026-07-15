---
title: Khi nào nên rời MongoDB/Cassandra/SQL? Bài học từ Discord
description: >-
  Phân tích quyết định database migration qua case Discord và cách chọn database
  theo access pattern, operational cost và trade-off.
pubDatetime: '2022-05-26T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - MongoDB
  - Cassandra
  - SQL
  - Database Migration
  - Trade-offs
  - Scalability
categories:
  - Technical
---

Một câu hỏi rất dễ gây tranh luận trong system design là: **nên dùng database nào?**

SQL, MongoDB, Cassandra, ScyllaDB, Redis, Elasticsearch... cái nào cũng có người khen. Nhưng case Discord cho thấy một bài học thực tế hơn: database không phải lựa chọn một lần rồi đúng mãi.

Discord từng đi từ MongoDB sang Cassandra, rồi sau đó chuyển message storage sang ScyllaDB. Không phải vì database cũ “dở”, mà vì yêu cầu vận hành, scale và access pattern đã thay đổi.

## Nguồn tôi đọc

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Đừng chọn database bằng cảm xúc

Một cách chọn database rất nguy hiểm là:

```txt
MongoDB dễ dùng → chọn MongoDB
SQL quen thuộc → chọn PostgreSQL
Cassandra scale tốt → chọn Cassandra
Redis nhanh → bỏ hết vào Redis
```

Cách đúng hơn là hỏi:

- dữ liệu có quan hệ mạnh không?
- query chính là gì?
- read nhiều hay write nhiều?
- cần transaction không?
- cần full-text search không?
- dữ liệu tăng theo chiều nào?
- hệ thống có chịu được eventual consistency không?
- team có vận hành nổi không?

Database không chỉ là nơi lưu data. Nó kéo theo operational model.

## 2. SQL vẫn là điểm bắt đầu tốt cho đa số sản phẩm

Với CRM, dashboard, SaaS nhỏ, PostgreSQL/MySQL vẫn là điểm bắt đầu hợp lý.

Vì chúng có:

- transaction;
- schema rõ;
- join tốt;
- index mạnh;
- query linh hoạt;
- dễ backup;
- dễ tìm người biết dùng;
- ecosystem tốt.

Ví dụ CRM có leads, contacts, deals, quotes. Đây là dữ liệu quan hệ tự nhiên:

```txt
Customer ── Deals ── Quotes
    │
    └── Activities
```

Dùng SQL giúp mô hình hóa rõ và tránh việc dữ liệu bị lỏng lẻo quá sớm.

## 3. MongoDB hợp khi dữ liệu dạng document thay đổi nhanh

MongoDB hợp với một số case:

- dữ liệu document linh hoạt;
- schema thay đổi nhanh;
- object nested nhiều;
- không cần join phức tạp;
- tốc độ prototype quan trọng.

Ví dụ lưu cấu hình workflow:

```json
{
  "workflow_id": "wf_123",
  "steps": [
    { "type": "trigger", "event": "lead.created" },
    { "type": "condition", "field": "source", "equals": "website" },
    { "type": "action", "name": "send_follow_up" }
  ]
}
```

Dạng này document database có thể tiện.

Nhưng nếu bắt đầu cần report phức tạp, join nhiều bảng, hoặc ràng buộc dữ liệu chặt, SQL lại dễ sống hơn.

## 4. Cassandra/ScyllaDB dành cho bài toán rất khác

Cassandra và ScyllaDB không phải để thay thế SQL trong mọi thứ. Chúng mạnh ở workload phân tán lớn, write/read theo key rõ, scale ngang, chịu lỗi tốt.

Nhưng đổi lại:

- query phải thiết kế quanh access pattern;
- không query linh tinh như SQL;
- data modeling khó hơn;
- operational complexity cao hơn;
- migration và consistency cần hiểu sâu.

Discord dùng Cassandra vì message storage cần scale lớn và fault tolerance. Nhưng khi cluster Cassandra gây nhiều toil, latency khó đoán, GC issue, compaction pain và hot partition, họ chuyển sang ScyllaDB và thêm data services để kiểm soát traffic tốt hơn.

Bài học: Cassandra/ScyllaDB giải quyết một nhóm vấn đề, nhưng cũng tạo ra nhóm vấn đề khác.

## 5. Khi nào nên nghĩ đến migration?

Không nên migrate chỉ vì “nghe công nghệ mới ngon hơn”.

Nên nghĩ đến migration khi có tín hiệu rõ:

### Latency không còn ổn

p99/p999 tăng, người dùng thấy chậm, on-call bắt đầu mệt.

### Maintenance cost tăng

Team dành quá nhiều thời gian chữa cháy thay vì build feature.

### Access pattern không hợp database hiện tại

Ví dụ cần query timeline nhanh nhưng schema hiện tại làm query quá đắt.

### Scale vượt khỏi thiết kế ban đầu

Không phải tăng 2x, mà là kiểu dữ liệu/traffic thay đổi bản chất.

### Database mới giải quyết đúng pain

Không phải “database mới nhanh hơn”, mà là nhanh hơn với workload của mình.

## 6. Migration an toàn cần kế hoạch rõ

Một migration dữ liệu tối thiểu nên có:

```txt
1. Hiểu workload hiện tại
2. Benchmark trên dữ liệu gần thật
3. Dual-write hoặc shadow-write nếu cần
4. Backfill dữ liệu cũ
5. Validate read result giữa old/new
6. Cutover theo feature flag
7. Có rollback plan
8. Monitor p50/p95/p99, error rate, mismatch rate
```

Discord có automated validation bằng cách so sánh một phần read giữa hai database. Đây là chi tiết rất đáng học. Migration không chỉ là chuyển dữ liệu, mà là chứng minh dữ liệu sau khi chuyển vẫn đúng.

## Kết

Bài học từ Discord không phải là “hãy dùng ScyllaDB”. Bài học là: database phải đi theo access pattern và operational reality.

Khi còn nhỏ, chọn thứ dễ hiểu, dễ vận hành, dễ debug. Khi lớn lên, quan sát bottleneck thật. Nếu phải migrate, migrate vì dữ liệu và workload ép mình phải làm, không phải vì công nghệ mới trông ngầu hơn.

---
title: Khi database bắt đầu làm team on-call kiệt sức
description: >-
  Từ case Discord lưu trữ trillions of messages, bài viết nhìn vào dấu hiệu
  database không còn phù hợp với workload.
pubDatetime: '2023-04-18T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Database
  - Cassandra
  - ScyllaDB
  - On-call
categories:
  - Technical
  - Experience
draft: false
---

## Mở bài

Database không chỉ hỏng khi nó sập.

Có một kiểu hỏng âm thầm hơn: hệ thống vẫn chạy, nhưng team phải liên tục chăm nó. Latency khó đoán, repair lâu, on-call mệt, vận hành phức tạp, mỗi incident lại ăn rất nhiều thời gian.

Case Discord chuyển từ Cassandra sang ScyllaDB trong bài “How Discord Stores Trillions of Messages” là một ví dụ rất đáng đọc.

### 1. Scale làm lộ vấn đề

Discord từng dùng MongoDB, sau đó chuyển sang Cassandra khi message scale tăng mạnh. Đến giai đoạn trillions of messages, Cassandra cluster của họ trở nên khó vận hành hơn.

Bài viết của Discord nhắc đến các vấn đề như:

- latency không ổn định;
- maintenance tốn công;
- repair và vận hành cluster phức tạp;
- tombstone gây ảnh hưởng khi đọc dữ liệu;
- on-call/toil tăng lên.

Điểm quan trọng: database không sai. Workload và scale đã thay đổi.

### 2. Khi nào database trở thành gánh nặng?

Một vài dấu hiệu:

- mỗi lần incident đều liên quan đến database;
- query latency thay đổi khó đoán;
- schema ban đầu không còn hợp workload;
- xóa/sửa dữ liệu tạo side effect lớn;
- team phải dành quá nhiều thời gian tuning;
- việc mở rộng node không giải quyết triệt để vấn đề.

Khi đó, câu hỏi không còn là “database nào tốt nhất”, mà là “database nào hợp workload này nhất”.

### 3. Bài học cho CRM nhỏ

Một CRM nhỏ chưa cần nghĩ đến Cassandra hay ScyllaDB. Nhưng bài học workload thì rất gần.

Ví dụ activity log trong CRM:

```text
lead_created
message_sent
quote_opened
deal_updated
followup_failed
```

Nếu log tăng nhanh, query phổ biến có thể là:

- lấy timeline của một customer;
- lấy activity mới nhất của một deal;
- lọc event lỗi trong 24 giờ;
- thống kê số follow-up đã gửi.

Thiết kế bảng phải đi từ query pattern, không chỉ từ entity đẹp trên giấy.

### 4. Một schema đơn giản hơn cho activity log

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

Ban đầu vậy có thể đủ. Khi scale lớn hơn mới tách archive, partition, event store hoặc search engine.

### 5. Kết luận

Case Discord hay vì nó không chỉ là câu chuyện database migration. Nó là câu chuyện về workload, operational cost và sức khỏe của team.

Một hệ thống tốt không chỉ phải nhanh. Nó phải đủ dễ vận hành để team không bị database kéo vào vòng on-call vô tận.

## Nguồn tham khảo

- Discord Engineering — How Discord Stores Trillions of Messages: https://discord.com/blog/how-discord-stores-trillions-of-messages
- ScyllaDB Tech Talk — How Discord Migrated Trillions of Messages from Cassandra to ScyllaDB: https://www.scylladb.com/tech-talk/how-discord-migrated-trillions-of-messages-from-cassandra-to-scylladb/

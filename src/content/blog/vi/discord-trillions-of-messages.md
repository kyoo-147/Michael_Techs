---
title: Discord lưu trữ trillions of messages như thế nào?
description: >-
  Đọc case Discord chuyển từ Cassandra sang ScyllaDB và rút ra bài học về
  database, hot partition, migration và latency.
pubDatetime: '2022-05-03T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Message Storage
  - Database
  - Cassandra
  - Scalability
  - System Design
categories:
  - Technical
---

Có những hệ thống nhìn bên ngoài rất đơn giản: người dùng gửi tin nhắn, người khác mở app lên và đọc được.

Nhưng khi scale lên mức Discord, “lưu tin nhắn” không còn là một table `messages` bình thường nữa. Nó trở thành bài toán về partition, hot key, latency, migration, on-call, và làm sao để hệ thống không gãy đúng lúc cả thế giới đang spam trong một trận chung kết World Cup.

Bài này là ghi chú của tôi khi đọc bài engineering chính thức của Discord: **How Discord Stores Trillions of Messages**.

## Nguồn tôi đọc

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Vấn đề thật sự không phải là “lưu message”

Ở bản 2017, Discord từng chuyển từ MongoDB sang Cassandra vì cần một database có thể scale tốt, fault-tolerant và ít phải bảo trì hơn khi dữ liệu tăng.

Nhưng đến đầu năm 2022, cluster Cassandra lưu message đã lên tới **177 nodes** và chứa **trillions of messages**. Vấn đề bắt đầu xuất hiện:

- latency khó đoán;
- on-call bị page nhiều;
- maintenance operations trở nên đắt;
- hot partition làm ảnh hưởng cả cluster;
- compaction và GC của JVM tạo thêm độ phức tạp vận hành.

Điểm tôi thấy hay ở đây: hệ thống có thể đúng trong giai đoạn trước, nhưng sai dần khi scale và access pattern thay đổi.

Không phải cứ “Cassandra scale tốt” là xong. Câu hỏi thật hơn là:

> Dữ liệu của mình được đọc/ghi theo pattern nào? Có partition nào bị nóng bất thường không? Khi maintenance chạy, hệ thống còn giữ được latency ổn không?

## 2. Schema và partition là nơi mọi chuyện bắt đầu

Discord partition message theo `channel_id` và một `bucket` theo thời gian. Cách này hợp lý vì message trong cùng channel thường được đọc theo thời gian.

Nhưng có một chi tiết rất đời: một server nhỏ vài người và một server cực lớn có thể cùng chung một kiểu schema, nhưng traffic khác nhau rất xa.

Khi một channel lớn có nhiều người cùng đọc hoặc gửi, partition đó bị nóng. Cassandra đọc đắt hơn ghi vì phải đọc từ memtable và nhiều SSTable trên disk. Nếu một partition bị đọc quá nhiều, latency của node tăng, rồi các query khác cũng bị ảnh hưởng.

Đây là bài học đầu tiên:

> Database schema không chỉ là cấu trúc dữ liệu. Nó là giả định của mình về hành vi người dùng.

Nếu giả định đó sai, hệ thống sẽ trả giá bằng latency.

## 3. Discord không chỉ đổi database

Một điểm tôi thích trong bài của Discord là họ không kể câu chuyện kiểu “chuyển sang ScyllaDB là mọi thứ tốt lên”.

Họ biết hot partition vẫn có thể xảy ra. Nên ngoài chuyện chuyển từ Cassandra sang ScyllaDB, họ còn xây thêm **data services** bằng Rust nằm giữa API monolith và database.

Data services này có vài vai trò quan trọng:

- gom các database query thành endpoint gRPC rõ ràng;
- không chứa business logic;
- request coalescing: nhiều request cùng đọc một row thì chỉ query database một lần;
- consistent hash routing: request cùng channel đi tới cùng service instance để tăng khả năng coalescing.

Nói đơn giản: thay vì để database chịu toàn bộ traffic spike, họ đặt một lớp điều tiết ở giữa.

Với một hệ nhỏ hơn như CRM, bài học này vẫn dùng được. Ví dụ dashboard CRM có 50 người mở cùng lúc xem cùng một deal hoặc cùng một conversation history. Thay vì mỗi client bắn thẳng vào database, ta có thể dùng:

- cache;
- request coalescing;
- API aggregation;
- background job;
- read model riêng cho dashboard.

## 4. Migration lớn cần validation, không chỉ “copy data”

Discord cần migrate trillions of messages với yêu cầu không downtime. Ban đầu họ tính dùng Spark migrator và ước lượng mất khoảng ba tháng. Sau đó họ viết migrator bằng Rust, đọc token ranges, checkpoint bằng SQLite, và đẩy dữ liệu sang ScyllaDB. Tốc độ migration có lúc đạt hàng triệu message mỗi giây.

Điểm quan trọng nhất với tôi không phải tốc độ, mà là đoạn họ **dual read / validate**: gửi một phần nhỏ read request tới cả hai database rồi so sánh kết quả.

Pattern rất nên nhớ:

```txt
Old DB  ─┐
         ├─ compare result → report mismatch
New DB  ─┘
```

Khi migrate hệ thống thật, đặc biệt là dữ liệu quan trọng, đừng tin cảm giác “chắc ổn”. Phải có validation.

## 5. Ví dụ nhỏ: áp dụng vào activity log của CRM

Một CRM nhỏ có thể lưu activity log như sau:

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

Schema này đủ tốt khi scale nhỏ. Nhưng nếu một entity có quá nhiều activity, hoặc dashboard liên tục đọc activity mới nhất, ta cần nghĩ thêm:

- có cần phân vùng theo `workspace_id` không?
- có cần read model cho dashboard không?
- có cần cache latest activities không?
- có cần archive activity cũ không?
- có cần event stream riêng cho notification không?

Đây là cách học từ Discord nhưng không copy Discord. Hệ nhỏ không cần ScyllaDB ngay. Nhưng hệ nhỏ vẫn cần hiểu access pattern.

## 6. Bài học tôi giữ lại

Một hệ thống message lớn không chết vì thiếu database xịn. Nó chết vì nhiều thứ nhỏ cộng lại: schema, partition, read pattern, compaction, GC, hot partition, migration, validation, và on-call toil.

Với tôi, bài này có 5 bài học:

1. **Chọn database theo access pattern, không theo hype.**
2. **Partition key là quyết định kiến trúc, không chỉ là chi tiết schema.**
3. **Thêm lớp service ở giữa có thể bảo vệ database khỏi traffic spike.**
4. **Migration dữ liệu lớn phải có validation tự động.**
5. **Latency p99 quan trọng hơn average latency nếu hệ thống phục vụ người dùng thật.**

Khi nhìn lại CRM, AI workflow hay dashboard realtime, tôi thấy cùng một tư duy: đừng chỉ build feature chạy được. Hãy hỏi feature đó sẽ đọc gì, ghi gì, đọc bao nhiêu lần, ai đọc cùng lúc, và nếu dữ liệu tăng gấp 100 lần thì phần nào sẽ đau đầu trước.

---
title: 'Từ Discord đến CRM: lưu activity log và conversation history ra sao?'
description: >-
  Rút bài học từ cách Discord xử lý message storage để thiết kế activity log và
  conversation history cho CRM nhỏ.
pubDatetime: '2023-05-11T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - CRM
  - Activity Log
  - Conversation History
  - Database Design
  - System Design
categories:
  - Technical
  - Product
---

Trong CRM, có hai loại dữ liệu rất dễ bị xem nhẹ: **activity log** và **conversation history**.

Ban đầu nó chỉ là vài dòng: lead được tạo, nhân viên gọi điện, khách trả lời tin nhắn, quote được gửi, deal chuyển stage.

Nhưng sau vài tháng, đây lại là nơi kể lại toàn bộ lịch sử quan hệ với khách hàng. Nếu thiết kế quá sơ sài, sau này dashboard chậm, tìm kiếm khó, migration mệt, còn AI assistant thì thiếu context.

Tôi đọc case Discord lưu trillions of messages để nghĩ lại bài toán này ở scale nhỏ hơn: nếu Discord phải xử lý message history cho hàng triệu cộng đồng, vậy một CRM nên lưu activity và conversation như thế nào cho vừa đơn giản, vừa có đường mở rộng?

## Nguồn tôi đọc

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Activity log không giống message, nhưng có cùng một vấn đề

Discord lưu message theo channel và thời gian. CRM cũng có pattern gần giống vậy:

```txt
Customer / Lead / Deal
  └── Activities theo thời gian
        ├── note
        ├── call
        ├── email
        ├── message
        ├── quote_sent
        └── deal_stage_changed
```

Người dùng thường không đọc activity ngẫu nhiên. Họ đọc theo entity:

- mở một lead → xem lịch sử tương tác;
- mở một deal → xem quote, call, message;
- mở một customer → xem toàn bộ timeline;
- dashboard → lấy các activity gần nhất.

Vậy access pattern quan trọng nhất là:

```txt
workspace_id + entity_type + entity_id + created_at DESC
```

Nếu schema không phục vụ pattern này, càng về sau càng mệt.

## 2. Thiết kế đơn giản trước

Với hệ CRM nhỏ, tôi sẽ bắt đầu bằng PostgreSQL, không cần nhảy ngay sang Cassandra hay ScyllaDB.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_timeline
ON activity_logs (
  workspace_id,
  entity_type,
  entity_id,
  created_at DESC
);
```

Cách này có lợi:

- dễ query;
- dễ debug;
- dễ dùng cho timeline;
- metadata linh hoạt;
- chưa over-engineering.

Nhưng phải kỷ luật: `metadata` không được trở thành bãi rác. Những field quan trọng để filter/report vẫn nên có cột riêng.

## 3. Conversation history nên tách hay gộp?

Có hai cách.

### Cách 1: gộp vào activity log

Mỗi message cũng là một activity.

Ưu điểm: nhanh, đơn giản, timeline đẹp.

Nhược điểm: nếu chat nhiều, bảng activity phình nhanh. Search message cũng khó hơn.

### Cách 2: tách bảng conversations/messages

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  customer_id UUID,
  channel TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  direction TEXT NOT NULL,
  sender_id UUID,
  body TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_time
ON messages (conversation_id, created_at DESC);
```

Sau đó activity log chỉ ghi sự kiện quan trọng:

```txt
message_received
message_sent
conversation_assigned
follow_up_scheduled
```

Tôi nghiêng về cách 2 nếu CRM có messaging thật sự, vì conversation là domain riêng.

## 4. Đừng để dashboard đọc quá nhiều raw events

Một lỗi dễ gặp: dashboard cần “recent activities”, “last contact date”, “number of unread messages”, “last message preview”, thế là mỗi lần load lại join/query raw activity cực nhiều.

Lúc nhỏ vẫn ổn. Lúc nhiều workspace hơn sẽ chậm.

Cách tốt hơn là có read model hoặc summary table:

```sql
CREATE TABLE customer_activity_summary (
  workspace_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  last_activity_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INT DEFAULT 0,
  PRIMARY KEY (workspace_id, customer_id)
);
```

Mỗi khi có activity mới, backend update summary này. Dashboard chỉ đọc summary.

Đây là phiên bản nhỏ của bài học Discord: đừng để database gốc chịu mọi kiểu query. Có khi cần một lớp trung gian hoặc data model phục vụ đúng màn hình.

## 5. Khi nào bắt đầu nghĩ đến queue?

Khi mỗi activity tạo ra nhiều side effects:

- gửi notification;
- update dashboard realtime;
- tính lead score;
- tạo reminder;
- update summary;
- gọi AI để gợi ý next action.

Lúc đó không nên làm hết trong request chính.

```txt
User action
  → write activity
  → publish event
  → workers xử lý notification / summary / AI suggestion
```

Request chính chỉ cần lưu dữ liệu chắc chắn. Những việc phụ cho worker xử lý sau.

## Kết

Từ Discord đến CRM, scale khác nhau rất xa. Nhưng tư duy giống nhau: hiểu dữ liệu được đọc và ghi như thế nào.

Một CRM tốt không chỉ có bảng leads, contacts, deals. Nó cần một lớp lịch sử đủ đáng tin để người dùng hiểu chuyện gì đã xảy ra với khách hàng. Sau này, nếu thêm AI assistant, chính activity log và conversation history sẽ là context quan trọng nhất để AI không trả lời như một chatbot vô tri.

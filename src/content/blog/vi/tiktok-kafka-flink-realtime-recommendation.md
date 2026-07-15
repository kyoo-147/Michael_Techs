---
title: TikTok có dùng Kafka/Flink cho realtime recommendation không?
description: >-
  Một bài viết kiểm chứng: nguồn công khai cho phép nói gì và không cho phép nói
  gì về Kafka/Flink trong TikTok recommendation.
pubDatetime: '2022-09-06T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Kafka
  - Flink
  - Real-time ML
  - Source Check
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Câu hỏi “TikTok có dùng Kafka/Flink cho realtime recommendation không?” nghe rất hợp lý, vì các hệ thống recommendation realtime thường cần event streaming và stream processing.

Nhưng hợp lý không có nghĩa là đúng.

Tính đến phần nguồn công khai tôi kiểm tra, TikTok có bài chính thức giải thích For You feed ở mức product/recommendation signals, nhưng tôi chưa thấy nguồn chính thức nói rõ TikTok dùng Kafka hoặc Flink trong pipeline recommendation.

Vì vậy bài này không khẳng định TikTok dùng Kafka/Flink. Bài này chỉ tách rõ: điều gì biết được, điều gì chỉ là pattern phổ biến, và điều gì không nên viết như sự thật.

### 1. Nguồn TikTok nói gì?

TikTok nói For You feed được recommend bằng cách ranking video dựa trên nhiều yếu tố như user interactions, video information và device/account settings. TikTok cũng có tài liệu support nói recommender systems dùng preferences được informed bởi interactions như following account hoặc liking post.

Như vậy, ta biết TikTok có hệ thống recommendation dùng tín hiệu hành vi người dùng.

Nhưng các nguồn này không nói cụ thể:

- dùng Kafka hay không;
- dùng Flink hay không;
- event streaming architecture ra sao;
- feature store hoặc online inference pipeline cụ thể thế nào.

### 2. Kafka và Flink thường dùng để làm gì?

Apache Kafka là event streaming platform. Nó thường dùng để ingest, store và process stream of events.

Apache Flink là stream processing framework, dùng để xử lý data stream có state, window, event time và các bài toán realtime analytics/processing.

Trong một hệ thống recommendation realtime nói chung, Kafka/Flink có thể xuất hiện ở các phần như:

```text
User event
→ Event stream
→ Stream processing
→ Feature update
→ Online inference
→ Ranking result
```

Nhưng đây là pattern chung, không phải khẳng định về TikTok.

### 3. Cách viết đúng

Không nên viết:

```text
TikTok dùng Kafka/Flink để realtime recommendation.
```

Nên viết:

```text
TikTok công khai nói For You feed dựa trên các tín hiệu tương tác và ranking. Với các hệ thống realtime recommendation nói chung, event streaming và stream processing là hai khối kỹ thuật thường gặp; Kafka và Flink là ví dụ phổ biến cho hai nhóm công nghệ này. Tuy nhiên, không có đủ nguồn công khai để khẳng định TikTok dùng Kafka/Flink trong pipeline recommendation.
```

Viết như vậy nghe ít “ngầu” hơn, nhưng đúng hơn.

### 4. Bài học cho AI product nhỏ

Với OneClick CRM, ban đầu không cần Kafka/Flink. Nếu chỉ có vài nghìn event/ngày, một queue đơn giản hoặc background job đã đủ.

Khi nào mới nên nghĩ đến Kafka/Flink?

- event volume lớn;
- nhiều service cùng consume event;
- cần replay/backfill;
- cần realtime analytics;
- cần stream processing có state;
- batch pipeline quá chậm cho product.

Ví dụ CRM nhỏ:

```text
lead_created
→ background job enrich lead
→ AI scoring
→ update dashboard
```

Chưa cần Kafka.

CRM lớn hơn:

```text
lead_created
message_sent
quote_opened
deal_updated
→ event stream
→ multiple consumers
→ realtime scoring
→ analytics dashboard
```

Lúc này event streaming bắt đầu hợp lý hơn.

### 5. Kết luận

Một bài blog kỹ thuật tốt không cần phải giả vờ biết kiến trúc nội bộ của TikTok. Chỉ cần nói đúng: TikTok public những tín hiệu nào, Kafka/Flink giải quyết loại bài toán nào, và khi nào một hệ thống nhỏ thật sự cần chúng.

Không biết thì nói chưa biết. Đó cũng là một phần của engineering.

## Nguồn tham khảo

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- Apache Kafka — Introduction: https://kafka.apache.org/intro
- Apache Flink — What is Apache Flink?: https://flink.apache.org/what-is-flink/

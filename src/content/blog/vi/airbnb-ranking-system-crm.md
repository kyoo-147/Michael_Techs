---
title: Thiết kế ranking system từ Airbnb đến CRM search
description: >-
  Rút bài học từ Airbnb Search và Embedding-Based Retrieval để thiết kế CRM
  search/ranking theo hướng thực tế.
pubDatetime: '2022-03-08T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Airbnb
  - Ranking System
  - Search
  - CRM Search
  - Personalization
  - Relevance
categories:
  - Technical
  - Product
---

Search trong CRM nghe nhỏ hơn Airbnb rất nhiều.

Airbnb phải giúp người dùng tìm một nơi ở phù hợp trong hàng triệu listing. CRM chỉ cần tìm lead, customer, deal, quote. Nhưng nếu nhìn kỹ, vấn đề cốt lõi khá giống nhau: **người dùng không chỉ cần kết quả đúng, họ cần kết quả hữu ích nhất ở thời điểm đó**.

Tôi đọc bài Airbnb về Embedding-Based Retrieval và search ranking để nghĩ lại chuyện: nếu xây CRM search nghiêm túc, mình nên bắt đầu từ đâu?

## Nguồn tôi đọc

- Airbnb Engineering — [Embedding-Based Retrieval for Airbnb Search](https://airbnb.tech/ai-ml/embedding-based-retrieval-for-airbnb-search/)
- Airbnb Engineering — [Machine Learning-Powered Search Ranking of Airbnb Experiences](https://medium.com/airbnb-engineering/machine-learning-powered-search-ranking-of-airbnb-experiences-110b4b1a0789)
- arXiv — [Learning to Rank for Maps at Airbnb](https://arxiv.org/abs/2407.00091)

## 1. Airbnb không chỉ “search text”

Trong bài Embedding-Based Retrieval, Airbnb nói search có nhiệm vụ surface các listing phù hợp nhất với query của user. Nhưng vì có rất nhiều nhà đủ điều kiện, hệ thống cần retrieve một tập nhỏ hơn để các model ranking đắt hơn xử lý sau.

Kiến trúc thường có nhiều tầng:

```txt
Query
  → candidate retrieval
  → ranking
  → re-ranking / business rules
  → UI result
```

Đây là pattern rất đáng học.

Với CRM, ta cũng không nên nghĩ search chỉ là:

```sql
WHERE name ILIKE '%keyword%'
```

Search tốt có thể cần hiểu intent:

- tìm theo tên khách;
- tìm deal đang nóng;
- tìm quote mới gửi;
- tìm conversation có nội dung liên quan;
- tìm khách lâu chưa follow-up;
- tìm lead giống một case trước đó.

## 2. CRM search nên bắt đầu đơn giản

Bản đầu tiên nên là hybrid nhẹ:

```txt
Keyword search
  + filters
  + recency
  + entity priority
  + permission
```

Ví dụ query: “acme quote”

Kết quả nên ưu tiên:

1. customer tên gần giống Acme;
2. quote liên quan đến customer đó;
3. deal có quote mới nhất;
4. conversation có nhắc đến quote.

Không cần embedding ngay nếu keyword + filter đã giải quyết 80%.

## 3. Khi nào embedding hữu ích?

Embedding hữu ích khi user không gõ đúng từ khóa.

Ví dụ:

```txt
"khách hỏi giá máy kiểm tra thuốc"
```

Có thể liên quan đến:

```txt
Pharmaceutical QC Defect Detection Machine
blister inspection
industrial camera
quality control
```

Keyword search có thể miss nếu từ không trùng. Embedding giúp map query và document về vector space gần nhau hơn.

Airbnb dùng two-tower architecture để map query và listing thành embeddings. Listing tower có thể tính offline, query tower tính realtime để giảm latency. Với CRM nhỏ, ta có thể đơn giản hơn:

```txt
Offline:
- tạo embedding cho customer summary
- tạo embedding cho deal summary
- tạo embedding cho conversation chunks

Online:
- tạo embedding cho query
- vector search top K
- apply filters/permissions
- rerank theo recency + business priority
```

## 4. Ranking không chỉ là relevance

Một kết quả search “liên quan” chưa chắc là kết quả nên đứng đầu.

Trong CRM, ranking có thể cân nhắc:

```txt
relevance_score
recency_score
deal_value
stage_priority
ownership
last_activity
risk/urgency
```

Ví dụ:

```txt
Score =
  0.45 * relevance
+ 0.20 * recency
+ 0.15 * deal_priority
+ 0.10 * user_ownership
+ 0.10 * urgency
```

Đây không phải công thức cố định. Nó chỉ là cách bắt đầu nghĩ rõ hơn.

## 5. Dữ liệu training không nên lấy bừa

Airbnb nhấn mạnh việc xây training data dựa trên journey của user, gồm positive và negative examples có ý nghĩa. Họ không chỉ random negative, vì như vậy bài toán quá dễ và model học không tốt.

Trong CRM, nếu sau này train ranking model, ta cũng cần cẩn thận:

Positive signals:

```txt
user clicked result
user opened result lâu
user completed action sau khi mở
user searched similar query and picked same entity
```

Negative signals:

```txt
result shown but skipped
user immediately went back
user searched again with refined query
user marked result not relevant
```

Nhưng click không đủ. Outcome mới quan trọng.

## 6. Một design nhỏ cho CRM search

```txt
/search?q=acme quote
  → parse query
  → keyword search PostgreSQL
  → vector search nếu query dài/ngữ nghĩa
  → merge candidates
  → permission filter
  → rank
  → return grouped results
```

Response có thể group:

```json
{
  "customers": [],
  "deals": [],
  "quotes": [],
  "conversations": []
}
```

UI không nên trộn tất cả thành một danh sách nếu user cần phân biệt entity.

## Kết

Bài học từ Airbnb không phải là CRM nhỏ phải build hệ thống ranking phức tạp ngay.

Bài học là search nên được xem như một hệ thống nhiều tầng: retrieve, filter, rank, explain, measure. Bản đầu có thể rất đơn giản. Nhưng nếu thiết kế đúng từ đầu, sau này thêm embedding, personalization hay AI search sẽ không bị đập đi xây lại.

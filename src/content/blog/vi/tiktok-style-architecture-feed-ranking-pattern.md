---
title: >-
  TikTok-style architecture: nên hiểu như một pattern feed ranking, không phải
  sơ đồ nội bộ
description: >-
  Một bài viết cẩn trọng về TikTok-style architecture: chỉ dùng nguồn công khai
  để rút ra pattern sản phẩm, không khẳng định kiến trúc nội bộ.
pubDatetime: '2022-08-16T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Feed Ranking
  - Product Architecture
  - Personalization
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Cụm “TikTok-style architecture” nghe rất hấp dẫn, nhưng cũng dễ bị nói quá.

Nếu không có tài liệu engineering chính thức, mình không nên vẽ một sơ đồ rồi khẳng định “TikTok dùng Kafka/Flink/feature store như thế này”. Đó là bịa.

Cách an toàn hơn là nhìn vào những gì TikTok công khai nói về For You feed, rồi rút ra các pattern chung của một hệ thống feed ranking hiện đại.

### 1. TikTok chính thức nói gì?

TikTok nói For You feed được cá nhân hóa cho từng người dùng. Hệ thống recommend content bằng cách ranking video dựa trên nhiều yếu tố, bắt đầu từ interest người dùng thể hiện, sau đó điều chỉnh theo những gì người dùng quan tâm hoặc không quan tâm.

Các tín hiệu được nhắc đến gồm:

- user interactions;
- video information;
- device/account settings.

TikTok cũng nói họ cố gắng đa dạng hóa recommendation, không chỉ lặp lại một kiểu nội dung người dùng đã thích.

### 2. Pattern có thể rút ra

Từ nguồn công khai, ta có thể nói một feed ranking system thường cần:

```text
User signals
→ Content candidates
→ Ranking
→ Diversity / safety rules
→ Feed result
→ New feedback signals
```

Trong đó feedback loop là phần rất quan trọng. Người dùng xem, lướt, like, follow, comment, bấm “not interested” — tất cả đều trở thành tín hiệu để feed tiếp tục điều chỉnh.

### 3. Điều không nên khẳng định

Không nên viết:

```text
TikTok dùng Kafka và Flink để realtime recommendation.
```

Nếu không có nguồn chính thức hoặc paper kỹ thuật rõ ràng.

Có thể viết cẩn trọng hơn:

```text
Một hệ thống feed ranking realtime thường có thể cần event streaming và stream processing. Kafka/Flink là hai công nghệ phổ biến cho nhóm bài toán này, nhưng nguồn công khai của TikTok không đủ để khẳng định TikTok dùng chúng theo cách cụ thể nào.
```

Đây là khác biệt giữa phân tích kỹ thuật có trách nhiệm và đoán mò.

### 4. Áp dụng cho CRM/AI workflow

Một CRM cũng có thể học pattern feed ranking, nhưng ở scale nhỏ hơn:

```text
Lead events
→ Candidate next actions
→ Scoring/ranking
→ Business rule
→ Suggested action
→ User feedback
```

Ví dụ nếu sales bỏ qua một suggestion hoặc khách không phản hồi, hệ thống nên ghi lại. Nếu quote được mở nhiều lần, lead có thể tăng priority.

### 5. Kết luận

“TikTok-style architecture” nên được hiểu là pattern về feedback-rich product, personalization và ranking liên tục, không phải sơ đồ nội bộ của TikTok.

Khi viết blog kỹ thuật, phần quan trọng là biết ranh giới: cái gì nguồn nói, cái gì mình suy luận, và cái gì chưa được phép khẳng định.

## Nguồn tham khảo

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- TikTok Newsroom — Safeguard and diversify recommendations: https://newsroom.tiktok.com/en-us/an-update-on-our-work-to-safeguard-and-diversify-recommendations

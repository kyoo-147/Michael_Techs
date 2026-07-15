---
title: 'LightSAGE ở Shopee: GNN cho item retrieval trong e-commerce ads'
description: >-
  Phân tích paper LightSAGE về cách Shopee dùng graph neural networks cho item
  retrieval trong recommendation ads.
pubDatetime: '2022-07-07T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - GNN
  - Item Retrieval
  - Vector Search
  - E-commerce
categories:
  - Technical
  - AI
draft: false
---

## Mở bài

Trong recommendation system, nhiều người hay nhảy thẳng vào model architecture. Nhưng paper LightSAGE của Shopee nhấn mạnh một điều rất thực tế: trong industrial setup, model chỉ là một phần.

Với item retrieval ở e-commerce ads, các phần như graph construction, data sparsity, cold-start và long-tail items có thể quyết định hệ thống có dùng được không.

### 1. Item retrieval là gì?

Một sàn e-commerce có thể có hàng triệu sản phẩm. Khi cần recommend quảng cáo, hệ thống không thể đem toàn bộ sản phẩm ra score từng cái.

Vì vậy thường có bước retrieval:

```text
User / Context → Retrieve vài trăm hoặc vài nghìn candidate items → Ranking → Ads display
```

Retrieval phải nhanh và đủ rộng. Nếu retrieval bỏ sót item tốt, ranking phía sau không còn cơ hội sửa.

### 2. LightSAGE dùng graph như thế nào?

Theo paper LightSAGE, Shopee xây item graph bằng cách kết hợp strong-signal user behaviors với collaborative filtering có độ chính xác cao. Sau đó họ dùng GNN để tạo item embeddings chất lượng cho vector search.

Điểm đáng chú ý là paper không chỉ nói “dùng GNN”. Nó nói về ba vấn đề rất production:

- xây graph chất lượng;
- xử lý data sparsity;
- xử lý cold-start và long-tail items.

Đây là những thứ thường làm recommendation system khó hơn nhiều so với demo.

### 3. Vì sao graph hợp với e-commerce?

Trong e-commerce, item không đứng một mình.

Một sản phẩm có thể liên quan đến sản phẩm khác vì:

- cùng được xem bởi một nhóm user;
- thường được mua cùng nhau;
- cùng nằm trong một intent tìm kiếm;
- có hành vi click/mua tương tự;
- thuộc long-tail nhưng liên quan mạnh tới một niche nhỏ.

Graph giúp biểu diễn các quan hệ này tốt hơn một bảng feature phẳng.

### 4. Ví dụ đơn giản

Giả sử có ba sản phẩm:

```text
A: giày chạy bộ nam
B: tất chạy bộ
C: bình nước thể thao
```

Nếu nhiều user xem A rồi mua B, hoặc mua A rồi click C, graph sẽ tạo ra liên kết giữa các item đó. Model không chỉ nhìn nội dung sản phẩm, mà còn học từ hành vi tập thể.

Với CRM, ý tưởng tương tự có thể dùng cho lead scoring nhẹ:

```text
Lead A giống Lead B
Lead B từng chuyển thành deal
Lead A có khả năng cần follow-up sớm hơn
```

Tất nhiên CRM nhỏ không cần GNN ngay. Nhưng tư duy “quan hệ giữa thực thể quan trọng” thì rất đáng học.

### 5. Kết luận

LightSAGE là một case hay vì nó kéo recommendation system về đúng thực tế: không chỉ có model, mà có dữ liệu, graph, vector search, long-tail, cold-start và A/B test.

Nếu xây AI product nhỏ, bài học là: trước khi chọn model phức tạp, hãy hỏi dữ liệu của mình có đủ quan hệ, đủ tín hiệu và đủ quy trình đánh giá chưa.

## Nguồn tham khảo

- LightSAGE: Graph Neural Networks for Large Scale Item Retrieval in Shopee's Advertisement Recommendation: https://arxiv.org/abs/2310.19394

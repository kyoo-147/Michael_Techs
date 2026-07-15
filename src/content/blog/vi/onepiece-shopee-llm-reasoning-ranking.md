---
title: 'OnePiece ở Shopee: LLM-style reasoning đi vào ranking system như thế nào?'
description: >-
  Ghi chú về paper OnePiece và cách context engineering, reasoning được đưa vào
  industrial cascade ranking system.
pubDatetime: '2024-01-18T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - Ranking System
  - Industrial Recommender
  - LLM Reasoning
categories:
  - Technical
  - AI
  - Product
draft: false
---

## Mở bài

Khi nghe “LLM-style reasoning”, nhiều người nghĩ ngay đến chatbot. Nhưng paper OnePiece của Shopee cho thấy một hướng khác: đưa ý tưởng context engineering và reasoning vào hệ thống ranking/recommendation công nghiệp.

Điều này khá thú vị, vì ranking system trước giờ thường được nhìn như một pipeline retrieval → ranking → reranking, tối ưu CTR, CVR, GMV hoặc một metric business nào đó.

OnePiece đặt câu hỏi: nếu LLM mạnh lên nhờ context và reasoning, liệu ranking model có thể học theo một phần tư duy đó không?

### 1. Ranking system không chỉ là model scoring

Trong e-commerce, ranking không đơn giản là “sắp xếp sản phẩm từ tốt đến xấu”.

Một hệ thống ranking phải xét:

- người dùng là ai;
- họ vừa tìm gì;
- họ từng click/mua gì;
- bối cảnh hiện tại là gì;
- sản phẩm nào đang có khả năng phù hợp;
- metric kinh doanh nào đang được tối ưu.

Pipeline thường là cascade:

```text
Candidate Retrieval → Ranking → Reranking → Final List
```

Mỗi tầng lọc bớt số lượng item và tăng độ chính xác.

### 2. OnePiece đưa context engineering vào ranking

Theo paper, OnePiece đưa hai ý tưởng từ LLM vào retrieval/ranking:

- **structured context engineering:** làm giàu input bằng lịch sử tương tác, preference, scenario signals;
- **block-wise latent reasoning:** cho model có bước refine representation theo kiểu nhiều bước hơn;
- **progressive multi-task training:** dùng chuỗi feedback của user để supervise quá trình học.

Nói đơn giản: thay vì chỉ đưa raw feature vào model, hệ thống cố gắng “kể đúng ngữ cảnh” cho model hiểu người dùng và tình huống tốt hơn.

### 3. Ví dụ dễ hiểu

Giả sử người dùng tìm “áo khoác đi mưa”.

Nếu chỉ nhìn query, hệ thống có thể trả về áo mưa, áo khoác chống nước, áo gió.

Nhưng nếu thêm context:

```text
User từng mua đồ trekking
Đang ở khu vực mưa nhiều
Thường chọn sản phẩm giá trung bình
Gần đây click vào đồ outdoor
```

Ranking có thể ưu tiên sản phẩm outdoor waterproof hơn thay vì áo mưa nhựa giá rẻ.

Đây là tinh thần của context engineering: model không tự nhiên hiểu mọi thứ nếu ta không đưa đủ ngữ cảnh có cấu trúc.

### 4. Bài học cho CRM search

Một CRM cũng có ranking problem.

Khi search một khách hàng hoặc lead, kết quả nên xét:

- tên/contact match;
- deal đang mở;
- lần tương tác gần nhất;
- mức độ ưu tiên;
- giá trị deal;
- trạng thái quote;
- lịch sử follow-up.

Không phải cứ keyword match là đủ. Một lead đang nóng phải được ưu tiên hơn một contact cũ không còn hoạt động, dù text match giống nhau.

### 5. Kết luận

OnePiece là một ví dụ hay cho việc “LLM thinking” không chỉ nằm trong chatbot. Context engineering và reasoning có thể trở thành pattern cho nhiều hệ thống khác, đặc biệt là search/ranking/recommendation.

Điều quan trọng là không bê LLM vào mọi nơi, mà học đúng phần có ích: đưa ngữ cảnh tốt hơn, thiết kế representation tốt hơn, và đánh giá bằng metric thật.

## Nguồn tham khảo

- OnePiece: Bringing Context Engineering and Reasoning to Industrial Cascade Ranking System: https://arxiv.org/abs/2509.18091
- Hugging Face Papers — OnePiece: https://huggingface.co/papers/2509.18091

---
title: 'Feed ranking và feedback loop: bài học cho product builder'
description: >-
  Giải thích feedback loop trong recommendation system và cách product builder
  nên thiết kế tín hiệu, metric và guardrails.
pubDatetime: '2022-11-03T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Feed Ranking
  - Feedback Loop
  - Product Design
  - Recommendation
  - User Behavior
categories:
  - AI
  - Product
---

Feed ranking là một bài toán rất hấp dẫn vì nó có vẻ đơn giản: có nhiều nội dung, chọn cái nào đưa lên trước.

Nhưng sau một thời gian, feed không chỉ phản ánh sở thích người dùng. Nó bắt đầu ảnh hưởng ngược lại đến sở thích, hành vi, niềm tin, và cả cách user tương tác với sản phẩm.

Đó là feedback loop.

Bài này tôi viết như một ghi chú cho product builder: nếu sau này build CRM recommendation, AI suggestion, content feed, search ranking hay next-best-action, mình cần hiểu vòng lặp này trước khi đụng đến model phức tạp.

## Nguồn tôi đọc

- TikTok Newsroom — [How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- arXiv — [The Feedback Loop Between Recommendation Systems and Reactive Users](https://arxiv.org/abs/2504.07105)
- arXiv — [Dynamics of Algorithmic Content Amplification on TikTok](https://arxiv.org/abs/2503.20231)

## 1. Feedback loop là gì?

Một recommendation loop thường giống thế này:

```txt
System recommend item
  → user xem / bỏ qua / click / like / mua / sửa
  → system ghi nhận tín hiệu
  → model/ranking thay đổi
  → recommendation lần sau bị ảnh hưởng
```

Nhìn thì tốt. User thích gì, hệ thống học cái đó.

Nhưng vấn đề là hệ thống cũng đang **định hình thứ user sẽ thấy tiếp theo**. Nếu chỉ tối ưu một metric như watch time hoặc click, hệ thống có thể dần đẩy user vào một vùng nội dung hẹp hơn.

Trong sản phẩm công việc, vòng lặp cũng tồn tại. Nếu CRM liên tục gợi ý “gửi follow-up giảm giá” và user chọn vì nhanh, hệ thống có thể học rằng discount là action tốt, dù về dài hạn làm giảm margin.

## 2. Tín hiệu người dùng không trung lập

Một click không phải lúc nào cũng là thích.

Một user có thể click vì:

- tò mò;
- tiêu đề gây sốc;
- không có lựa chọn tốt hơn;
- nhầm;
- đang kiểm tra;
- muốn xóa khỏi danh sách;
- bị UI đẩy vào.

Tương tự, trong CRM:

```txt
User chọn AI suggestion
```

không có nghĩa suggestion đó tốt. Có thể họ chọn vì lười viết lại. Vì thế cần thêm tín hiệu sau đó:

- họ có chỉnh sửa không?
- message có được gửi không?
- khách có phản hồi không?
- deal có tiến triển không?
- user có undo không?

## 3. Ranking nên có nhiều mục tiêu

Một feed chỉ tối ưu engagement có thể tạo cảm giác “cuốn”, nhưng không chắc tốt.

Một CRM suggestion system cũng không nên chỉ tối ưu “user click suggestion”. Nó nên cân bằng:

```txt
- usefulness
- user trust
- business outcome
- safety
- diversity of actions
- long-term value
```

Ví dụ:

```txt
Score(action) =
  relevance_score
  + urgency_score
  + business_value_score
  - risk_score
  - repetition_penalty
```

Ban đầu có thể là rule-based. Không cần ML ngay.

## 4. Exploration là thứ dễ quên

Nếu hệ thống luôn đề xuất thứ đang thắng, nó sẽ ít thử thứ mới. Lâu dần, recommendation bị kẹt.

Với content feed, điều này làm user thấy lặp.  
Với CRM, điều này làm team chỉ thử một vài action quen thuộc.

Một cách đơn giản:

```txt
80% exploit: chọn action tốt nhất hiện tại
20% explore: thử action hợp lý khác
```

Nhưng exploration trong business tool phải có giới hạn. Không thể “thử nghiệm” bằng cách gửi email rủi ro cho khách lớn. Có thể explore ở mức draft, không auto-send.

## 5. Guardrails cho feedback loop

Tôi sẽ đặt vài guardrails:

- không dùng một metric duy nhất;
- tránh lặp cùng một kiểu suggestion quá nhiều;
- cho user nói “not useful”;
- lưu lý do vì sao action được gợi ý;
- đo correction rate;
- phân biệt click, accept, complete và outcome;
- có human approval với action rủi ro.

Ví dụ UI nên hiện:

```txt
Suggested because:
- Customer has not replied for 3 days
- Quote was sent but not viewed
- Similar deals often need a follow-up call
```

Giải thích đơn giản giúp user tin hệ thống hơn.

## Kết

Feedback loop là trái tim của recommendation system. Nhưng nó cũng là nơi sản phẩm dễ tự làm lệch mình.

Với product builder, bài học không phải là “hãy build thuật toán giống TikTok”. Bài học là: hãy thiết kế tín hiệu, metric và guardrails trước. Model chỉ học tốt khi vòng lặp dữ liệu của sản phẩm đủ rõ và đủ lành mạnh.

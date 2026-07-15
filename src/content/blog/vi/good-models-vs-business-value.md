---
title: Vì sao model tốt chưa chắc tạo business value?
description: >-
  Một ghi chú từ case Booking.com: model performance và business performance là
  hai chuyện khác nhau, đặc biệt khi ML đi vào sản phẩm thật.
pubDatetime: '2024-04-11T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - ML Systems & MLOps
  - ML Evaluation
  - Business Metrics
  - Model Performance
  - A/B Testing
  - Product Impact
categories:
  - AI
  - Product
---

Có một câu tôi nghĩ AI Engineer nên nhớ sớm:

> Model tốt trên benchmark chưa chắc làm sản phẩm tốt hơn.

Nghe hơi khó chịu, vì khi học Machine Learning mình thường được dạy tối ưu accuracy, precision, recall, F1, loss. Những metric đó quan trọng. Nhưng trong sản phẩm thật, chúng chưa phải là câu trả lời cuối cùng.

Booking.com có một paper rất đáng đọc: **150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com**. Họ phân tích khoảng 150 ứng dụng ML đã triển khai cho khách hàng, và một trong những bài học lớn là: **model performance không giống business performance**.

## 1. Model metric và business metric khác nhau ở đâu?

Model metric trả lời câu hỏi:

```txt
Model dự đoán có đúng không?
```

Business metric trả lời câu hỏi:

```txt
Dự đoán đó có làm sản phẩm tốt hơn không?
```

Hai câu này gần nhau, nhưng không giống nhau.

Ví dụ một model dự đoán lead nào có khả năng mua hàng. Offline evaluation cho thấy model có AUC tốt, precision tốt. Nhưng khi đưa vào CRM, sales lại không dùng vì:

- lý do dự đoán không rõ;
- lead score cập nhật quá chậm;
- gợi ý không khớp với cách sales làm việc;
- model ưu tiên lead “dễ đoán” nhưng không phải lead có giá trị cao;
- workflow sau prediction không được thiết kế tốt.

Kết quả: model đúng hơn, nhưng business không cải thiện.

## 2. Một ví dụ rất đời thường

Giả sử có AI chấm điểm lead:

```txt
Lead A: score 0.91
Lead B: score 0.77
Lead C: score 0.64
```

Nếu chỉ nhìn model, mình sẽ nói Lead A nên được ưu tiên.

Nhưng business có thể hỏi thêm:

- Lead A có budget không?
- Lead A có đang cần mua ngay không?
- Lead A thuộc ngành mình phục vụ tốt không?
- Sales có đủ context để gọi không?
- Nếu gọi lead này, xác suất chuyển thành deal thật là bao nhiêu?

Vì vậy một AI workflow tốt không nên chỉ hiển thị score. Nó cần biến score thành hành động:

```txt
Lead A có điểm cao vì đã yêu cầu demo, có mô tả nhu cầu rõ, và đến từ ngành phù hợp.
Gợi ý: gọi trong 2 giờ tới, gửi proposal template A nếu họ phản hồi.
```

Model score chỉ là một phần. Hành động tiếp theo mới là nơi tạo giá trị.

## 3. Vì sao A/B testing quan trọng?

Booking.com nhấn mạnh việc kiểm tra business impact bằng randomized controlled trials/A/B testing. Lý do là vì nhiều thay đổi nhìn hợp lý trên giấy nhưng khi ra sản phẩm thật lại không tạo uplift.

Với ML product, A/B testing có thể trả lời:

```txt
Nhóm dùng AI suggestion có close rate tốt hơn không?
Nhóm dùng ranking mới có click-through rate tốt hơn không?
Nhóm nhận follow-up tự động có phản hồi nhiều hơn không?
```

Nếu không test, mình dễ rơi vào cảm giác “model tốt hơn nên chắc sản phẩm tốt hơn”.

Nhưng sản phẩm thật có người dùng thật, hành vi thật, sự khó chịu thật. Có những thứ metric offline không nhìn thấy.

## 4. Proxy metric có thể đánh lừa mình

Một lỗi thường gặp là tối ưu proxy metric.

Ví dụ:

```txt
Tăng số click
Tăng thời gian ở lại trang
Tăng số tin nhắn AI tạo ra
Tăng số recommendation được hiển thị
```

Nhưng click nhiều chưa chắc tốt. Tin nhắn nhiều chưa chắc giúp sales. Recommendation nhiều chưa chắc đúng lúc.

Với CRM, metric tốt hơn có thể là:

```txt
thời gian phản hồi lead giảm
số follow-up bị quên giảm
tỷ lệ chuyển stage tăng
sales mất ít thời gian nhập liệu hơn
khách hàng nhận được phản hồi rõ hơn
```

Tức là metric phải gắn với workflow thật.

## 5. Một checklist nhỏ trước khi deploy model

Trước khi đưa model vào product, tôi nghĩ nên hỏi:

1. Model này giúp người dùng ra quyết định gì?
2. Prediction có được giải thích đủ để người dùng tin không?
3. Nếu model sai, hậu quả là gì?
4. Có fallback không?
5. Có log lại decision và outcome không?
6. Có đo business metric sau khi deploy không?
7. Có cách rollback không?

Ví dụ với AI follow-up trong CRM:

```txt
Model task: gợi ý nội dung follow-up
User action: sales review và gửi
Business metric: response rate, time-to-follow-up, deal stage movement
Safety: không tự gửi nếu confidence thấp hoặc thiếu context
Fallback: dùng template thủ công
```

Khi viết rõ như vậy, model bắt đầu trở thành một phần của product system.

## 6. Bài học cho người build AI product

Điều tôi rút ra là: AI Engineer không nên chỉ nói chuyện bằng model metric. Phải học cách nói chuyện bằng business workflow.

Không phải để biến kỹ sư thành sales, mà để biết hệ thống mình build có thật sự giải quyết vấn đề không.

Một model tốt nên trả lời được cả hai phía:

```txt
Về kỹ thuật: model có đủ chính xác, ổn định, latency phù hợp không?
Về sản phẩm: model có giúp người dùng làm việc tốt hơn không?
```

Nếu chỉ có vế đầu, đó là research/demo.
Nếu có cả hai, đó mới là applied AI product.

## 7. Kết luận

Model tốt là điều kiện cần. Nhưng business value đến từ cả hệ thống: dữ liệu đúng, UX đúng, workflow đúng, metric đúng, monitoring đúng, và feedback loop đúng.

Tôi nghĩ đây là một bài học rất quan trọng cho người làm AI hiện nay. Vì AI đang dễ build demo hơn bao giờ hết. Nhưng demo chạy được không có nghĩa là sản phẩm tạo giá trị.

## Nguồn tham khảo

- [150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com](https://booking.ai/150-successful-machine-learning-models-6-lessons-learned-at-booking-com-681e09107bec)
- [150 Successful Machine Learning Models — ACM Digital Library](https://dl.acm.org/doi/10.1145/3292500.3330744)
- [The Morning Paper: 150 Successful Machine Learning Models](https://blog.acolyer.org/2019/10/07/150-successful-machine-learning-models/)

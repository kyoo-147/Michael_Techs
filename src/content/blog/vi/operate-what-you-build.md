---
title: 'Operate what you build: bài học cho AI product nhỏ'
description: >-
  Phân tích tư duy ownership trong production engineering và cách áp dụng vào AI
  workflow, CRM, dashboard và sản phẩm nhỏ.
pubDatetime: '2024-03-14T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Ownership
  - Production Engineering
  - Monitoring
  - AI Product
  - DevOps
categories:
  - Product
  - Experience
---

Có một cảm giác rất khác giữa “build xong feature” và “chịu trách nhiệm cho feature đó chạy ngoài đời”.

Feature chạy trên máy mình là một chuyện. Feature chạy với dữ liệu thật, user thật, lỗi thật, chi phí thật, latency thật là chuyện khác.

Tôi thích câu **operate what you build** vì nó kéo kỹ sư ra khỏi suy nghĩ: “code xong là xong”. Với AI product, điều này còn quan trọng hơn, vì lỗi không chỉ là server 500. Lỗi có thể là AI trả lời sai, workflow gửi follow-up nhầm, dashboard chậm, hoặc model drift mà không ai biết.

## Nguồn tôi đọc

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)
- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Build feature không đủ

Một flow AI lead management có thể trông rất ổn trong demo:

```txt
Website form
  → CRM lead
  → AI phân loại
  → tạo follow-up message
  → cập nhật dashboard
```

Nhưng production sẽ hỏi những câu khó hơn:

- nếu LLM API timeout thì sao?
- nếu lead bị tạo trùng thì sao?
- nếu message follow-up sai tone thì ai duyệt?
- nếu queue backlog tăng thì dashboard có báo không?
- nếu cost LLM tăng bất thường thì ai biết?
- nếu model trả lời khác sau khi đổi prompt thì test ở đâu?

Đây là khoảng cách giữa demo và product.

## 2. Ownership nghĩa là biết hệ thống đau ở đâu

Operate what you build không có nghĩa là một người phải làm hết mọi thứ. Nó nghĩa là người build hiểu hệ thống của mình đủ để:

- biết metric nào quan trọng;
- biết khi nào cần alert;
- biết rollback thế nào;
- biết dữ liệu nào là source of truth;
- biết lỗi nào ảnh hưởng user thật;
- biết trade-off giữa tốc độ và độ an toàn.

Với AI workflow, tôi sẽ theo dõi tối thiểu:

```txt
Workflow success rate
Workflow failure rate
LLM latency
LLM cost per workflow
Retry count
Queue depth
Human approval rate
User correction rate
```

Những metric này thực tế hơn việc chỉ nhìn “server còn sống không”.

## 3. AI product cần human-in-the-loop ở đúng chỗ

Không phải bước nào cũng cần con người duyệt. Nhưng có những điểm nên có kiểm soát:

- gửi email/báo giá cho khách;
- thay đổi deal stage quan trọng;
- tạo nội dung có rủi ro pháp lý;
- phản hồi cho trẻ em hoặc nhóm người nhạy cảm;
- ghi đè dữ liệu CRM quan trọng.

Ví dụ:

```txt
AI tạo follow-up message
  → nếu lead bình thường: auto-save draft
  → nếu deal value cao: cần người duyệt
  → nếu confidence thấp: gắn flag "review needed"
```

Đây là cách làm AI bớt nguy hiểm mà vẫn hữu ích.

## 4. Monitoring không chỉ dành cho backend

Một AI product nhỏ nên monitor cả tầng product:

### Technical metrics

```txt
API latency
Error rate
Queue depth
Database query time
LLM timeout
```

### AI metrics

```txt
Prompt version
Model version
Evaluation score
Human correction rate
Hallucination reports
```

### Business metrics

```txt
Lead response time
Follow-up completion rate
Quote sent rate
Deal conversion
User active rate
```

Nếu chỉ monitor server, ta chỉ biết hệ thống có chạy. Nhưng không biết sản phẩm có tạo giá trị không.

## 5. Một ví dụ rất nhỏ về rollback

Giả sử bạn đổi prompt cho AI follow-up:

```txt
prompt_v1: lịch sự, ngắn gọn
prompt_v2: thân thiện, nhiều gợi ý upsell
```

Sau khi deploy `prompt_v2`, user bắt đầu sửa lại message nhiều hơn. Tỷ lệ correction tăng từ 12% lên 35%.

Nếu không lưu prompt version, bạn không biết lỗi đến từ đâu. Nếu không có feature flag, bạn rollback chậm. Nếu không có evaluation set, bạn chỉ biết khi user than phiền.

Một cách làm an toàn hơn:

```txt
1. Version prompt
2. Chạy evaluation set trước deploy
3. Canary 10% workspace
4. Theo dõi correction rate
5. Rollback nếu metric xấu
```

Không cần hệ thống quá phức tạp. Nhưng phải có ý thức production.

## Kết

Operate what you build là một tư duy rất đáng có cho người làm sản phẩm AI.

Nó không làm mình chậm hơn. Ngược lại, nó giúp mình build tự tin hơn. Vì khi có logs, metrics, rollback, eval và alert, mình dám thay đổi hệ thống mà không phải cầu may.

Với tôi, đây là ranh giới giữa một demo AI và một sản phẩm AI thật.

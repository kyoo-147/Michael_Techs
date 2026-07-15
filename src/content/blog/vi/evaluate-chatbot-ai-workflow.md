---
title: >-
  Đánh giá chatbot/AI workflow: benchmark, verifier, LLM judge và test case thực
  tế
description: >-
  Một bài ghi chú thực tế về LLM evaluation: benchmark chỉ là điểm bắt đầu, còn
  sản phẩm thật cần test case, verifier, human review và metric gắn với
  workflow.
pubDatetime: '2023-10-05T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - AI / LLM Research
  - LLM Evaluation
  - Benchmark
  - Verifier
  - LLM-as-Judge
  - Test Cases
  - AI Workflow
categories:
  - Technical
  - AI
---

Một chatbot trả lời nghe rất mượt không có nghĩa là nó tốt.

Nó có thể:

- trả lời sai nhưng tự tin,
- bịa thông tin,
- không tuân thủ rule,
- quên context quan trọng,
- làm đúng demo nhưng fail ở case thật,
- tốt ở benchmark nhưng không giúp workflow kinh doanh chạy tốt hơn.

Vậy nên nếu build AI workflow nghiêm túc, evaluation không phải phần “làm sau cũng được”. Nó nên được nghĩ từ sớm.

## 1. Benchmark là điểm bắt đầu, không phải câu trả lời cuối

Benchmark giúp mình có cảm giác ban đầu về năng lực model. Ví dụ một model có thể mạnh ở reasoning, một model khác mạnh ở coding, một model khác tốt hơn ở multilingual.

Nhưng benchmark thường không giống dữ liệu thật của sản phẩm.

Ví dụ với CRM, benchmark không trả lời được các câu như:

```text
- Model có hiểu trạng thái deal của mình không?
- Có biết khi nào không được tự ý giảm giá không?
- Có giữ đúng tone thương hiệu không?
- Có biết hỏi lại khi thiếu số điện thoại/email không?
- Có bịa thông tin khách hàng không?
```

Vì vậy, benchmark nên dùng để chọn model ban đầu. Còn quyết định production phải dựa trên test case của chính workflow.

## 2. Bốn cách đánh giá LLM thường gặp

Sebastian Raschka chia các hướng evaluation phổ biến thành 4 nhóm: multiple-choice benchmark, verifier, leaderboard và LLM judge.

Tôi diễn giải lại theo cách thực dụng hơn:

### Multiple-choice benchmark

Dễ chấm, dễ so sánh, nhưng đôi khi không phản ánh task thật.

Phù hợp để hỏi:

> Model có nền tảng kiến thức/reasoning tương đối ổn không?

Không đủ để hỏi:

> Model có xử lý đúng workflow CRM của mình không?

### Verifier

Verifier là một bộ kiểm tra kết quả. Nó có thể là code, rule, database check hoặc model khác.

Ví dụ:

```text
Nếu output có giá tiền nhưng dữ liệu đầu vào không có giá tiền → fail.
Nếu message hứa giao hàng trong 24h nhưng policy không có → fail.
Nếu câu trả lời không trích nguồn từ tài liệu → fail.
```

Verifier rất hợp với các workflow cần kiểm soát lỗi rõ ràng.

### Leaderboard

Leaderboard hữu ích để tham khảo nhanh, nhưng không nên thần thánh hóa.

Một model đứng cao trên leaderboard không có nghĩa là phù hợp với tiếng Việt, domain của mình, latency của mình, hoặc ngân sách của mình.

### LLM-as-Judge

Dùng một LLM khác để chấm output theo rubric.

Ví dụ rubric:

```text
Score 1-5:
- Có trả lời đúng câu hỏi không?
- Có dùng dữ liệu được cung cấp không?
- Có bịa thông tin không?
- Có giữ tone chuyên nghiệp không?
- Có đưa ra next action rõ không?
```

LLM judge tiện, nhưng không tuyệt đối. Với task quan trọng, nên có human review hoặc rule checker đi kèm.

## 3. Evaluation cho AI workflow nên bắt đầu từ lỗi thật

Tôi thích bắt đầu bằng câu hỏi:

> Hệ thống này mà sai thì sai kiểu gì?

Với AI sales assistant, các lỗi có thể là:

- bịa thông tin khách hàng,
- gửi follow-up sai ngữ cảnh,
- phân loại nhầm lead nóng/lạnh,
- đề xuất giảm giá sai quyền hạn,
- không nhận ra khách đang phàn nàn,
- trả lời quá dài, không dùng được.

Từ lỗi thật, mình viết test case.

## 4. Ví dụ test case cho CRM AI assistant

Một test case đơn giản có thể như này:

```json
{
  "name": "Không bịa thông tin khi lead thiếu số điện thoại",
  "input": {
    "lead_name": "Anh Nam",
    "message": "Tôi muốn nhận báo giá gói CRM cho đội sales 5 người.",
    "phone": null,
    "email": null
  },
  "expected_behavior": [
    "Không tự tạo số điện thoại hoặc email",
    "Cảm ơn khách hàng",
    "Hỏi lại thông tin liên hệ còn thiếu",
    "Giữ tone lịch sự và ngắn gọn"
  ]
}
```

Một test case khác:

```json
{
  "name": "Không tự ý giảm giá khi chưa có quyền",
  "input": {
    "deal_stage": "Proposal Sent",
    "customer_message": "Nếu giảm 50% thì tôi ký ngay.",
    "discount_policy": "Sales assistant không được tự quyết định discount."
  },
  "expected_behavior": [
    "Không xác nhận giảm giá",
    "Ghi nhận yêu cầu của khách",
    "Đề xuất chuyển cho người có thẩm quyền",
    "Không bịa chính sách mới"
  ]
}
```

Những test case như vậy có giá trị hơn rất nhiều so với việc chỉ hỏi model vài câu chung chung.

## 5. Một pipeline evaluation nhỏ

Với project nhỏ, pipeline có thể rất đơn giản:

```text
Dataset test cases
→ chạy prompt/model version mới
→ chấm bằng rule/verifier
→ chấm bằng LLM judge nếu cần
→ log lỗi
→ so sánh với version cũ
→ chỉ deploy nếu không làm hỏng các case quan trọng
```

Không cần phức tạp ngay từ đầu. Quan trọng là có baseline.

## 6. Nên chấm những metric nào?

Tùy workflow, nhưng tôi sẽ bắt đầu với các metric dễ hiểu:

| Metric | Ý nghĩa |
|---|---|
| Accuracy | Trả lời đúng không |
| Faithfulness | Có bám vào dữ liệu được cung cấp không |
| Hallucination rate | Có bịa không |
| Policy compliance | Có tuân thủ rule không |
| Tone quality | Giọng văn có phù hợp không |
| Task completion | Có hoàn thành việc cần làm không |
| Latency | Có quá chậm không |
| Cost per task | Mỗi task tốn bao nhiêu |

Với AI product thật, metric kỹ thuật phải nối với metric workflow. Ví dụ: giảm thời gian follow-up, giảm lỗi báo giá, tăng tỷ lệ phản hồi, giảm số lần nhân viên phải sửa output.

## 7. Khi nào cần human review?

Human review nên có khi:

- output ảnh hưởng tiền bạc,
- liên quan trẻ em hoặc người yếu thế,
- có rủi ro pháp lý,
- có thay đổi dữ liệu quan trọng,
- model không chắc,
- khách hàng đang tức giận hoặc phàn nàn.

Với Snow AI Companion, human review và parental control còn quan trọng hơn. Một AI companion cho trẻ em không thể chỉ đánh giá bằng “trả lời có hay không”. Nó phải được đánh giá về an toàn, giới hạn, tone, memory và khả năng từ chối.

## 8. Tôi sẽ bắt đầu nhỏ như thế nào?

Nếu build một AI workflow mới, tôi sẽ làm version đầu như này:

```text
- 20 test cases thật
- 5 test case dễ
- 10 test case trung bình
- 5 test case khó hoặc nguy hiểm
- 1 file prompt versioned
- 1 script chạy eval
- 1 bảng ghi pass/fail
- 1 danh sách lỗi cần sửa
```

Sau đó mỗi lần sửa prompt, đổi model, thêm RAG, hoặc thay workflow, tôi chạy lại eval.

Đây là cách đơn giản nhưng giúp mình tránh kiểu “demo hôm nay chạy được, tuần sau đổi model thì hỏng”.

## Kết luận

LLM evaluation không cần bắt đầu bằng một platform quá phức tạp.

Nó bắt đầu bằng sự thật rất đơn giản:

> Mình phải biết AI của mình sai ở đâu, sai kiểu gì, và sai có nguy hiểm không.

Benchmark giúp chọn model. Verifier giúp bắt lỗi rõ ràng. LLM judge giúp chấm các tiêu chí mềm hơn. Human review giúp kiểm soát các quyết định quan trọng.

Một AI workflow tốt không phải workflow không bao giờ sai. Mà là workflow biết **phát hiện lỗi, giới hạn rủi ro, và cải thiện có kiểm chứng**.

## Nguồn tham khảo

- Sebastian Raschka, **Understanding the 4 Main Approaches to LLM Evaluation**: https://magazine.sebastianraschka.com/p/llm-evaluation-4-approaches
- OpenAI, **Working with evals**: https://developers.openai.com/api/docs/guides/evals
- OpenAI, **Evaluation best practices**: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- OpenAI, **Evaluate agent workflows**: https://developers.openai.com/api/docs/guides/agent-evals
- LangSmith, **Evaluation documentation**: https://docs.langchain.com/langsmith/evaluation
- DeepEval, **LLM Evaluation Framework**: https://github.com/confident-ai/deepeval
- EleutherAI, **Language Model Evaluation Harness**: https://github.com/EleutherAI/lm-evaluation-harness

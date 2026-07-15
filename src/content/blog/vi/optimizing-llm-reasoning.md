---
title: Tối ưu reasoning của LLM không chỉ bằng train model lớn hơn
description: >-
  Inference-time scaling, self-consistency, verifier và reasoning budget giúp
  cải thiện chất lượng LLM như thế nào, và khi nào không nên dùng vì quá tốn chi
  phí.
pubDatetime: '2024-10-08T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - AI / LLM Research
  - LLM Reasoning
  - Inference-time Scaling
  - Prompting
  - Evaluation
  - AI Optimization
categories:
  - Technical
  - AI
---

Có một suy nghĩ rất dễ gặp khi model trả lời sai:

> “Chắc cần model lớn hơn.”

Đôi khi đúng. Nhưng không phải lúc nào cũng vậy.

Nhiều nghiên cứu gần đây cho thấy ta có thể cải thiện khả năng reasoning của LLM bằng cách tăng compute ở lúc inference: cho model tạo nhiều lời giải, tự kiểm tra, dùng verifier, chia nhỏ bài toán, hoặc gọi tool/RAG đúng lúc.

Nói đơn giản hơn: thay vì luôn train model lớn hơn, đôi khi ta có thể **thiết kế cách model suy nghĩ tốt hơn khi chạy thật**.

## 1. Inference-time scaling là gì?

Inference-time scaling là việc dùng thêm tài nguyên ở lúc model trả lời để tăng chất lượng output.

Ví dụ:

- gọi model nhiều lần rồi chọn câu trả lời nhất quán,
- cho model giải từng bước,
- dùng model khác để kiểm tra,
- dùng verifier để chấm kết quả,
- dùng retrieval để lấy thông tin đúng trước khi trả lời,
- tăng reasoning budget cho câu hỏi khó.

Nó giống như con người vậy. Có câu hỏi chỉ cần trả lời nhanh. Có câu hỏi phải nháp, kiểm tra lại, hoặc hỏi thêm dữ liệu.

## 2. Self-consistency: không lấy câu trả lời đầu tiên quá vội

Một kỹ thuật kinh điển là **self-consistency**. Thay vì để model sinh một reasoning path duy nhất, ta cho model sinh nhiều reasoning path khác nhau, rồi chọn đáp án xuất hiện nhất quán nhất.

Ví dụ bài toán đơn giản:

```text
Question:
Một khách hàng có 3 đơn hàng đang xử lý. Sau đó thêm 2 đơn mới.
Tổng số đơn cần theo dõi là bao nhiêu?
```

Nếu model trả lời một lần, nó có thể đúng hoặc sai. Nhưng nếu cho model sinh nhiều lời giải, ta có thể lấy câu trả lời được nhiều reasoning path độc lập cùng đi tới.

Ý tưởng này được paper **Self-Consistency Improves Chain of Thought Reasoning in Language Models** đề xuất, và kết quả cho thấy self-consistency cải thiện nhiều benchmark reasoning như GSM8K, SVAMP, AQuA, StrategyQA và ARC-challenge.

Nhưng đổi lại là chi phí cao hơn, vì ta gọi model nhiều lần hơn.

## 3. Verifier: đừng chỉ tạo câu trả lời, hãy kiểm tra nó

Một hướng khác là dùng verifier.

Pipeline đơn giản:

```text
User question
→ model tạo câu trả lời
→ verifier kiểm tra câu trả lời
→ nếu chưa đạt, model sửa hoặc trả lời "không đủ dữ liệu"
```

Verifier có thể là:

- rule-based checker,
- một model khác,
- một hàm kiểm tra dữ liệu,
- một evaluator theo rubric,
- human review cho task rủi ro cao.

Ví dụ với CRM:

```text
Task:
Soạn follow-up message cho khách hàng.

Verifier kiểm tra:
- Có bịa giá không?
- Có nhắc đúng tên khách không?
- Có dùng đúng trạng thái deal không?
- Có đưa ra lời hứa ngoài chính sách không?
- Có giữ tone lịch sự không?
```

Đây là điểm tôi thấy rất quan trọng: trong sản phẩm thật, reasoning tốt không chỉ là giải toán đúng. Reasoning tốt còn là **không tự tin quá mức khi thiếu dữ liệu**.

## 4. Reasoning budget: task nào khó mới cần nghĩ lâu

Không phải request nào cũng cần inference-time scaling.

Nếu user hỏi:

> “Tóm tắt lead này trong 3 dòng.”

Có thể một lần gọi model là đủ.

Nhưng nếu user hỏi:

> “Lead này có nên ưu tiên không? Dựa trên lịch sử trao đổi, giá trị deal, lần follow-up gần nhất và khả năng chốt.”

Đây là task có nhiều bước hơn. Lúc đó có thể cần:

- lấy dữ liệu từ CRM,
- tóm tắt lịch sử,
- đánh giá tín hiệu mua hàng,
- so sánh với rule,
- tạo recommendation,
- giải thích ngắn gọn lý do.

Vậy nên reasoning budget nên phụ thuộc vào độ khó và rủi ro của task.

## 5. Một ví dụ thiết kế cho AI workflow

Giả sử tôi build một AI assistant cho sales team.

Tôi có thể chia task thành 3 mức:

| Mức | Ví dụ | Cách xử lý |
|---|---|---|
| Low-risk | Tóm tắt lead, viết nháp email | 1 lần gọi model |
| Medium-risk | Lead scoring, next action | RAG + model + verifier |
| High-risk | Discount, quote, thay đổi deal stage | Human approval bắt buộc |

Cách này thực dụng hơn là bật reasoning nặng cho tất cả mọi thứ.

## 6. Khi nào inference-time scaling không đáng dùng?

Nó không phải thuốc tiên.

Không nên dùng nếu:

- task đơn giản,
- user cần realtime rất nhanh,
- chi phí token quá cao,
- không có cách kiểm tra output,
- dữ liệu đầu vào đã sai,
- model thiếu kiến thức domain nhưng không được bổ sung bằng retrieval/tool,
- tăng số lần gọi model nhưng không cải thiện được metric thật.

Một số nghiên cứu cũng chỉ ra rằng lợi ích của inference-time scaling phụ thuộc vào loại task. Có task cải thiện rõ, có task tăng compute nhưng accuracy không tăng tương xứng.

## 7. Checklist áp dụng

Khi muốn cải thiện reasoning của một LLM workflow, tôi sẽ hỏi:

```text
1. Task này có thật sự cần reasoning nhiều bước không?
2. Sai thì hậu quả là gì?
3. Có dữ liệu đúng để model dựa vào không?
4. Có verifier hoặc rule kiểm tra output không?
5. Có chấp nhận latency tăng không?
6. Có đo được chất lượng trước/sau không?
7. Có fallback khi model không chắc không?
```

Nếu trả lời được các câu này, lúc đó mới nên thêm self-consistency, verifier, multi-step reasoning hoặc tool use.

## Kết luận

Tối ưu reasoning không chỉ là chọn model lớn hơn.

Đôi khi thứ làm hệ thống tốt hơn là:

- biết task nào cần nghĩ kỹ,
- biết khi nào cần retrieval,
- biết khi nào phải verify,
- biết khi nào cần human approval,
- và biết khi nào nên trả lời “không đủ dữ liệu”.

Với tôi, đây mới là phần thú vị của AI Engineering: không chỉ dùng model, mà thiết kế cách model tham gia vào một workflow thật.

## Nguồn tham khảo

- Sebastian Raschka, **Categories of Inference-Time Scaling for Improved LLM Reasoning**: https://magazine.sebastianraschka.com/p/categories-of-inference-time-scaling
- Sebastian Raschka, **The State of LLM Reasoning Model Inference**: https://magazine.sebastianraschka.com/p/state-of-llm-reasoning-and-inference-scaling
- Wang et al., **Self-Consistency Improves Chain of Thought Reasoning in Language Models**: https://arxiv.org/abs/2203.11171
- Parashar et al., **Inference-Time Computations for LLM Reasoning and Planning: A Benchmark and Insights**: https://arxiv.org/abs/2502.12521
- Balachandran et al., **Inference-Time Scaling for Complex Tasks: Where We Stand and What Lies Ahead**: https://arxiv.org/abs/2504.00294

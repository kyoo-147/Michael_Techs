---
title: Cách migrate test/evaluation pipeline cho AI workflow mà không phá production
description: >-
  Ghi chú thực tế về cách thay đổi prompt, model hoặc evaluation pipeline cho AI
  workflow mà vẫn giữ hệ thống ổn định.
pubDatetime: '2023-11-16T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Technical Notes
  - Testing
  - Evaluation Pipeline
  - AI Workflow
  - Migration
  - Production Safety
  - CI/CD
categories:
  - Technical
  - AI
---

## Mở bài

Một AI workflow nhìn bên ngoài có vẻ đơn giản: user gửi yêu cầu, backend gọi LLM, hệ thống trả lời. Nhưng khi đưa vào production, mọi thứ phức tạp hơn rất nhiều.

Chỉ cần đổi prompt, đổi model, đổi retrieval logic hoặc đổi format output, kết quả có thể thay đổi. Đôi khi thay đổi đó tốt hơn. Đôi khi nó âm thầm làm hỏng những case cũ.

Vấn đề của bài này là: **làm sao migrate test/evaluation pipeline cho AI workflow mà không phá production?**

Tôi lấy ý tưởng từ OpenAI Evals, LangSmith Evaluation và cách CI/CD truyền thống kiểm tra code trước khi merge. Nhưng bài này viết theo hướng thực dụng: một project nhỏ vẫn có thể làm được.

## 1. Vấn đề

AI workflow khác phần mềm truyền thống ở một điểm khó chịu: output không luôn deterministic.

Một API bình thường:

```text
input A → output B
```

Nếu test pass hôm nay thì thường ngày mai vẫn pass, trừ khi code thay đổi.

Nhưng với LLM workflow:

```text
input A → output B1 / B2 / B3
```

Output có thể khác nhau vì:

- model version thay đổi
- prompt thay đổi
- context retrieval thay đổi
- dữ liệu trong database thay đổi
- temperature/config thay đổi
- tool calling thay đổi
- evaluator đánh giá chưa rõ ràng

Nếu không có evaluation pipeline, ta dễ deploy theo cảm giác: “mình test thử thấy ổn”. Cách đó không đủ an toàn.

## 2. Pipeline tối thiểu nên có

Một AI workflow nhỏ nên có pipeline như sau:

```text
Test Cases
   ↓
Run Workflow Version
   ↓
Evaluate Output
   ↓
Compare with Baseline
   ↓
Decide: Pass / Warn / Block
```

Trong đó:

- **Test cases**: bộ câu hỏi hoặc tình huống đại diện.
- **Workflow version**: prompt/model/retrieval logic đang test.
- **Evaluator**: luật đánh giá bằng code, human review hoặc LLM-as-judge.
- **Baseline**: version đang chạy ổn định hiện tại.
- **Decision gate**: quy tắc có cho deploy không.

## 3. Đừng bắt đầu bằng evaluator phức tạp

Sai lầm dễ gặp là bắt đầu bằng LLM-as-judge cho mọi thứ. Nó hữu ích, nhưng không nên là lớp đầu tiên.

Tôi sẽ chia evaluator thành 4 tầng:

### Tầng 1: Format checks

Kiểm tra output có đúng schema không.

```ts
type LeadQualificationResult = {
  score: number;
  reason: string;
  nextAction: string;
};
```

Nếu workflow cần trả JSON, thì test đầu tiên là JSON có parse được không, field có đủ không, type có đúng không.

### Tầng 2: Rule-based checks

Kiểm tra các điều chắc chắn đúng/sai.

Ví dụ:

- score phải từ 0 đến 100
- không được trả lời bằng ngôn ngữ ngoài yêu cầu
- không được đề xuất hành động nếu thiếu email/số điện thoại
- không được tạo thông tin khách hàng không có trong dữ liệu

### Tầng 3: Golden test cases

Bộ case mẫu do mình tự viết hoặc lấy từ production trace đã được kiểm tra.

Ví dụ:

```json
{
  "input": "Khách hỏi giá gói CRM cho 5 người dùng",
  "expected_behavior": "Phân loại là sales-qualified lead và đề xuất gửi quote"
}
```

Không nhất thiết expected output phải giống từng chữ. Nhưng expected behavior phải đúng.

### Tầng 4: LLM-as-judge / human review

Dùng cho tiêu chí mềm hơn:

- câu trả lời có hữu ích không
- có đúng tone không
- có follow instruction không
- có hallucination không
- có giải thích rõ không

## 4. Migration strategy

Khi thay đổi pipeline, đừng thay tất cả cùng lúc.

Tôi sẽ dùng 4 bước:

### Bước 1: Freeze baseline

Trước khi sửa, lưu lại version đang chạy:

```text
prompt_v1
model_config_v1
retrieval_config_v1
eval_dataset_v1
```

Baseline là thứ giúp mình biết version mới tốt hơn hay chỉ “có vẻ tốt hơn”.

### Bước 2: Chạy song song

Version mới không thay thế production ngay. Nó chạy song song trên cùng bộ test cases.

```text
production workflow → baseline score
new workflow        → candidate score
```

### Bước 3: So sánh theo metric

Ví dụ metric đơn giản:

```text
schema_pass_rate >= 99%
golden_case_pass_rate >= 90%
hallucination_flag_rate không tăng
latency không tăng quá 20%
cost không tăng quá 30%
```

Không cần metric hoàn hảo ngay từ đầu. Nhưng phải có gate rõ ràng.

### Bước 4: Canary release

Nếu pass offline eval, cho một phần nhỏ traffic dùng version mới.

```text
95% traffic → workflow cũ
5% traffic  → workflow mới
```

Theo dõi log, feedback, error rate, latency, cost. Nếu ổn mới tăng dần.

## 5. Ví dụ: migrate prompt cho AI lead workflow

Giả sử OneClick CRM có workflow:

```text
Website lead → enrich data → classify lead → suggest next action → update CRM
```

Prompt cũ phân loại lead hơi chung chung. Prompt mới muốn phân loại rõ hơn:

```text
Cold lead / Warm lead / Sales-qualified lead / Support request
```

Tôi sẽ tạo test cases:

```json
[
  {
    "input": "Tôi muốn báo giá CRM cho team 10 người, có tích hợp Zalo không?",
    "expected": "Sales-qualified lead"
  },
  {
    "input": "Cho tôi hỏi cách reset mật khẩu",
    "expected": "Support request"
  },
  {
    "input": "Tôi chỉ đang xem thử thôi",
    "expected": "Cold lead"
  }
]
```

Evaluator đầu tiên không cần thông minh:

```ts
function evaluateClassification(actual: string, expected: string) {
  return actual === expected ? "pass" : "fail";
}
```

Sau đó mới thêm LLM judge để đánh giá phần `reason` và `nextAction`.

## 6. CI/CD nên kiểm tra gì?

Trong GitHub Actions, tôi sẽ tách thành các job:

```text
lint
unit_tests
schema_tests
ai_eval_tests
cost_guard
build
```

Ví dụ workflow đơn giản:

```yaml
name: AI Workflow Checks

on:
  pull_request:
    branches: [main]

jobs:
  eval:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
      - run: npm run eval:ai-workflows
```

Điểm quan trọng là eval chạy ở pull request, không phải sau khi đã deploy production.

## 7. Những thứ không nên làm

- Không deploy prompt mới chỉ vì test tay 3 câu thấy ổn.
- Không dùng LLM-as-judge làm tiêu chuẩn duy nhất.
- Không thay model, prompt, retrieval, schema cùng một lúc.
- Không đánh giá chỉ bằng “câu trả lời nghe hay”.
- Không bỏ qua latency và cost.
- Không quên lưu dataset version.

## 8. Kết luận

Evaluation pipeline cho AI workflow không cần bắt đầu quá lớn. Với project nhỏ, chỉ cần có:

```text
10–50 golden test cases
schema checks
rule-based checks
baseline comparison
CI gate
manual review cho case quan trọng
```

Bài học chính của tôi:

- AI workflow cần regression testing như software truyền thống.
- Output LLM không deterministic nên phải đánh giá theo behavior.
- Migration an toàn là chạy song song, so với baseline, rồi canary.
- Evaluation phải gắn với mục tiêu sản phẩm, không chỉ điểm benchmark.

Nếu không có eval, AI workflow chỉ là demo. Có eval, nó mới bắt đầu giống một hệ thống production.

## Nguồn tham khảo

- OpenAI Evals: https://github.com/openai/evals
- OpenAI Cookbook — Getting Started with OpenAI Evals: https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals
- LangSmith Evaluation: https://docs.langchain.com/langsmith/evaluation
- LangSmith Evaluation Concepts: https://docs.langchain.com/langsmith/evaluation-concepts
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

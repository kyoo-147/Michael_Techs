---
title: >-
  Evaluating chatbot/AI workflow: benchmark, verifier, LLM judge and real-world
  test cases
description: >-
  A practical note on LLM evaluation: benchmarks are just the starting point,
  while a real product needs test cases, verifiers, human review and metrics
  tied to the workflow.
pubDatetime: '2023-10-05T00:00:00.000Z'
locale: en
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

A chatbot answering smoothly doesn't mean it's good.

It might:

- answer incorrectly but confidently,
- hallucinate information,
- disobey rules,
- forget important context,
- perform well on demos but fail on real cases,
- score well on benchmarks but not help the business workflow run better.

So if you are building an AI workflow seriously, evaluation is not a "can do later" part. It should be thought about early.

## 1. Benchmarks are the starting point, not the final answer

Benchmarks help us get an initial sense of a model's capability. For example, one model might be strong in reasoning, another in coding, another better at multilingual tasks.

But benchmarks usually don't resemble real product data.

For example, with a CRM, a benchmark can't answer questions like:

```text
- Does the model understand our deal stages?
- Does it know when it is not allowed to offer a discount?
- Does it maintain the brand tone?
- Does it ask for missing phone numbers/emails?
- Does it hallucinate customer information?
```

Therefore, benchmarks should be used to select the initial model. But production decisions must be based on the specific workflow's test cases.

## 2. Four common ways to evaluate LLMs

Sebastian Raschka divides common evaluation approaches into 4 groups: multiple-choice benchmarks, verifiers, leaderboards, and LLM judge.

I interpret them in a more pragmatic way:

### Multiple-choice benchmark

Easy to grade, easy to compare, but sometimes doesn't reflect the real task.

Suitable for asking:

> Does the model have a relatively good knowledge/reasoning foundation?

Not enough to ask:

> Does the model handle my CRM workflow correctly?

### Verifier

A verifier is a result checker. It can be code, a rule, a database check, or another model.

For example:

```text
If output contains a price but input data does not → fail.
If message promises delivery in 24h but policy doesn't have it → fail.
If the answer doesn't cite sources from the document → fail.
```

Verifiers are very suitable for workflows that need strict error control.

### Leaderboard

Leaderboards are useful for quick reference, but shouldn't be idolized.

A model ranking high on a leaderboard doesn't mean it fits Vietnamese, your domain, your latency requirements, or your budget.

### LLM-as-Judge

Using another LLM to grade output based on a rubric.

Example rubric:

```text
Score 1-5:
- Did it answer the question correctly?
- Did it use the provided data?
- Did it hallucinate?
- Did it maintain a professional tone?
- Did it give a clear next action?
```

An LLM judge is convenient, but not absolute. For critical tasks, it should be accompanied by human review or rule checkers.

## 3. Evaluation for AI workflows should start from real errors

I like to start with the question:

> If this system fails, how does it fail?

For an AI sales assistant, errors could be:

- hallucinating customer info,
- sending out-of-context follow-ups,
- misclassifying hot/cold leads,
- offering unauthorized discounts,
- failing to recognize an angry customer,
- replying too long, making it unusable.

From real errors, we write test cases.

## 4. Test case examples for a CRM AI assistant

A simple test case could look like this:

```json
{
  "name": "Does not hallucinate info when lead is missing phone number",
  "input": {
    "lead_name": "Anh Nam",
    "message": "I want a quote for a CRM package for a sales team of 5.",
    "phone": null,
    "email": null
  },
  "expected_behavior": [
    "Does not invent a phone number or email",
    "Thanks the customer",
    "Asks for the missing contact info",
    "Keeps the tone polite and concise"
  ]
}
```

Another test case:

```json
{
  "name": "Does not offer discount without authorization",
  "input": {
    "deal_stage": "Proposal Sent",
    "customer_message": "If you give a 50% discount I will sign right now.",
    "discount_policy": "Sales assistant cannot authorize discounts."
  },
  "expected_behavior": [
    "Does not confirm the discount",
    "Acknowledges the customer's request",
    "Proposes transferring to an authorized person",
    "Does not invent a new policy"
  ]
}
```

Such test cases are much more valuable than just asking the model a few generic questions.

## 5. A small evaluation pipeline

For a small project, the pipeline can be very simple:

```text
Dataset test cases
→ run prompt/new model version
→ grade with rule/verifier
→ grade with LLM judge if needed
→ log errors
→ compare with old version
→ only deploy if it doesn't break critical cases
```

No need to be complex from the start. What matters is having a baseline.

## 6. Which metrics to grade?

It depends on the workflow, but I'd start with easy-to-understand metrics:

| Metric | Meaning |
|---|---|
| Accuracy | Did it answer correctly? |
| Faithfulness | Did it stick to the provided data? |
| Hallucination rate | Did it invent facts? |
| Policy compliance | Did it follow the rules? |
| Tone quality | Is the tone appropriate? |
| Task completion | Did it complete the task? |
| Latency | Is it too slow? |
| Cost per task | How much does each task cost? |

For a real AI product, technical metrics must connect to workflow metrics. For example: reducing follow-up time, reducing quoting errors, increasing response rate, reducing the number of times employees have to edit the output.

## 7. When is human review needed?

Human review should be present when:

- output affects money,
- involves children or vulnerable people,
- carries legal risk,
- involves critical data changes,
- model is uncertain,
- customer is angry or complaining.

With Snow AI Companion, human review and parental control are even more crucial. An AI companion for children cannot be evaluated just by "did it answer well". It must be evaluated on safety, boundaries, tone, memory, and the ability to refuse.

## 8. How would I start small?

If building a new AI workflow, I would make the first version like this:

```text
- 20 real test cases
- 5 easy test cases
- 10 medium test cases
- 5 hard or dangerous test cases
- 1 versioned prompt file
- 1 script to run eval
- 1 pass/fail record board
- 1 list of errors to fix
```

Then every time I edit the prompt, change the model, add RAG, or change the workflow, I re-run the eval.

This is simple but helps avoid the "demo works today, changing the model next week breaks it" situation.

## Conclusion

LLM evaluation doesn't need to start with an overly complex platform.

It starts with a very simple truth:

> I must know where my AI is wrong, how it is wrong, and whether the error is dangerous.

Benchmarks help select models. Verifiers help catch clear errors. LLM judges help grade softer criteria. Human reviews help control critical decisions.

A good AI workflow isn't one that never makes mistakes. It's one that knows how to **detect errors, limit risks, and improve with verification**.

## References

- Sebastian Raschka, **Understanding the 4 Main Approaches to LLM Evaluation**: https://magazine.sebastianraschka.com/p/llm-evaluation-4-approaches
- OpenAI, **Working with evals**: https://developers.openai.com/api/docs/guides/evals
- OpenAI, **Evaluation best practices**: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- OpenAI, **Evaluate agent workflows**: https://developers.openai.com/api/docs/guides/agent-evals
- LangSmith, **Evaluation documentation**: https://docs.langchain.com/langsmith/evaluation
- DeepEval, **LLM Evaluation Framework**: https://github.com/confident-ai/deepeval
- EleutherAI, **Language Model Evaluation Harness**: https://github.com/EleutherAI/lm-evaluation-harness

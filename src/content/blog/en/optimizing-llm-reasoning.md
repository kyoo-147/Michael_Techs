---
title: Optimizing LLM reasoning is not just about training bigger models
description: >-
  How inference-time scaling, self-consistency, verifiers, and reasoning budgets
  improve LLM quality, and when not to use them due to high costs.
pubDatetime: '2024-10-08T00:00:00.000Z'
locale: en
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

There is a very common thought when a model gives a wrong answer:

> "We probably need a bigger model."

Sometimes that's true. But not always.

Many recent studies show we can improve LLM reasoning by increasing compute at inference time: letting the model generate multiple solutions, self-check, using a verifier, breaking down the problem, or calling tools/RAG at the right time.

Put simply: instead of always training larger models, sometimes we can **design a better way for the model to think when running in production**.

## 1. What is inference-time scaling?

Inference-time scaling is using additional resources when the model is answering to increase output quality.

For example:

- calling the model multiple times and picking the most consistent answer,
- letting the model solve step-by-step,
- using another model to check,
- using a verifier to grade the result,
- using retrieval to get correct info before answering,
- increasing the reasoning budget for hard questions.

It's like humans. Some questions can be answered quickly. Some require scratch paper, double-checking, or looking up data.

## 2. Self-consistency: don't take the first answer too quickly

A classic technique is **self-consistency**. Instead of letting the model generate a single reasoning path, we let it generate multiple different paths, then pick the answer that appears most consistently.

For a simple math problem:

```text
Question:
A customer has 3 processing orders. Then 2 new orders are added.
How many orders need to be tracked in total?
```

If the model answers once, it might be right or wrong. But if it generates multiple solutions, we can take the answer reached by many independent reasoning paths.

This idea was proposed in the paper **Self-Consistency Improves Chain of Thought Reasoning in Language Models**, and results showed self-consistency improved many reasoning benchmarks like GSM8K, SVAMP, AQuA, StrategyQA, and ARC-challenge.

But the trade-off is higher cost, because we call the model more times.

## 3. Verifier: don't just generate the answer, check it

Another direction is using a verifier.

Simple pipeline:

```text
User question
→ model generates answer
→ verifier checks answer
→ if it fails, model fixes it or replies "not enough data"
```

A verifier can be:

- a rule-based checker,
- another model,
- a data validation function,
- an evaluator using a rubric,
- human review for high-risk tasks.

For example, with a CRM:

```text
Task:
Draft a follow-up message for the customer.

Verifier checks:
- Did it hallucinate the price?
- Did it mention the customer's name correctly?
- Did it use the right deal stage?
- Did it make promises outside the policy?
- Did it maintain a polite tone?
```

This is a point I find very important: in real products, good reasoning is not just solving math correctly. Good reasoning is also **not being overly confident when lacking data**.

## 4. Reasoning budget: only hard tasks need to think long

Not every request needs inference-time scaling.

If the user asks:

> "Summarize this lead in 3 lines."

One model call might be enough.

But if the user asks:

> "Should this lead be prioritized? Based on interaction history, deal value, last follow-up, and closing probability."

This is a multi-step task. It might require:

- fetching data from the CRM,
- summarizing history,
- evaluating buying signals,
- comparing against rules,
- creating a recommendation,
- briefly explaining the reason.

So the reasoning budget should depend on the difficulty and risk of the task.

## 5. A design example for an AI workflow

Suppose I build an AI assistant for a sales team.

I can divide tasks into 3 levels:

| Level | Example | Handling Method |
|---|---|---|
| Low-risk | Summarize lead, draft email | 1 model call |
| Medium-risk | Lead scoring, next action | RAG + model + verifier |
| High-risk | Discount, quote, change deal stage | Human approval required |

This is more practical than turning on heavy reasoning for everything.

## 6. When is inference-time scaling not worth it?

It's not a magic pill.

You shouldn't use it if:

- the task is simple,
- the user needs very fast realtime responses,
- token cost is too high,
- there is no way to verify the output,
- the input data is already wrong,
- the model lacks domain knowledge and it's not supplemented by retrieval/tools,
- increasing model calls doesn't improve real metrics.

Some studies also indicate that the benefits of inference-time scaling depend on the task type. Some tasks improve clearly, while others increase compute but accuracy doesn't increase proportionally.

## 7. Implementation Checklist

When wanting to improve reasoning for an LLM workflow, I ask:

```text
1. Does this task really need multi-step reasoning?
2. If wrong, what are the consequences?
3. Is there correct data for the model to rely on?
4. Is there a verifier or rule to check the output?
5. Is increased latency acceptable?
6. Can quality before/after be measured?
7. Is there a fallback when the model is unsure?
```

If these questions can be answered, then it's time to add self-consistency, verifiers, multi-step reasoning, or tool use.

## Conclusion

Optimizing reasoning isn't just about picking a larger model.

Sometimes what makes a system better is:

- knowing which task needs deep thinking,
- knowing when to retrieve,
- knowing when to verify,
- knowing when human approval is needed,
- and knowing when to answer "not enough data".

To me, this is the interesting part of AI Engineering: not just using models, but designing how models participate in a real workflow.

## References

- Sebastian Raschka, **Categories of Inference-Time Scaling for Improved LLM Reasoning**: https://magazine.sebastianraschka.com/p/categories-of-inference-time-scaling
- Sebastian Raschka, **The State of LLM Reasoning Model Inference**: https://magazine.sebastianraschka.com/p/state-of-llm-reasoning-and-inference-scaling
- Wang et al., **Self-Consistency Improves Chain of Thought Reasoning in Language Models**: https://arxiv.org/abs/2203.11171
- Parashar et al., **Inference-Time Computations for LLM Reasoning and Planning: A Benchmark and Insights**: https://arxiv.org/abs/2502.12521
- Balachandran et al., **Inference-Time Scaling for Complex Tasks: Where We Stand and What Lies Ahead**: https://arxiv.org/abs/2504.00294

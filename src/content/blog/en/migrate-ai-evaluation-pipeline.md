---
title: >-
  How to Migrate a Test/Evaluation Pipeline for AI Workflows Without Breaking
  Production
description: >-
  Practical notes on how to change prompts, models, or evaluation pipelines for
  AI workflows while keeping the system stable.
pubDatetime: '2023-11-16T00:00:00.000Z'
locale: en
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

## Introduction

An AI workflow looks simple on the outside: a user sends a request, the backend calls an LLM, and the system replies. But when put into production, everything is much more complex.

Just changing the prompt, model, retrieval logic, or output format can change the result. Sometimes that change is better. Sometimes it silently breaks old cases.

The problem this article addresses is: **how to migrate a test/evaluation pipeline for an AI workflow without breaking production?**

I took ideas from OpenAI Evals, LangSmith Evaluation, and traditional CI/CD ways of testing code before merging. But this article is written in a pragmatic way: a small project can still do it.

## 1. The problem

AI workflows differ from traditional software in one annoying way: the output is not always deterministic.

A normal API:

```text
input A → output B
```

If tests pass today, they usually pass tomorrow, unless the code changes.

But with LLM workflows:

```text
input A → output B1 / B2 / B3
```

Outputs can vary because:

- model version changes
- prompt changes
- context retrieval changes
- database data changes
- temperature/config changes
- tool calling changes
- evaluator assessment is unclear

Without an evaluation pipeline, it's easy to deploy based on feeling: "I tested it and it looks fine." That approach is not safe enough.

## 2. Minimum pipeline

A small AI workflow should have this pipeline:

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

Where:

- **Test cases**: a set of representative questions or scenarios.
- **Workflow version**: the prompt/model/retrieval logic being tested.
- **Evaluator**: evaluation rules using code, human review, or LLM-as-judge.
- **Baseline**: the current stable running version.
- **Decision gate**: rules on whether to deploy.

## 3. Don't start with complex evaluators

A common mistake is starting with LLM-as-judge for everything. It's useful, but shouldn't be the first layer.

I divide evaluators into 4 tiers:

### Tier 1: Format checks

Check if the output matches the schema.

```ts
type LeadQualificationResult = {
  score: number;
  reason: string;
  nextAction: string;
};
```

If the workflow needs to return JSON, the first test is whether JSON is parseable, if fields are sufficient, and if types are correct.

### Tier 2: Rule-based checks

Check things that are definitively right/wrong.

For example:

- score must be from 0 to 100
- must not answer in a language other than requested
- must not suggest actions if email/phone is missing
- must not invent customer info not in the data

### Tier 3: Golden test cases

A set of sample cases written yourself or taken from checked production traces.

Example:

```json
{
  "input": "Customer asking for CRM price for 5 users",
  "expected_behavior": "Classified as sales-qualified lead and suggest sending a quote"
}
```

The expected output doesn't have to match word-for-word. But expected behavior must be correct.

### Tier 4: LLM-as-judge / human review

Used for softer criteria:

- is the answer helpful?
- is the tone correct?
- does it follow instructions?
- is there hallucination?
- does it explain clearly?

## 4. Migration strategy

When changing the pipeline, don't change everything at once.

I use 4 steps:

### Step 1: Freeze baseline

Before fixing, save the running version:

```text
prompt_v1
model_config_v1
retrieval_config_v1
eval_dataset_v1
```

A baseline helps you know if the new version is actually better or just "seems better".

### Step 2: Run in parallel

The new version doesn't replace production immediately. It runs in parallel on the same test cases.

```text
production workflow → baseline score
new workflow        → candidate score
```

### Step 3: Compare by metric

For example, simple metrics:

```text
schema_pass_rate >= 99%
golden_case_pass_rate >= 90%
hallucination_flag_rate does not increase
latency does not increase by more than 20%
cost does not increase by more than 30%
```

You don't need perfect metrics initially. But you must have a clear gate.

### Step 4: Canary release

If it passes offline eval, route a small portion of traffic to the new version.

```text
95% traffic → old workflow
5% traffic  → new workflow
```

Monitor logs, feedback, error rate, latency, and cost. Increase gradually if stable.

## 5. Example: migrating a prompt for an AI lead workflow

Assume OneClick CRM has a workflow:

```text
Website lead → enrich data → classify lead → suggest next action → update CRM
```

The old prompt classified leads somewhat generically. The new prompt aims for clearer classification:

```text
Cold lead / Warm lead / Sales-qualified lead / Support request
```

I would create test cases:

```json
[
  {
    "input": "I want a CRM quote for a 10-person team, does it integrate with Zalo?",
    "expected": "Sales-qualified lead"
  },
  {
    "input": "How do I reset my password?",
    "expected": "Support request"
  },
  {
    "input": "I'm just browsing",
    "expected": "Cold lead"
  }
]
```

The first evaluator doesn't need to be smart:

```ts
function evaluateClassification(actual: string, expected: string) {
  return actual === expected ? "pass" : "fail";
}
```

Then add an LLM judge to evaluate the `reason` and `nextAction`.

## 6. What should CI/CD check?

In GitHub Actions, I separate into jobs:

```text
lint
unit_tests
schema_tests
ai_eval_tests
cost_guard
build
```

Example simple workflow:

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

The key point is eval runs on a pull request, not after deploying to production.

## 7. Things NOT to do

- Do not deploy a new prompt just because manually testing 3 sentences looks fine.
- Do not use LLM-as-judge as the only standard.
- Do not change model, prompt, retrieval, and schema all at once.
- Do not evaluate merely by "the answer sounds good".
- Do not ignore latency and cost.
- Do not forget to save dataset versions.

## 8. Conclusion

An evaluation pipeline for AI workflows doesn't need to start too big. For small projects, you just need:

```text
10–50 golden test cases
schema checks
rule-based checks
baseline comparison
CI gate
manual review for critical cases
```

My main lessons:

- AI workflows need regression testing just like traditional software.
- LLM outputs are non-deterministic, so they must be evaluated by behavior.
- Safe migration means running in parallel, comparing to baseline, then canary release.
- Evaluation must tie into product goals, not just benchmark scores.

Without eval, an AI workflow is just a demo. With eval, it starts looking like a production system.

## References

- OpenAI Evals: https://github.com/openai/evals
- OpenAI Cookbook — Getting Started with OpenAI Evals: https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals
- LangSmith Evaluation: https://docs.langchain.com/langsmith/evaluation
- LangSmith Evaluation Concepts: https://docs.langchain.com/langsmith/evaluation-concepts
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

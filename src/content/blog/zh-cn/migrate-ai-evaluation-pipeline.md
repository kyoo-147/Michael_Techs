---
title: 如何在不破坏生产环境的情况下迁移 AI 工作流的测试/评估管道
description: 关于如何为 AI 工作流更改提示词 (prompt)、模型或评估管道并保持系统稳定的实用笔记。
pubDatetime: '2023-11-16T00:00:00.000Z'
locale: zh-cn
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

## 引言

从表面上看，AI 工作流似乎很简单：用户发送请求，后端调用 LLM，系统进行回复。但一旦投入生产环境，一切都会复杂得多。

只需更改提示词 (prompt)、模型、检索逻辑 (retrieval logic) 或输出格式，结果就可能发生变化。有时这种改变更好，但有时它会悄无声息地破坏旧有的用例。

本文要解决的问题是：**如何在不破坏生产环境的情况下迁移 AI 工作流的测试/评估管道？**

我借鉴了 OpenAI Evals、LangSmith Evaluation 以及 CI/CD 传统的在合并前测试代码的方法。但本文的写作方式偏向实用：即使是一个小项目也能做到。

## 1. 问题所在

AI 工作流与传统软件的一个烦人区别在于：输出并不总是确定性的 (deterministic)。

普通的 API：

```text
输入 A → 输出 B
```

如果今天的测试通过了，明天通常也会通过，除非代码发生了变化。

但对于 LLM 工作流：

```text
输入 A → 输出 B1 / B2 / B3
```

输出可能会有所不同，因为：

- 模型版本改变
- 提示词 (prompt) 改变
- 上下文检索 (context retrieval) 改变
- 数据库中的数据改变
- 温度 (temperature) 或配置改变
- 工具调用 (tool calling) 改变
- 评估器 (evaluator) 的评估标准不明确

如果没有评估管道，我们很容易凭直觉进行部署：“我测试了一下，看起来没问题。” 这种做法是不够安全的。

## 2. 最低限度应具备的管道

一个小型 AI 工作流应该具备以下管道：

```text
测试用例 (Test Cases)
   ↓
运行工作流版本
   ↓
评估输出 (Evaluate Output)
   ↓
与基准比较 (Compare with Baseline)
   ↓
决定：通过 (Pass) / 警告 (Warn) / 拦截 (Block)
```

其中：

- **测试用例 (Test cases)**：一组具有代表性的问题或场景。
- **工作流版本 (Workflow version)**：正在测试的提示词/模型/检索逻辑。
- **评估器 (Evaluator)**：使用代码、人工审查或 LLM 作为裁判 (LLM-as-judge) 的评估规则。
- **基准 (Baseline)**：当前稳定运行的版本。
- **决策门控 (Decision gate)**：关于是否允许部署的规则。

## 3. 不要一开始就使用复杂的评估器

一个常见的错误是凡事都从“LLM 作为裁判”开始。它很有用，但不应该是第一层。

我会将评估器分为 4 个层级：

### 第 1 层：格式检查

检查输出是否符合 schema。

```ts
type LeadQualificationResult = {
  score: number;
  reason: string;
  nextAction: string;
};
```

如果工作流需要返回 JSON，第一个测试就是 JSON 是否可以被解析，字段是否足够，类型是否正确。

### 第 2 层：基于规则的检查

检查绝对正确/错误的事情。

例如：

- 分数必须在 0 到 100 之间
- 不得使用非要求的语言进行回答
- 如果缺少电子邮件/电话号码，不得建议采取行动
- 不得凭空捏造数据中不存在的客户信息

### 第 3 层：黄金测试用例 (Golden test cases)

自己编写或从经过检查的生产追踪 (production traces) 中提取的一组样本用例。

示例：

```json
{
  "input": "Customer asking for CRM price for 5 users",
  "expected_behavior": "Classified as sales-qualified lead and suggest sending a quote"
}
```

预期的输出不一定要一字不差，但预期的行为 (expected behavior) 必须是正确的。

### 第 4 层：LLM 作为裁判 / 人工审查

用于更主观的标准：

- 回答是否有帮助？
- 语气正确吗？
- 是否遵循了指示？
- 是否存在幻觉 (hallucination)？
- 解释是否清晰？

## 4. 迁移策略

更改管道时，不要一次性更改所有内容。

我使用 4 个步骤：

### 步骤 1：冻结基准 (Freeze baseline)

在进行修复之前，保存正在运行的版本：

```text
prompt_v1
model_config_v1
retrieval_config_v1
eval_dataset_v1
```

基准可以帮助你了解新版本是真的变得更好，还是仅仅“看起来更好”。

### 步骤 2：并行运行

新版本不会立即取代生产环境。它在同一组测试用例上并行运行。

```text
production workflow → baseline score
new workflow        → candidate score
```

### 步骤 3：按指标进行比较

例如，简单的指标：

```text
schema 通过率 >= 99%
黄金用例通过率 >= 90%
幻觉标记率没有增加
延迟增加不超过 20%
成本增加不超过 30%
```

一开始不需要完美的指标。但你必须有一个明确的门控。

### 步骤 4：金丝雀发布 (Canary release)

如果通过了离线评估，则将一小部分流量路由到新版本。

```text
95% traffic → old workflow
5% traffic  → new workflow
```

监控日志、反馈、错误率、延迟和成本。如果稳定，再逐渐增加比例。

## 5. 示例：迁移 AI 线索工作流的 prompt

假设 OneClick CRM 有一个工作流：

```text
网站线索 → 丰富数据 → 分类线索 → 建议下一步行动 → 更新 CRM
```

旧的 prompt 对线索的分类比较宽泛。新的 prompt 旨在进行更清晰的分类：

```text
Cold lead / Warm lead / Sales-qualified lead / Support request
```

我会创建测试用例：

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

第一个评估器不需要太聪明：

```ts
function evaluateClassification(actual: string, expected: string) {
  return actual === expected ? "pass" : "fail";
}
```

然后再添加一个 LLM 裁判来评估 `reason` 和 `nextAction`。

## 6. CI/CD 应该检查什么？

在 GitHub Actions 中，我会将其拆分为不同的作业 (jobs)：

```text
lint
unit_tests
schema_tests
ai_eval_tests
cost_guard
build
```

示例简单的工作流：

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

重点是 eval 在 pull request 时运行，而不是在部署到生产环境之后运行。

## 7. 不应该做的事情

- 不要仅仅因为手动测试了 3 个句子感觉不错就部署新的 prompt。
- 不要将“LLM 作为裁判”作为唯一的标准。
- 不要同时更改模型、prompt、检索和 schema。
- 不要仅仅凭“回答听起来不错”来进行评估。
- 不要忽略延迟和成本。
- 不要忘记保存数据集版本。

## 8. 结论

AI 工作流的评估管道不需要一开始就做得太大。对于小型项目，你只需要：

```text
10–50 个黄金测试用例
schema 检查
基于规则的检查
基准比较
CI 门控
对关键案例的人工审查
```

我的主要经验教训：

- AI 工作流需要像传统软件一样进行回归测试 (regression testing)。
- LLM 输出是不确定性的，因此必须根据行为进行评估。
- 安全的迁移意味着并行运行，与基准进行比较，然后进行金丝雀发布。
- 评估必须与产品目标挂钩，而不仅仅是基准分数。

如果没有 eval，AI 工作流只是一个 Demo。有了 eval，它才开始像一个生产系统。

## 参考资源

- OpenAI Evals: https://github.com/openai/evals
- OpenAI Cookbook — Getting Started with OpenAI Evals: https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals
- LangSmith Evaluation: https://docs.langchain.com/langsmith/evaluation
- LangSmith Evaluation Concepts: https://docs.langchain.com/langsmith/evaluation-concepts
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions

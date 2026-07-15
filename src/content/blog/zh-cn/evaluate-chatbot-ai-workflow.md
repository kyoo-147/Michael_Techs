---
title: 评估 chatbot/AI 工作流：基准测试、验证器、LLM 裁判和实际测试用例
description: 关于 LLM 评估的实用笔记：基准测试只是一个起点，而真实产品需要测试用例、验证器、人工审查以及与工作流相关的指标。
pubDatetime: '2023-10-05T00:00:00.000Z'
locale: zh-cn
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

一个回答得很流畅的 chatbot 并不意味着它就是好的。

它可能会：

- 回答错误但非常自信，
- 凭空捏造 (hallucinate) 信息，
- 不遵守规则，
- 忘记重要的上下文，
- 在 Demo 中表现很好但在真实用例中失败，
- 在基准测试 (benchmarks) 中得分很高，但并没有帮助业务工作流运行得更好。

因此，如果你在认真构建 AI 工作流，评估 (evaluation) 不是一个“以后再做”的环节。它应该及早考虑。

## 1. 基准测试 (Benchmarks) 是起点，而不是最终答案

基准测试帮助我们初步了解模型的能力。例如，一个模型可能在推理 (reasoning) 方面很强，另一个在编码方面很强，还有一个在多语言任务上表现更好。

但是基准测试通常与实际产品数据不同。

例如，对于 CRM，基准测试无法回答以下问题：

```text
- 模型理解我们的交易阶段 (deal stages) 吗？
- 它知道什么时候不允许提供折扣吗？
- 它保持了品牌基调 (brand tone) 吗？
- 当缺少电话号码/电子邮件时，它会询问吗？
- 它会捏造客户信息吗？
```

因此，基准测试应该用于选择初始模型。但生产环境的决定必须基于特定工作流的测试用例。

## 2. 评估 LLM 的 4 种常见方法

Sebastian Raschka 将常见的评估方法分为 4 组：多项选择基准测试 (multiple-choice benchmarks)、验证器 (verifiers)、排行榜 (leaderboards) 和 LLM 裁判 (LLM-as-judge)。

我以更务实的方式解释它们：

### 多项选择基准测试 (Multiple-choice benchmark)

易于评分，易于比较，但有时不能反映真实任务。

适合问：

> 模型是否有相对较好的知识/推理基础？

不适合问：

> 模型能正确处理我的 CRM 工作流吗？

### 验证器 (Verifier)

验证器是一个结果检查器。它可以是代码、规则、数据库检查或另一个模型。

例如：

```text
如果输出包含价格，但输入数据没有 → 失败 (fail)。
如果消息承诺 24 小时内发货，但政策中没有 → 失败。
如果答案没有引用文档中的来源 → 失败。
```

验证器非常适合需要严格控制错误的工作流。

### 排行榜 (Leaderboard)

排行榜对于快速参考很有用，但不应被神化。

在排行榜上排名靠前的模型，并不意味着它适合越南语、你的垂直领域、你的延迟要求或你的预算。

### LLM 裁判 (LLM-as-Judge)

使用另一个 LLM 根据评分标准 (rubric) 对输出进行评分。

例如评分标准：

```text
打分 1-5：
- 是否正确回答了问题？
- 是否使用了提供的数据？
- 是否捏造了事实？
- 是否保持了专业的语气？
- 是否给出了明确的下一步行动 (next action)？
```

LLM 裁判很方便，但不是绝对的。对于关键任务，它应与人工审查或规则检查器结合使用。

## 3. AI 工作流的评估应从真实错误开始

我喜欢从这个问题开始：

> 如果这个系统出错了，它会出什么错？

对于 AI 销售助手，错误可能是：

- 捏造客户信息，
- 发送脱离上下文的跟进邮件，
- 错误分类冷/热线索 (leads)，
- 提供未经授权的折扣，
- 未能识别出客户正在生气，
- 回复太长，无法使用。

从真实的错误中，我们编写测试用例。

## 4. CRM AI 助手的测试用例示例

一个简单的测试用例可能长这样：

```json
{
  "name": "当线索缺少电话号码时不会捏造信息",
  "input": {
    "lead_name": "Anh Nam",
    "message": "我想获得 5 人销售团队 CRM 套餐的报价。",
    "phone": null,
    "email": null
  },
  "expected_behavior": [
    "不会捏造电话号码或电子邮件",
    "感谢客户",
    "询问缺失的联系信息",
    "保持礼貌和简洁的语气"
  ]
}
```

另一个测试用例：

```json
{
  "name": "未经授权不会提供折扣",
  "input": {
    "deal_stage": "Proposal Sent",
    "customer_message": "如果你们给 50% 的折扣，我现在就签约。",
    "discount_policy": "销售助手不能授权折扣。"
  },
  "expected_behavior": [
    "不确认折扣",
    "确认客户的请求",
    "建议转交给授权人员",
    "不捏造新政策"
  ]
}
```

这样的测试用例比仅仅问模型几个泛泛的问题有价值得多。

## 5. 一个小型的评估管道

对于小型项目，管道可以非常简单：

```text
数据集测试用例
→ 运行 prompt/新模型版本
→ 使用规则/验证器进行评分
→ 如果需要，使用 LLM 裁判进行评分
→ 记录错误
→ 与旧版本比较
→ 仅当它不破坏关键用例时才部署
```

一开始不需要很复杂。重要的是要有基准 (baseline)。

## 6. 应该评估哪些指标？

这取决于工作流，但我会从易于理解的指标开始：

| 指标 | 含义 |
|---|---|
| 准确性 (Accuracy) | 回答正确吗？ |
| 忠实度 (Faithfulness) | 是否遵循提供的数据？ |
| 幻觉率 (Hallucination rate) | 是否捏造了事实？ |
| 策略合规性 (Policy compliance) | 是否遵守规则？ |
| 语气质量 (Tone quality) | 语气合适吗？ |
| 任务完成度 (Task completion) | 是否完成了任务？ |
| 延迟 (Latency) | 速度太慢吗？ |
| 单任务成本 (Cost per task) | 每项任务花费多少？ |

对于真实的 AI 产品，技术指标必须与工作流指标联系起来。例如：减少跟进时间、减少报价错误、提高回复率、减少员工必须修改输出的次数。

## 7. 何时需要人工审查？

在以下情况下应有人工审查：

- 输出影响资金，
- 涉及儿童或弱势群体，
- 存在法律风险，
- 涉及关键的数据变更，
- 模型不确定，
- 客户正在生气或抱怨。

对于 Snow AI Companion，人工审查和家长控制甚至更为重要。儿童的 AI 伴侣不能仅仅用“回答得好不好”来评估。必须对其安全性、边界、语气、记忆和拒绝不当请求的能力进行评估。

## 8. 我将如何从小处着手？

如果构建一个新的 AI 工作流，我的第一个版本会是这样的：

```text
- 20 个真实的测试用例
- 5 个简单的测试用例
- 10 个中等难度的测试用例
- 5 个困难或危险的测试用例
- 1 个受版本控制的 prompt 文件
- 1 个运行评估的脚本
- 1 个通过/失败记录板
- 1 个需要修复的错误列表
```

然后，每次我编辑 prompt、更改模型、添加 RAG 或更改工作流时，我都会重新运行评估。

这很简单，但有助于避免“今天 Demo 能跑，下周换个模型就崩了”的情况。

## 结论

LLM 评估不需要从一个过于复杂的平台开始。

它始于一个非常简单的事实：

> 我必须知道我的 AI 错在哪里、怎么错的，以及错误是否危险。

基准测试帮助选择模型。验证器帮助捕获明显的错误。LLM 裁判帮助对主观标准进行评分。人工审查帮助控制关键决策。

一个优秀的 AI 工作流不是一个从不犯错的工作流。它是一个知道如何**发现错误、限制风险并通过验证不断改进**的工作流。

## 参考资料

- Sebastian Raschka, **Understanding the 4 Main Approaches to LLM Evaluation**: https://magazine.sebastianraschka.com/p/llm-evaluation-4-approaches
- OpenAI, **Working with evals**: https://developers.openai.com/api/docs/guides/evals
- OpenAI, **Evaluation best practices**: https://developers.openai.com/api/docs/guides/evaluation-best-practices
- OpenAI, **Evaluate agent workflows**: https://developers.openai.com/api/docs/guides/agent-evals
- LangSmith, **Evaluation documentation**: https://docs.langchain.com/langsmith/evaluation
- DeepEval, **LLM Evaluation Framework**: https://github.com/confident-ai/deepeval
- EleutherAI, **Language Model Evaluation Harness**: https://github.com/EleutherAI/lm-evaluation-harness

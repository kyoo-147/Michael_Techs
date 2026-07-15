---
title: 优化 LLM 推理 (reasoning) 不仅仅是训练更大的模型
description: >-
  推理时扩展 (Inference-time scaling)、自洽性 (self-consistency)、验证器 (verifier) 和推理预算
  (reasoning budget) 如何提高 LLM 质量，以及何时因成本过高而不应使用它们。
pubDatetime: '2024-10-08T00:00:00.000Z'
locale: zh-cn
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

当模型给出错误答案时，有一种非常常见的想法：

> “我们可能需要一个更大的模型。”

有时这是对的。但不总是这样。

最近的许多研究表明，我们可以通过在推理时 (inference time) 增加计算量来提高 LLM 的推理能力：让模型生成多个解决方案、自我检查、使用验证器、分解问题，或者在合适的时候调用工具/RAG。

简而言之：与其总是训练更大的模型，有时我们可以**设计一种更好的方式，让模型在生产环境中运行时更好地思考**。

## 1. 什么是推理时扩展 (Inference-time scaling)？

推理时扩展是指在模型回答时使用额外的资源来提高输出质量。

例如：

- 多次调用模型并选择最一致的答案，
- 让模型分步解决，
- 使用另一个模型进行检查，
- 使用验证器对结果进行评分，
- 在回答之前使用检索 (retrieval) 获取正确的信息，
- 为困难的问题增加推理预算 (reasoning budget)。

这就像人类一样。有些问题可以快速回答。有些则需要草稿纸、仔细检查或查找数据。

## 2. 自洽性 (Self-consistency)：不要太快接受第一个答案

一个经典的技术是**自洽性**。我们不让模型生成单一的推理路径，而是让它生成多个不同的路径，然后选择最一致出现的答案。

对于一个简单的数学问题：

```text
问题：
客户有 3 个正在处理的订单。然后又增加了 2 个新订单。
总共有多少个订单需要跟踪？
```

如果模型回答一次，它可能对也可能错。但如果它生成多个解决方案，我们可以采用由许多独立推理路径得出的答案。

这个想法在论文 **Self-Consistency Improves Chain of Thought Reasoning in Language Models** 中被提出，结果表明自洽性改善了许多推理基准测试 (benchmarks)，如 GSM8K、SVAMP、AQuA、StrategyQA 和 ARC-challenge。

但代价是更高的成本，因为我们调用了更多次模型。

## 3. 验证器 (Verifier)：不要只生成答案，还要检查它

另一个方向是使用验证器。

简单的管道 (pipeline)：

```text
用户问题
→ 模型生成答案
→ 验证器检查答案
→ 如果失败，模型修复它或回复“数据不足”
```

验证器可以是：

- 基于规则的检查器 (rule-based checker)，
- 另一个模型，
- 数据验证函数，
- 使用评分标准的评估器，
- 高风险任务的人工审查。

例如，对于 CRM：

```text
任务：
为客户起草跟进消息。

验证器检查：
- 是否捏造了价格？
- 是否正确提到了客户的名字？
- 是否使用了正确的交易阶段 (deal stage)？
- 是否做出了政策之外的承诺？
- 是否保持了礼貌的语气？
```

我发现这一点非常重要：在实际产品中，良好的推理不仅仅是正确解题。良好的推理还在于**在缺乏数据时不要过度自信**。

## 4. 推理预算 (Reasoning budget)：只有困难的任务才需要长时间思考

并非每个请求都需要推理时扩展。

如果用户问：

> “用 3 行字总结这个线索 (lead)。”

调用一次模型可能就足够了。

但如果用户问：

> “这个线索应该优先处理吗？根据互动历史、交易价值、最后一次跟进和成单概率来判断。”

这是一个多步任务。它可能需要：

- 从 CRM 获取数据，
- 总结历史，
- 评估购买信号，
- 与规则进行比较，
- 创建建议，
- 简要解释原因。

因此，推理预算应该取决于任务的难度和风险。

## 5. AI 工作流的一个设计示例

假设我为销售团队构建一个 AI 助手。

我可以将任务分为 3 个级别：

| 级别 | 示例 | 处理方法 |
|---|---|---|
| 低风险 | 总结线索，起草电子邮件 | 1 次模型调用 |
| 中风险 | 线索评分，下一步行动 | RAG + 模型 + 验证器 |
| 高风险 | 折扣，报价，更改交易阶段 | 需要人工批准 |

这比为所有事情都开启繁重的推理更实用。

## 6. 什么时候推理时扩展不值得？

它不是灵丹妙药。

在以下情况下你不应该使用它：

- 任务很简单，
- 用户需要非常快的实时响应，
- token 成本太高，
- 没有办法验证输出，
- 输入数据已经是错误的，
- 模型缺乏领域知识，并且没有通过检索/工具补充，
- 增加模型调用并没有改善实际指标。

一些研究还表明，推理时扩展的好处取决于任务类型。有些任务明显改善，而有些任务增加了计算量但准确率没有成比例增加。

## 7. 实施清单

当想要改进 LLM 工作流的推理时，我会问：

```text
1. 这个任务真的需要多步推理吗？
2. 如果错了，后果是什么？
3. 模型有正确的数据可以依赖吗？
4. 有验证器或规则来检查输出吗？
5. 延迟增加可以接受吗？
6. 能否测量之前/之后的质量？
7. 当模型不确定时有后备方案 (fallback) 吗？
```

如果这些问题可以回答，那么就可以考虑添加自洽性、验证器、多步推理或工具使用了。

## 结论

优化推理不仅仅是选择一个更大的模型。

有时让系统变得更好的是：

- 知道哪些任务需要深入思考，
- 知道何时检索，
- 知道何时验证，
- 知道何时需要人工批准，
- 并且知道何时回答“数据不足”。

对我来说，这正是 AI Engineering 有趣的部分：不仅仅是使用模型，而是设计模型如何参与到真实的工作流中。

## 参考资料

- Sebastian Raschka, **Categories of Inference-Time Scaling for Improved LLM Reasoning**: https://magazine.sebastianraschka.com/p/categories-of-inference-time-scaling
- Sebastian Raschka, **The State of LLM Reasoning Model Inference**: https://magazine.sebastianraschka.com/p/state-of-llm-reasoning-and-inference-scaling
- Wang et al., **Self-Consistency Improves Chain of Thought Reasoning in Language Models**: https://arxiv.org/abs/2203.11171
- Parashar et al., **Inference-Time Computations for LLM Reasoning and Planning: A Benchmark and Insights**: https://arxiv.org/abs/2502.12521
- Balachandran et al., **Inference-Time Scaling for Complex Tasks: Where We Stand and What Lies Ahead**: https://arxiv.org/abs/2504.00294

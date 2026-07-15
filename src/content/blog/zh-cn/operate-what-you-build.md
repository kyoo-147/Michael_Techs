---
title: 运营你所构建的 (Operate what you build)：小型 AI 产品的教训
description: >-
  分析生产工程 (production engineering) 中的所有权 (ownership) 思维，以及如何将其应用于 AI
  工作流、CRM、仪表板和小型产品。
pubDatetime: '2024-03-14T00:00:00.000Z'
locale: zh-cn
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

“完成一个功能 (finishing a feature)”和“对该功能在现实生活中的运行负责”之间有着非常不同的感觉。

功能在你的机器上运行是一回事。功能使用真实数据、真实用户、真实错误、真实成本和真实延迟运行则是另一回事。

我喜欢 **operate what you build (运营你所构建的)** 这句话，因为它将工程师从“代码写完就完事”的思维中拉了出来。对于 AI 产品，这一点更为重要，因为错误不仅仅是服务器返回 500。错误可能是 AI 回答不正确，工作流发送了错误的跟进，仪表板变慢，或者发生了无人知晓的模型漂移 (model drift)。

## 参考资料

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)
- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. 仅仅构建功能是不够的

一个 AI 线索管理 (lead management) 流程在演示 (demo) 中可能看起来很棒：

```txt
网站表单
  → CRM 线索
  → AI 分类
  → 创建跟进消息
  → 更新仪表板
```

但生产环境会提出更难的问题：

- 如果 LLM API 超时怎么办？
- 如果线索是重复的怎么办？
- 如果跟进消息的语气错误，谁来审核？
- 如果队列积压增加，仪表板会警告任何人吗？
- 如果 LLM 成本异常飙升，谁会知道？
- 如果更改提示词 (prompt) 后模型给出不同的答案，在哪里进行测试？

这就是演示和产品之间的差距。

## 2. 所有权 (Ownership) 意味着知道系统哪里痛

运营你所构建的，并不意味着一个人必须做所有事情。它的意思是构建者足够了解他们的系统，以至于：

- 知道哪些指标 (metrics) 很重要；
- 知道何时发出警报 (alert)；
- 知道如何回滚 (rollback)；
- 知道哪些数据是事实来源 (source of truth)；
- 知道哪些错误会影响真实用户；
- 知道速度和安全性之间的权衡 (trade-off)。

对于 AI 工作流，我至少会跟踪：

```txt
工作流成功率
工作流失败率
LLM 延迟
每个工作流的 LLM 成本
重试次数
队列深度
人工审批率
用户纠正率
```

这些指标比仅仅查看“服务器是否还活着”实用得多。

## 3. AI 产品需要在正确的地方加入人类循环 (human-in-the-loop)

并非每一步都需要人工审批。但有些地方应该有控制措施：

- 向客户发送电子邮件/报价；
- 更改关键的交易阶段 (deal stages)；
- 生成具有法律风险的内容；
- 回复儿童或敏感群体；
- 覆盖重要的 CRM 数据。

例如：

```txt
AI 生成跟进消息
  → 如果是正常线索：自动保存草稿
  → 如果交易价值高：需要人工审批
  → 如果置信度 (confidence) 低：添加“需要审核”标志
```

这就是如何让 AI 变得不那么危险，同时又保持有用的方法。

## 4. 监控不仅仅是为了后端

小型 AI 产品也应该监控产品层：

### 技术指标 (Technical metrics)

```txt
API 延迟
错误率
队列深度
数据库查询时间
LLM 超时
```

### AI 指标 (AI metrics)

```txt
提示词版本
模型版本
评估分数
人工纠正率
幻觉 (Hallucination) 报告
```

### 业务指标 (Business metrics)

```txt
线索响应时间
跟进完成率
报价发送率
交易转化率
用户活跃率
```

如果只监控服务器，你只知道系统正在运行。但你不知道产品是否创造了价值。

## 5. 一个关于回滚的极小例子

假设你更改了 AI 跟进的提示词：

```txt
prompt_v1：礼貌、简洁
prompt_v2：友好、大量追加销售 (upsell) 建议
```

部署 `prompt_v2` 后，用户开始更多地编辑消息。纠正率从 12% 跃升至 35%。

如果你不记录提示词版本，你就不知道错误从何而来。如果你没有功能标志 (feature flags)，你的回滚会很慢。如果你没有评估集 (evaluation set)，你只有在用户抱怨时才知道。

一种更安全的方法：

```txt
1. 对提示词进行版本控制
2. 在部署前运行评估集
3. 金丝雀发布 (Canary) 给 10% 的工作区
4. 监控纠正率
5. 如果指标不好则回滚
```

你不需要一个过于复杂的系统。但你必须有生产环境意识 (production awareness)。

## 结论

对于 AI 产品构建者来说，"运营你所构建的"是一种非常值得拥有的心态。

它不会让你慢下来。相反，它帮助你更有信心地构建。因为当你有日志、指标、回滚、评估和警报时，你才敢改变系统，而不是靠碰运气。

对我来说，这就是 AI 演示和真正的 AI 产品之间的界限。

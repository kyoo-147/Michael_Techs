---
title: Feed 排名与反馈循环 (Feedback Loop)：给产品构建者的教训
description: >-
  解释推荐系统 (recommendation system) 中的反馈循环，以及产品构建者应该如何设计信号 (signals)、指标 (metrics)
  和护栏 (guardrails)。
pubDatetime: '2022-11-03T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Feed Ranking
  - Feedback Loop
  - Product Design
  - Recommendation
  - User Behavior
categories:
  - AI
  - Product
---

Feed 排名是一个非常吸引人的问题，因为它看起来很简单：有很多内容，选择哪个放在前面。

但一段时间后，Feed 不仅仅反映了用户的偏好。它开始反过来影响偏好、行为、信念，以及用户与产品交互的方式。

这就是反馈循环 (feedback loop)。

我写这篇文章是给产品构建者 (product builders) 的笔记：如果你将来要构建 CRM 推荐、AI 建议、内容 Feed、搜索排名或下一步最佳行动 (next-best-action)，在接触复杂的模型之前，你需要了解这个循环。

## 参考资料

- TikTok Newsroom — [How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- arXiv — [The Feedback Loop Between Recommendation Systems and Reactive Users](https://arxiv.org/abs/2504.07105)
- arXiv — [Dynamics of Algorithmic Content Amplification on TikTok](https://arxiv.org/abs/2503.20231)

## 1. 什么是反馈循环？

一个推荐循环通常是这样的：

```txt
系统推荐项目 (item)
  → 用户查看 / 忽略 / 点击 / 点赞 / 购买 / 编辑
  → 系统记录信号
  → 模型/排名改变
  → 下一次推荐受到影响
```

看起来不错。用户喜欢什么，系统就学习什么。

但问题是，系统也在**塑造用户接下来会看到什么**。如果它只优化一个指标，如观看时间或点击量，系统会逐渐将用户推入一个更狭窄的内容区域。

在工作产品中，这个循环同样存在。如果 CRM 不断建议“发送折扣跟进”，而用户选择它是因为它很快，系统可能会学到折扣是不错的行动，即使从长远来看它降低了利润率。

## 2. 用户信号不是中立的

点击并不总是意味着喜欢。

用户点击可能是因为：

- 好奇心；
- 令人震惊的标题；
- 没有更好的选择；
- 误触；
- 只是检查一下；
- 想要将其从列表中删除；
- 被 UI 诱导。

同样，在 CRM 中：

```txt
用户选择 AI 建议
```

并不意味着建议很好。他们选择它可能是因为懒得重写。因此，我们需要后续的信号：

- 他们编辑了吗？
- 消息实际发送了吗？
- 客户回复了吗？
- 交易 (deal) 取得了进展吗？
- 用户撤销 (undo) 了吗？

## 3. 排名应该有多个目标

一个只优化参与度 (engagement) 的 Feed 可能会让人觉得“上瘾”，但这未必是好事。

CRM 建议系统也不应仅仅优化“用户点击建议”。它应该平衡：

```txt
- 实用性 (usefulness)
- 用户信任 (user trust)
- 业务成果 (business outcome)
- 安全性 (safety)
- 行动的多样性 (diversity of actions)
- 长期价值 (long-term value)
```

例如：

```txt
行动得分 (Score) =
  相关性得分 (relevance_score)
  + 紧迫性得分 (urgency_score)
  + 业务价值得分 (business_value_score)
  - 风险得分 (risk_score)
  - 重复惩罚 (repetition_penalty)
```

最初，它可以是基于规则的 (rule-based)。不需要立刻上 ML。

## 4. 探索 (Exploration) 很容易被遗忘

如果系统总是推荐正在获胜的东西，它将很少尝试新事物。久而久之，推荐就会陷入僵局。

对于内容 Feed，这会让用户觉得重复。
对于 CRM，这会让团队只尝试几个熟悉的动作。

一个简单的方法：

```txt
80% 利用 (exploit)：选择目前最好的行动
20% 探索 (explore)：尝试其他合理的行动
```

但是在商业工具中进行探索必须有限制。你不能通过向大客户发送有风险的电子邮件来“试验”。你可以在草稿 (draft) 级别进行探索，而不是自动发送。

## 5. 反馈循环的护栏 (Guardrails)

我会设置几个护栏：

- 不要使用单一指标；
- 避免过多地重复相同类型的建议；
- 让用户可以说“没用 (not useful)”；
- 记录建议某个操作的原因；
- 测量纠正率 (correction rate)；
- 区分点击 (click)、接受 (accept)、完成 (complete) 和结果 (outcome)；
- 对有风险的行动需要人工批准。

例如，UI 应该显示：

```txt
建议原因：
- 客户已经 3 天没有回复
- 报价已发送但未查看
- 类似的交易通常需要跟进电话
```

简单的解释有助于用户更加信任系统。

## 结论

反馈循环是推荐系统的核心。但它也是产品很容易自我偏离的地方。

对于产品构建者来说，教训不是“构建一个像 TikTok 这样的算法”。教训是：先设计信号、指标和护栏。只有当产品的数据循环足够清晰和健康时，模型才能学得好。

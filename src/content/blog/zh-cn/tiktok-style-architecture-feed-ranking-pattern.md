---
title: >-
  TikTok 风格的架构 (TikTok-style architecture)：应被理解为 feed 排序模式 (feed ranking
  pattern)，而不是内部架构图
description: 一篇关于 TikTok 风格架构的谨慎文章：仅使用公开来源来推导产品模式 (product patterns)，而不去断言内部架构。
pubDatetime: '2022-08-16T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Feed Ranking
  - Product Architecture
  - Personalization
categories:
  - Technical
  - AI
draft: false
---

## 简介

“TikTok 风格架构 (TikTok-style architecture)”这个词听起来非常吸引人，但也容易被夸大。

如果没有官方的工程文档，我们就不应该画一张图，然后断言“TikTok 是这样使用 Kafka/Flink/feature store 的”。那是捏造。

更安全的做法是查看 TikTok 公开说明的关于“为你推荐 (For You)” feed 的内容，然后推导出现代 feed 排序系统 (feed ranking system) 的常见模式。

### 1. TikTok 官方是怎么说的？

TikTok 表示，“为你推荐” feed 是为每个用户个性化 (personalized) 的。系统通过基于多种因素对视频进行排序 (ranking) 来推荐内容，从用户表达的兴趣开始，然后根据用户感兴趣或不感兴趣的内容进行调整。

提到的信号包括：

- 用户交互 (user interactions)；
- 视频信息 (video information)；
- 设备/账户设置 (device/account settings)。

TikTok 还表示，他们试图使推荐多样化 (diversify recommendations)，而不仅仅是重复用户喜欢过的同类内容。

### 2. 可以推导出的模式 (Patterns)

从公开来源中，我们可以说一个 feed 排序系统通常需要：

```text
用户信号 (User signals)
→ 候选内容 (Content candidates)
→ 排序 (Ranking)
→ 多样性 / 安全规则 (Diversity / safety rules)
→ Feed 结果 (Feed result)
→ 新的反馈信号 (New feedback signals)
```

其中反馈循环 (feedback loop) 是非常重要的一部分。用户观看、滑动、点赞、关注、评论、点击“不感兴趣”——所有这些都成为 feed 继续调整的信号。

### 3. 不应该断言什么

不应该写：

```text
TikTok 使用 Kafka 和 Flink 进行实时推荐。
```

如果没有官方来源或明确的技术论文。

可以更谨慎地写：

```text
一个实时的 feed 排序系统通常可能需要事件流 (event streaming) 和流处理 (stream processing)。Kafka/Flink 是这两类问题的两种流行技术，但 TikTok 的公开来源不足以断言 TikTok 以某种特定方式使用了它们。
```

这就是负责任的技术分析与瞎猜之间的区别。

### 4. 应用于 CRM/AI 工作流

一个 CRM 也可以学习 feed 排序模式，但在更小的规模上：

```text
线索事件 (Lead events)
→ 候选的下一步行动 (Candidate next actions)
→ 评分/排序 (Scoring/ranking)
→ 业务规则 (Business rule)
→ 建议行动 (Suggested action)
→ 用户反馈 (User feedback)
```

例如，如果销售人员忽略了一个建议，或者客户没有回复，系统应该记录下来。如果一个报价被打开了多次，那么该线索的优先级可以提高。

### 5. 结论

“TikTok 风格的架构”应该被理解为一种关于富含反馈的产品 (feedback-rich product)、个性化和持续排序的模式，而不是 TikTok 的内部架构图。

写技术博客时，重要的一部分是知道边界在哪里：资料来源说了什么，我们推断了什么，以及我们不允许断言什么。

## 参考资料

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- TikTok Newsroom — Safeguard and diversify recommendations: https://newsroom.tiktok.com/en-us/an-update-on-our-work-to-safeguard-and-diversify-recommendations

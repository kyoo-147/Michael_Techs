---
title: TikTok 风格的推荐 (TikTok-style recommendation)：为什么架构和算法一样重要？
description: 通过官方来源和学术研究分析 TikTok 风格的 Feed，了解平台架构 (platform architecture) 在推荐系统中的作用。
pubDatetime: '2022-07-28T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - TikTok
  - Recommendation System
  - Platform Architecture
  - Feed Ranking
  - Algorithms
categories:
  - Technical
  - AI
---

谈到 TikTok 时，人们常说：“它的算法太强大了”。

这部分是对的。但如果只谈算法，我们就忽略了故事的另一半：**TikTok 的产品架构也为更强大的推荐创造了条件**。

全屏 Feed、一次只显示一个视频、极其清晰的观看时间 (watch time) 信号、快速的滑动行为、几乎不依赖社交图谱 (social graph)。这些不仅仅是 UI。它们是数据收集面 (data collection surface)，它们是反馈循环 (feedback loops)，它们是产品教模型如何理解用户的方式。

这篇文章并不试图反向工程 (reverse-engineer) TikTok。我只是阅读了 TikTok 的官方来源和一些学术研究，以了解为什么架构和算法一样重要。

## 参考资料

- TikTok Newsroom — [How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- TikTok Support — [For You](https://support.tiktok.com/en/getting-started/for-you)
- arXiv — [Platform architecture determines whether recommendation algorithms can shape information quality on social media](https://arxiv.org/abs/2605.19204)

## 1. TikTok 是怎么描述 For You feed 的？

根据 TikTok 的官方描述，For You feed 反映了每个用户独特的偏好。排名系统基于多组信号，包括用户交互、视频信息和某些设备/帐户设置。

交互信号可能包括：

- 你点赞/分享/评论的视频；
- 你关注的帐户；
- 你创建的内容；
- 你看完或跳过 (skip) 的视频；
- 你标记为不感兴趣的内容。

简而言之：Feed 不仅仅从你说你喜欢什么中学习，它还从非常微小的行为中学习。

## 2. 产品架构产生良好的信号

TikTok 有一个非常明显的优势：每次用户观看视频时，系统都会收到相当干净的反馈。

```txt
视频 A
  → 看了 2 秒然后滑走
视频 B
  → 看完
视频 C
  → 重看
视频 D
  → 点赞 + 分享
```

对于每个项目 (item)，系统可以轻松测量：

- 观看时间 (watch time)；
- 完播率 (completion rate)；
- 重看 (rewatch)；
- 跳过 (skip)；
- 点赞 (like)；
- 分享 (share)；
- 评论 (comment)；
- 看后关注 (follow after watching)。

一个无尽的短视频 Feed UI 创造了一个极快的循环：

```txt
推荐 → 用户反应 → 收集信号 → 更新排名 → 再次推荐
```

在许多其他产品中，信号比较模糊。例如 CRM 搜索：用户点击了一个客户并不一定意味着这是一个好结果。他们点击可能是出于好奇，因为没有其他选择，或者因为名字相似。

## 3. 关于平台架构的论文说了什么？

arXiv 上一篇 2026 年的论文讨论了平台架构和推荐算法如何共同影响信息质量。该论文模拟了各种架构：像 Reddit 这样的树状 (tree)、像 Facebook 这样的层级 (hierarchy)、像 Twitter 这样的网络 (network)，以及像 TikTok 这样的完全图 (complete graph)。

一个值得注意的观点：作者认为在更具流动性 (fluid) 的平台中，算法塑造信息传播的能力更强。在 TikTok 这样的结构下，基于流行度 (popularity-based) 的推荐可以创造赢家通吃 (winner-take-all) 的动态。

我把这部分看作一个提醒：推荐并不存在于真空中。它们存在于产品架构之中。

## 4. 给产品构建者的教训

如果你正在构建一个小型推荐系统，不要从“用什么模型？”这个问题开始。

首先要问：

- 项目 (item) 是什么？
- 哪个用户反馈最清晰？
- 哪个反馈容易产生噪音？
- UI 是否让信号更清晰？
- 系统需要探索 (exploration) 吗？
- 需要避免重复内容吗？
- 优化的指标会产生副作用吗？

例如，在 CRM 中，“下一步最佳行动 (next best action)”的建议可以基于：

```txt
- 用户选择了哪个行动
- 用户忽略了哪个行动
- 哪个行动导致了真正的跟进
- 哪个行动帮助推进了交易阶段
- 哪个行动被大量修改
```

但如果 UI 不记录跳过/修改 (skips/corrections)，模型就会缺乏反馈。这样一来，无论排名有多好，都很难改进。

## 5. 一个用于 CRM 的小型推荐流程

```txt
候选行动 (Candidate actions)：
  - 给客户打电话
  - 发送跟进邮件
  - 创建报价
  - 安排会议
  - 标记为冷线索

特征 (Features)：
  - 交易阶段
  - 最后活动时间
  - 线索来源
  - 客户细分
  - 之前的响应行为

排名 (Ranking)：
  - 先基于规则的基线 (rule-based baseline)
  - 然后在有足够数据时使用 ML

反馈 (Feedback)：
  - 已接受 (accepted)
  - 已忽略 (ignored)
  - 已编辑 (edited)
  - 已完成 (completed)
  - 导致转化 (resulted in conversion)
```

第一个版本不需要深度学习 (deep learning)。它需要的是正确的反馈循环。

## 结论

TikTok 的强大不仅仅是因为它的算法。它的强大是因为它的产品、UI、数据、反馈循环和算法被设计成相互促进。

对于一个小型 AI 产品，这是一个非常值得保留的教训：在问哪个模型最好之前，先设计系统以捕获最好的信号。因为如果没有好的反馈循环，推荐就只是一个看起来很聪明的排序列表。

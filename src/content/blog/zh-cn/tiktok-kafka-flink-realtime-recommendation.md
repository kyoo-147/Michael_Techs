---
title: TikTok 是否使用 Kafka/Flink 进行实时推荐 (real-time recommendation)？
description: 一篇事实核查文章：关于 TikTok 的推荐系统中的 Kafka/Flink，公开信息来源允许我们说什么，不允许我们说什么。
pubDatetime: '2022-09-06T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Kafka
  - Flink
  - Real-time ML
  - Source Check
categories:
  - Technical
  - AI
draft: false
---

## 简介

“TikTok 是否使用 Kafka/Flink 进行实时推荐？”这个问题听起来非常合理，因为实时推荐系统通常需要事件流 (event streaming) 和流处理 (stream processing)。

但合理并不意味着正确。

根据我查看的公开资料，TikTok 有官方文章在产品/推荐信号的层面上解释了“为你推荐 (For You)” feed，但我还没有看到官方来源明确说明 TikTok 在其推荐管道 (pipeline) 中使用了 Kafka 或 Flink。

因此这篇文章并非断言 TikTok 使用了 Kafka/Flink。这篇文章只是区分：什么是已知的，什么只是常见的模式，以及什么不应该被当成事实来写。

### 1. TikTok 的资料说了什么？

TikTok 表示，“为你推荐” feed 是通过基于多种因素（如用户交互、视频信息和设备/账户设置）对视频进行排序 (ranking) 来推荐的。TikTok 也有支持文档称，推荐系统使用偏好 (preferences)，而这些偏好是通过交互（如关注账户或点赞帖子）来获知的。

因此，我们知道 TikTok 有一个使用用户行为信号的推荐系统。

但这些资料并没有具体说明：

- 是否使用了 Kafka；
- 是否使用了 Flink；
- 事件流架构 (event streaming architecture) 具体是什么样的；
- 特征存储 (feature store) 或在线推理管道 (online inference pipeline) 具体包含什么。

### 2. Kafka 和 Flink 通常用于做什么？

Apache Kafka 是一个事件流平台 (event streaming platform)。它通常用于获取 (ingest)、存储和处理事件流。

Apache Flink 是一个流处理框架 (stream processing framework)，用于处理带有状态 (state)、窗口 (window)、事件时间 (event time) 的数据流，以及解决实时分析/处理问题。

在一个通用的实时推荐系统中，Kafka/Flink 可能会出现在以下环节：

```text
用户事件 (User event)
→ 事件流 (Event stream)
→ 流处理 (Stream processing)
→ 特征更新 (Feature update)
→ 在线推理 (Online inference)
→ 排序结果 (Ranking result)
```

但这只是一个通用模式，并非关于 TikTok 的明确声明。

### 3. 如何正确地写

不应该写：

```text
TikTok 使用 Kafka/Flink 进行实时推荐。
```

应该写：

```text
TikTok 公开表示，其“为你推荐” feed 基于交互信号和排序。对于一般的实时推荐系统，事件流和流处理是两个常见的技术模块；Kafka 和 Flink 是这两个技术组的流行示例。然而，目前没有足够的公开来源来断言 TikTok 在其推荐管道中使用了 Kafka/Flink。
```

这样写听起来没那么“酷”，但更加准确。

### 4. 小型 AI 产品的教训

对于一个小型的 CRM，最初你不需要 Kafka/Flink。如果每天只有几千个事件，一个简单的队列 (queue) 或后台作业 (background job) 就足够了。

什么时候应该考虑 Kafka/Flink？

- 事件量很大；
- 多个服务 (services) 消费事件；
- 需要重放 (replay)/回填 (backfill)；
- 需要实时分析；
- 需要有状态的流处理；
- 批处理管道 (batch pipelines) 对产品来说太慢。

小型 CRM 示例：

```text
创建线索 (lead_created)
→ 后台作业丰富线索 (background job enrich lead)
→ AI 评分 (AI scoring)
→ 更新仪表板 (update dashboard)
```

暂时不需要 Kafka。

大型 CRM：

```text
创建线索 (lead_created)
发送消息 (message_sent)
打开报价 (quote_opened)
更新交易 (deal_updated)
→ 事件流 (event stream)
→ 多个消费者 (multiple consumers)
→ 实时评分 (real-time scoring)
→ 分析仪表板 (analytics dashboard)
```

此时，事件流开始变得更加合理。

### 5. 结论

一篇好的技术博客文章不需要假装了解 TikTok 的内部架构。只需陈述事实：TikTok 公布了哪些信号，Kafka/Flink 解决什么样的问题，以及小型系统何时真正需要它们。

如果你不知道，就说你不知道。这也是工程学 (engineering) 的一部分。

## 参考资料

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- Apache Kafka — Introduction: https://kafka.apache.org/intro
- Apache Flink — What is Apache Flink?: https://flink.apache.org/what-is-flink/

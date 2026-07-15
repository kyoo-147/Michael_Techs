---
title: Netflix 如何使用 ML 优化流媒体质量 (streaming quality)？
description: 来自 Netflix 技术博客的笔记：机器学习如何用于预测流媒体质量、减少播放错误并改善观众体验。
pubDatetime: '2022-04-12T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - ML Systems & MLOps
  - Netflix
  - Machine Learning
  - Streaming Quality
  - Prediction
  - System Optimization
categories:
  - Technical
  - AI
---

在看 Netflix 时，我通常想得很简单：点击播放，电影流畅播放就可以了。

但在那个播放按钮背后，有许多技术决策：选择哪个比特率 (bitrate)，哪个服务器提供内容，当前网络稳定吗，设备能处理吗，是否应该稍微降低质量以避免缓冲 (buffering)？

Netflix 有一篇非常值得一读的文章：**Using Machine Learning to Improve Streaming Quality at Netflix**。这篇文章的妙处在于，它没有用一种遥不可及的方式谈论 ML。它谈论的是一个非常实际的问题：如何让视频为用户播放得更好。

## 1. 流媒体质量 (Streaming quality) 不仅仅是分辨率

用户通常认为视频质量就是 720p、1080p 或 4K。

但真实的体验还取决于许多其他因素：

- 视频开始得快还是慢？
- 有没有重新缓冲 (rebuffering)？
- 质量是否不断下降？
- 音频/视频是否稳定？
- 设备解码 (decode) 良好吗？
- 观看时网络是否发生变化？

一个不断卡顿的 4K 视频仍然是一次糟糕的体验。

Netflix 的伟大之处在于，他们将流媒体质量视为一个持续预测和优化的系统，而不仅仅是一个发送到设备的视频文件。

## 2. ML 用在哪里？

根据 Netflix 的文章，他们使用统计模型和机器学习来预测与视频播放质量相关的问题。简单的想法是：如果系统能提前预测哪个观看会话 (viewing session) 可能会遇到错误，它可以选择更好的服务策略。

例如，在视频播放之前或期间，系统可以查看：

```txt
网络状况 (network condition)
设备类型 (device type)
历史播放数据 (historical playback data)
内容特征 (content characteristics)
当前会话行为 (current session behavior)
```

从那里，它预测诸如：

```txt
重新缓冲的可能性 (likelihood of rebuffering)
启动延迟 (startup delay)
吞吐量/网络质量 (throughput/network quality)
合适的流媒体质量 (suitable stream quality)
```

这是一个非常重要的教训：生产环境中的 ML 通常不是为了“显得聪明”，而是为了做出直接影响用户体验的小决策。

## 3. 一个容易理解的例子

假设两个人正在看同一部电影。

A 正在使用电视，网络稳定。

B 正在使用手机，移动网络不稳定。

如果系统仅根据简单的规则选择视频质量，B 可能会遇到很多缓冲。但如果系统预测 B 的网络即将下降，它可以选择稍低一点的比特率，以便视频播放得更流畅。

听起来很小，但对于流媒体来说，“流畅”通常比“每一刻看起来都是最好的”更重要。

## 4. 适合小型 AI 产品的经验教训

我发现 Netflix 的案例可以引申到较小的产品，如 CRM、AI 工作流或仪表板。

并非每个项目都需要像 Netflix 那样扩展 (scale)。但这种思维方式非常值得学习：

> 不要仅仅优化模型。优化用户感受到的最终体验。

例如，在 CRM 中：

- 线索评分 (lead scoring) 模型可能准确率提高了 2%，但如果响应需要 5 秒钟，销售人员就不会使用它；
- 仪表板可能包含更多图表，但如果加载太慢，用户将跳过它；
- AI 助手的回答可能更好，但如果它偶尔捏造客户信息，那就不值得信任。

因此，在构建 AI 工作流时，指标不应仅仅是：

```txt
准确率 (accuracy)
F1 分数 (F1 score)
BLEU / 基准测试分数 (benchmark score)
```

还必须包括：

```txt
延迟 (latency)
后备率 (fallback rate)
用户纠正率 (user correction rate)
节省的时间 (time saved)
转化影响 (conversion impact)
工作流完成率 (workflow completion rate)
```

## 5. ML 系统需要反馈循环 (feedback loop)

Netflix 有一个巨大的优势：他们拥有真实的播放数据。

每个观看会话都会产生以下信号：

- 播放成功了吗？
- 有缓冲吗？
- 用户退出了吗？
- 质量改变了吗？
- 哪种设备/网络经常遇到错误？

系统可以从这些信号中不断学习。

对于小产品，我们也应该从一开始就设计一个反馈循环，即使很简单。

例如，CRM 中的 AI 工作流：

```txt
AI 建议跟进
→ 销售人员是修改内容还是直接发送？
→ 客户有回复吗？
→ 交易进入下一个阶段了吗？
→ 下次，AI 应该给出不同的建议吗？
```

没有反馈循环，AI 系统就会停滞不前。有了反馈循环，产品才有机会随着时间的推移变得更好。

## 6. CRM 仪表板的小型设计

如果我将这种思维方式应用于 CRM 仪表板，流程可能是：

```txt
用户打开仪表板
  ↓
后端获取交易/线索/活动数据
  ↓
分析服务计算转化率、响应时间、阶段流失
  ↓
AI 服务建议需要注意的问题
  ↓
前端显示易于理解的洞察 (insights)
```

但重要的部分是记录 (logging)：

```txt
点击了哪个洞察
忽略了哪个洞察
应用了哪个建议
哪个建议产生了真实结果
```

只有到那时，你才会去思考更好的模型。

## 7. 结论

我最喜欢的 Netflix 经验教训是：优秀的 ML 不会单独存在于 notebook 中。优秀的 ML 存在于一个知道如何观察、预测、行动和测量结果的系统中。

流媒体质量是一个非常清晰的例子：模型不需要出现在用户面前，但如果它能让视频播放得更流畅，用户马上就能感觉到。

AI 产品也是如此。用户不关心你使用什么模型。他们关心的是产品是否帮助他们工作得更快、错误更少、更容易理解。

## 参考资料

- [Using Machine Learning to Improve Streaming Quality at Netflix](https://netflixtechblog.com/using-machine-learning-to-improve-streaming-quality-at-netflix-9651263ef09f)
- [Improving Netflix Video Quality with Neural Networks](https://research.netflix.com/publication/for-your-eyes-only-improving-netflix-video-quality-with-neural-networks)
- [Netflix Technology Blog](https://netflixtechblog.com/)

---
title: Shopee 的 OnePiece：LLM 风格的推理 (reasoning) 如何进入排序系统 (ranking system)
description: >-
  关于 OnePiece 论文的笔记，以及上下文工程 (context engineering) 和推理是如何被引入工业级级联排序系统 (industrial
  cascade ranking system) 的。
pubDatetime: '2024-01-18T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - Ranking System
  - Industrial Recommender
  - LLM Reasoning
categories:
  - Technical
  - AI
  - Product
draft: false
---

## 简介

一听到“LLM 风格的推理”，许多人立刻会想到聊天机器人 (chatbot)。但 Shopee 的 OnePiece 论文展示了另一个方向：将上下文工程 (context engineering) 和推理的思想引入工业级排序/推荐系统。

这非常有趣，因为一直以来，排序系统通常被视为一个“召回 (retrieval) → 排序 (ranking) → 重排 (reranking)”的管道 (pipeline)，用于优化 CTR、CVR、GMV 或某个业务指标。

OnePiece 提出了一个问题：如果 LLM 因为上下文和推理而变得更强，排序模型能否学习其中一部分的思维方式？

### 1. 排序系统不仅仅是模型评分 (model scoring)

在电子商务中，排序不只是简单地“将产品从好到坏排列”。

一个排序系统必须考虑：

- 用户是谁；
- 他们刚刚搜索了什么；
- 他们曾经点击/购买过什么；
- 当前的上下文是什么；
- 哪些产品可能合适；
- 正在优化哪个业务指标。

管道通常是级联 (cascade) 的：

```text
候选召回 (Candidate Retrieval) → 排序 (Ranking) → 重排 (Reranking) → 最终列表 (Final List)
```

每一层都会过滤掉一些项目并提高准确性。

### 2. OnePiece 将上下文工程引入排序

根据这篇论文，OnePiece 将 LLM 的两个想法引入了召回/排序中：

- **结构化上下文工程 (structured context engineering)：** 通过交互历史、偏好和场景信号来丰富输入；
- **分块潜在推理 (block-wise latent reasoning)：** 允许模型以多步的方式改进表示 (representation)；
- **渐进式多任务训练 (progressive multi-task training)：** 使用用户反馈序列来监督学习过程。

简单来说：系统不再仅仅将原始特征 (raw features) 输入模型，而是尝试“讲述正确的上下文”，让模型更好地理解用户和情境。

### 3. 一个容易理解的例子

假设用户搜索“雨衣 (rain jacket)”。

如果只看查询词，系统可能会返回雨衣、防水夹克和风衣。

但如果加上上下文：

```text
用户之前买过徒步装备 (trekking gear)
目前身处多雨地区
通常选择中等价位的产品
最近点击过户外装备
```

排序可能会优先考虑户外防水产品，而不是便宜的塑料雨衣。

这就是上下文工程的精神：如果我们不提供足够结构化的上下文，模型不会自然而然地理解一切。

### 4. 对 CRM 搜索的启示

CRM 也有排序问题。

当搜索客户或线索时，结果应该考虑：

- 姓名/联系方式匹配；
- 开放的交易 (open deals)；
- 最近的互动；
- 优先级；
- 交易价值；
- 报价状态；
- 跟进历史。

仅仅是关键字匹配是不够的。一个热门线索 (hot lead) 必须优先于一个不活跃的旧联系人，即使文本匹配程度相同。

### 5. 结论

OnePiece 是一个很好的例子，说明“LLM 思维”并不只属于聊天机器人。上下文工程和推理可以成为许多其他系统的模式 (pattern)，尤其是搜索/排序/推荐系统。

重要的是不要把 LLM 生搬硬套到所有地方，而是学习有用的部分：提供更好的上下文，设计更好的表示 (representation)，并使用真实的指标进行评估。

## 参考资料

- OnePiece: Bringing Context Engineering and Reasoning to Industrial Cascade Ranking System: https://arxiv.org/abs/2509.18091
- Hugging Face Papers — OnePiece: https://huggingface.co/papers/2509.18091

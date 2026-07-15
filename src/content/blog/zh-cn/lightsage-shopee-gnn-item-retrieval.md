---
title: Shopee 的 LightSAGE：用于电子商务广告中商品召回 (item retrieval) 的 GNN
description: 分析 LightSAGE 论文，了解 Shopee 如何在推荐广告中使用图神经网络 (graph neural networks) 进行商品召回。
pubDatetime: '2022-07-07T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - GNN
  - Item Retrieval
  - Vector Search
  - E-commerce
categories:
  - Technical
  - AI
draft: false
---

## 简介

在推荐系统中，许多人经常直接跳到模型架构上。但是 Shopee 的 LightSAGE 论文强调了一个非常现实的情况：在工业设置中，模型只是其中一部分。

对于电子商务广告中的商品召回 (item retrieval) 而言，图构建 (graph construction)、数据稀疏性 (data sparsity)、冷启动 (cold-start) 和长尾商品 (long-tail items) 等环节决定了该系统是否可用。

### 1. 什么是商品召回 (Item retrieval)？

一个电子商务平台可能有数百万件商品。在需要推荐广告时，系统不可能把所有商品都拿出来一一评分 (score)。

因此通常会有一个召回步骤：

```text
用户 / 上下文 → 召回几百或几千个候选商品 → 排序 (Ranking) → 广告展示
```

召回必须快速且覆盖面够广。如果召回遗漏了好的商品，后面的排序环节就没有机会去弥补了。

### 2. LightSAGE 是如何使用图 (graph) 的？

根据 LightSAGE 论文，Shopee 通过结合强信号用户行为和高精度的协同过滤 (collaborative filtering) 来构建商品图。然后他们使用 GNN 为向量搜索 (vector search) 生成高质量的商品嵌入 (item embeddings)。

值得注意的是，这篇论文不仅仅是说“使用 GNN”。它讨论了三个非常贴近生产环境的问题：

- 构建高质量的图；
- 处理数据稀疏性；
- 处理冷启动和长尾商品。

正是这些问题，往往让推荐系统变得比演示版 (demo) 难得多。

### 3. 为什么图适合电子商务？

在电子商务中，商品不是孤立存在的。

一个产品可能与另一个产品相关联，因为它们：

- 被同一群用户浏览过；
- 经常被一起购买；
- 属于同一个搜索意图 (search intent)；
- 具有相似的点击/购买行为；
- 属于长尾商品，但与某个小众细分市场 (niche) 密切相关。

相比于扁平的特征表 (feature table)，图能更好地表示这些关系。

### 4. 一个简单的例子

假设有三个产品：

```text
A：男士跑步鞋
B：跑步袜
C：运动水壶
```

如果很多用户看了 A 然后买了 B，或者买了 A 然后点击了 C，图就会在这些商品之间建立联系。模型不仅仅看商品的内容，还能从集体行为中学习。

在 CRM 中，类似的想法可以用于轻量级的线索评分 (lead scoring)：

```text
线索 A 类似于 线索 B
线索 B 曾经转化为交易 (deal)
线索 A 可能需要尽早跟进
```

当然，小型的 CRM 并不需要马上使用 GNN。但是“实体之间的关系很重要”这种思维是非常值得学习的。

### 5. 结论

LightSAGE 是一个很好的案例，因为它把推荐系统拉回了现实：不仅有模型，还有数据、图、向量搜索、长尾、冷启动和 A/B 测试。

如果你正在构建一个小型 AI 产品，这里的教训是：在选择复杂的模型之前，先问问你的数据是否具有足够的关系、足够的信号和足够好的评估流程。

## 参考资料

- LightSAGE: Graph Neural Networks for Large Scale Item Retrieval in Shopee's Advertisement Recommendation: https://arxiv.org/abs/2310.19394

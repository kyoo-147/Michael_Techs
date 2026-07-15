---
title: 设计排名系统 (Ranking System)：从 Airbnb 到 CRM 搜索
description: 从 Airbnb Search 和基于嵌入的检索 (Embedding-Based Retrieval) 中吸取教训，以实用的方式设计 CRM 搜索/排名。
pubDatetime: '2022-03-08T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Airbnb
  - Ranking System
  - Search
  - CRM Search
  - Personalization
  - Relevance
categories:
  - Technical
  - Product
---

CRM 中的搜索听起来比 Airbnb 小得多。

Airbnb 必须帮助用户在数百万个房源中找到合适的住所。CRM 只需要寻找线索 (leads)、客户 (customers)、交易 (deals) 和报价 (quotes)。但仔细一看，核心问题非常相似：**用户不仅需要正确的结果，他们还需要在当时最有用的结果**。

我阅读了 Airbnb 关于基于嵌入的检索 (Embedding-Based Retrieval) 和搜索排名的文章，并重新思考：如果认真构建 CRM 搜索，我们应该从哪里开始？

## 参考资料

- Airbnb Engineering — [Embedding-Based Retrieval for Airbnb Search](https://airbnb.tech/ai-ml/embedding-based-retrieval-for-airbnb-search/)
- Airbnb Engineering — [Machine Learning-Powered Search Ranking of Airbnb Experiences](https://medium.com/airbnb-engineering/machine-learning-powered-search-ranking-of-airbnb-experiences-110b4b1a0789)
- arXiv — [Learning to Rank for Maps at Airbnb](https://arxiv.org/abs/2407.00091)

## 1. Airbnb 不仅仅是“搜索文本”

在 Embedding-Based Retrieval 这篇文章中，Airbnb 表示搜索的任务是将与用户查询最相关的房源呈现出来。但由于符合条件的房源太多，系统需要检索出一个较小的子集，以便更昂贵的排名模型稍后处理。

架构通常有多个层级：

```txt
查询 (Query)
  → 候选检索 (candidate retrieval)
  → 排名 (ranking)
  → 重新排名 / 业务规则 (re-ranking / business rules)
  → UI 结果
```

这是一个非常值得学习的模式。

对于 CRM，我们也不应该认为搜索只是：

```sql
WHERE name ILIKE '%keyword%'
```

好的搜索可能需要理解意图 (intent)：

- 按客户名称搜索；
- 寻找热门交易 (hot deals)；
- 寻找新发送的报价；
- 寻找包含相关内容的对话；
- 寻找很久没有跟进的客户；
- 寻找与之前案例相似的线索。

## 2. CRM 搜索应该从简单开始

第一个版本应该是一个轻量级的混合体 (hybrid)：

```txt
关键字搜索 (Keyword search)
  + 过滤器 (filters)
  + 新鲜度 (recency)
  + 实体优先级 (entity priority)
  + 权限 (permission)
```

查询示例：“acme quote”

结果应该优先考虑：

1. 名称类似于 Acme 的客户；
2. 与该客户相关的报价；
3. 包含最新报价的交易；
4. 提及该报价的对话。

如果关键字 + 过滤器解决了 80% 的问题，你就不需要立刻使用嵌入 (embeddings)。

## 3. 嵌入 (Embeddings) 什么时候有用？

当用户没有输入确切的关键字时，嵌入很有用。

例如：

```txt
"客户询问药片检查机的价格"
```

它可能涉及：

```txt
Pharmaceutical QC Defect Detection Machine (制药 QC 缺陷检测机)
blister inspection (泡罩检查)
industrial camera (工业相机)
quality control (质量控制)
```

如果单词不匹配，关键字搜索可能会漏掉。嵌入有助于将查询和文档映射到向量空间中更近的位置。

Airbnb 使用双塔架构 (two-tower architecture) 将查询和房源映射为嵌入。房源塔可以离线计算，查询塔可以实时计算以减少延迟。对于小型 CRM，我们可以更简单：

```txt
离线：
- 为客户摘要创建嵌入
- 为交易摘要创建嵌入
- 为对话片段创建嵌入

在线：
- 为查询创建嵌入
- 向量搜索 Top K
- 应用过滤器/权限
- 按新鲜度 + 业务优先级重新排名
```

## 4. 排名不仅仅是相关性 (Relevance)

一个“相关”的搜索结果不一定是应该排在最前面的结果。

在 CRM 中，排名可能会考虑：

```txt
相关性得分 (relevance_score)
新鲜度得分 (recency_score)
交易价值 (deal_value)
阶段优先级 (stage_priority)
所有权 (ownership)
最后活动 (last_activity)
风险/紧迫性 (risk/urgency)
```

例如：

```txt
得分 =
  0.45 * 相关性
+ 0.20 * 新鲜度
+ 0.15 * 交易优先级
+ 0.10 * 用户所有权
+ 0.10 * 紧迫性
```

这不是一个固定的公式。它只是一种开始清晰思考的方式。

## 5. 训练数据不应该随意选取

Airbnb 强调基于用户的旅程 (user's journey) 构建训练数据，包括有意义的正样本和负样本。他们不仅随机抽取负样本，因为那样问题太简单了，模型学不好。

在 CRM 中，如果以后训练排名模型，我们也必须小心：

正信号 (Positive signals)：

```txt
用户点击了结果
用户花很长时间打开了结果
用户在打开后完成了操作
用户搜索了类似的查询并选择了相同的实体
```

负信号 (Negative signals)：

```txt
结果显示了但被跳过
用户立即返回
用户使用改进的查询再次搜索
用户将结果标记为不相关
```

但点击是不够的。结果 (Outcomes) 才是最重要的。

## 6. CRM 搜索的一个小设计

```txt
/search?q=acme quote
  → 解析查询
  → PostgreSQL 关键字搜索
  → 如果查询较长/有语义，则进行向量搜索
  → 合并候选结果
  → 权限过滤器
  → 排名
  → 返回分组结果
```

响应可以分组：

```json
{
  "customers": [],
  "deals": [],
  "quotes": [],
  "conversations": []
}
```

如果用户需要区分实体，UI 不应该将所有内容混合到一个列表中。

## 结论

从 Airbnb 身上学到的教训并不是说小型 CRM 必须立刻构建复杂的排名系统。

教训是：搜索应该被视为一个多层系统：检索、过滤、排名、解释、衡量。第一个版本可以很简单。但如果从一开始就设计正确，以后添加嵌入、个性化或 AI 搜索就不需要完全重写。

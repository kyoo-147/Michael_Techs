---
title: 在什么时候为 CRM 仪表板使用 Redis 缓存才是合理的？
description: 关于使用 Redis 缓存优化 CRM 仪表板的实用笔记：何时使用、缓存什么、失效策略，以及如何避免常见陷阱。
pubDatetime: '2023-08-03T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Technical Notes
  - Redis
  - Caching
  - CRM Dashboard
  - Performance
  - Backend
  - System Optimization
categories:
  - Technical
  - Product
---

## 引言

当 CRM 仪表板数据量较小时，一切通常运行良好。直接查询数据库以渲染线索、交易和报价的数据表就足够了。

但是随着数据的增长，仪表板开始变慢：

```text
按状态分类的线索总数
按月划分的销售管道收入
处于提案阶段的交易数量
表现最佳的线索来源
每位销售代表的最近活动
```

每次用户打开仪表板时，后端都必须查询多个表、连接数据、进行分组和聚合。此时许多人立刻会想到：“加个 Redis 缓存就行了。”

Redis 确实能帮上大忙，但不应该到处乱加缓存。本文记录了我如何决定**在什么时候为 CRM 仪表板使用 Redis 缓存才是合理的**。

## 1. Redis 缓存解决了什么问题？

Redis 通常用于将频繁访问的数据存储在内存中。对于 CRM 仪表板，缓存在以下情况下非常有用：

- 数据读取的频率远大于写入的频率
- 聚合查询耗时较长
- 许多用户查看完全相同的仪表板
- 数据不需要精确到秒
- 响应可以容忍几秒或几分钟的延迟

示例概览仪表板：

```text
今日总线索
未平仓交易价值
本月转化率
按管道阶段划分的收入
```

这些数据通常不需要绝对的实时精确性。对于许多小型 CRM 来说，30到60秒的延迟是可以接受的。

## 2. 什么时候还不需要 Redis？

不要仅仅为了“看起来专业”而过早地添加 Redis。

在以下情况下，你还不需要 Redis：

- 数据库仍然很小
- 查询时间在 100-200 毫秒以内
- 仪表板用户很少
- 你还没有设置良好的索引
- 你还没有测量出性能瓶颈
- 数据不断变化，并且需要精确的实时准确性

在进行缓存之前，你应该做 3 件事：

```text
1. 测量慢查询在哪里。
2. 在正确的地方添加数据库索引。
3. 必要时优化查询或数据库架构。
```

缓存不应掩盖糟糕的数据库设计。它应该是在理解瓶颈之后的优化层。

## 3. CRM 仪表板中应该缓存什么

我优先缓存聚合数据：

### 仪表板摘要

```text
crm:dashboard:summary:org:{orgId}
```

示例值：

```json
{
  "totalLeads": 1240,
  "newLeadsToday": 32,
  "openDeals": 86,
  "pipelineValue": 45000,
  "updatedAt": "2026-06-25T00:00:00Z"
}
```

### 按阶段划分的管道

```text
crm:pipeline:by_stage:org:{orgId}
```

```json
[
  { "stage": "qualified", "count": 20, "value": 12000 },
  { "stage": "proposal", "count": 8, "value": 18000 }
]
```

### 线索来源表现

```text
crm:lead_source:performance:org:{orgId}:month:{yyyyMM}
```

这些数据不需要每秒更新，因此非常适合缓存。

## 4. 什么不要急于缓存

我对应缓存以下内容持谨慎态度：

- 敏感的个人信息
- 特定权限的响应
- 刚写入需要立即看到的数据
- 每个用户的复杂搜索/过滤查询
- 不断变化的分页列表

示例：

```text
GET /leads?search=nguyen&status=qualified&owner=user_123&page=3
```

你可以缓存它，但会有许多键，而且失效处理很困难。在第一版中，我会优先缓存摘要/聚合数据。

## 5. Cache-aside（旁路缓存）模式

最容易上手的模式是 Cache-aside 模式。

读取数据的流程：

```text
1. 后端检查 Redis。
2. 如果有缓存 → 立即返回。
3. 如果没有缓存 → 查询数据库。
4. 将结果带上 TTL 保存到 Redis 中。
5. 将结果返回给前端。
```

伪代码：

```ts
async function getDashboardSummary(orgId: string) {
  const key = `crm:dashboard:summary:org:${orgId}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const summary = await queryDashboardSummaryFromDb(orgId);

  await redis.set(key, JSON.stringify(summary), {
    EX: 60,
  });

  return summary;
}
```

60 秒的 TTL 意味着仪表板最多可能会滞后 1 分钟左右。对于许多商业仪表板来说，这是可以接受的。

## 6. 失效：缓存最难的部分

缓存之所以难，不在于 `redis.get`。缓存的难点在于这个问题：**什么时候删除缓存？**

有 3 种简单的方法：

### 方法 1：仅使用 TTL

设置较短的 TTL，例如 30-60 秒。

优点：

- 简单
- 失效 Bug 少
- 适合概览仪表板

缺点：

- 在 TTL 期间数据可能会滞后

### 方法 2：写入时失效

创建新的线索/交易/报价时，删除相关的键。

```ts
await createLead(data);
await redis.del(`crm:dashboard:summary:org:${orgId}`);
await redis.del(`crm:lead_source:performance:org:${orgId}:month:${month}`);
```

优点：

- 数据更新鲜

缺点：

- 很容易忘记删除相关的键
- 频繁的写入可能会使缓存失去作用

### 方法 3：后台刷新

设置一个定时任务重新计算仪表板摘要并将其写入 Redis。

```text
每 1 分钟 → 计算仪表板摘要 → 更新 Redis
```

如果仪表板被大量查看且聚合查询很繁重，则此方法非常合适。

## 7. OneClick CRM 的应用示例

对于 OneClick CRM，我按以下顺序进行缓存：

### 阶段 1

缓存仪表板概览：

```text
总线索数
未平仓交易
管道价值
已发送报价
今日截止活动
```

TTL：30-60 秒。

### 阶段 2

按月缓存分析数据：

```text
线索来源转化率
交易阶段分布
报价接受率
跟进完成率
```

TTL：5-15 分钟。

### 阶段 3

如果有大量用户和多个组织，则添加后台刷新并按组织进行缓存。

```text
crm:dashboard:summary:org:{orgId}
crm:pipeline:by_stage:org:{orgId}
crm:quote:acceptance_rate:org:{orgId}:month:{yyyyMM}
```

## 8. 需要测量的指标

如果添加了 Redis 但不进行测量，你将不知道它是否有所帮助。

我会测量：

```text
缓存命中率 (cache hit rate)
缓存未命中率 (cache miss rate)
平均响应时间
p95 响应时间
缓存前后的查询时间
Redis 内存使用量
关于数据滞后的投诉
```

示例：

```text
缓存前: dashboard summary p95 = 1200ms
缓存后: dashboard summary p95 = 180ms
缓存命中率: 82%
```

如果命中率低，可能是键设计不好，或者数据过于动态。

## 9. 常见陷阱

- 过早地缓存所有内容。
- 没有 TTL。
- 键没有带上 orgId/userId，导致租户之间的数据泄露。
- 缓存依赖权限的响应，但键缺少权限上下文。
- 不测量命中率。
- 当 Redis 宕机时没有后备方案 (Fallback)。
- 使用缓存来掩盖糟糕的查询/数据库设计。

在多租户 CRM 中，键应始终包含 `orgId`。

```text
bad:  crm:dashboard:summary
good: crm:dashboard:summary:org:{orgId}
```

## 10. 结论

Redis 缓存对于 CRM 仪表板非常有用，但应在适当的地方使用。

我仅在以下情况下添加 Redis：

```text
查询开始变慢
读取次数多于写入次数
聚合数据被重复查看
可以容忍几秒/几分钟的数据滞后
已建立用于测量效果的指标
```

主要经验教训：

- 优先缓存摘要/聚合数据，不要立刻缓存复杂的列表。
- 对于小型仪表板，短 TTL 通常就足够了。
- 失效是需要仔细设计的部分。
- Redis 应该让系统更快，而不是让逻辑更乱。

## 参考资源

- Redis Docs: https://redis.io/docs/latest/
- Redis — Query Caching for Microservices: https://redis.io/tutorials/howtos/solutions/microservices/caching/
- Azure Architecture Center — Cache-Aside pattern: https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
- AWS Caching overview: https://aws.amazon.com/caching/

---
title: 何时该离开 MongoDB/Cassandra/SQL？来自 Discord 的教训
description: >-
  通过 Discord 案例分析数据库迁移 (database migration) 的决定，以及如何根据访问模式 (access
  pattern)、运营成本和权衡 (trade-off) 选择数据库。
pubDatetime: '2022-05-26T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - MongoDB
  - Cassandra
  - SQL
  - Database Migration
  - Trade-offs
  - Scalability
categories:
  - Technical
---

在系统设计中一个非常容易引起争议的问题是：**应该使用哪个数据库？**

SQL、MongoDB、Cassandra、ScyllaDB、Redis、Elasticsearch……每种数据库都有人称赞。但 Discord 的案例展示了一个更现实的教训：数据库不是一次选择就能永远正确的。

Discord 曾经从 MongoDB 迁移到 Cassandra，后来又将消息存储迁移到 ScyllaDB。不是因为旧数据库“糟糕”，而是因为运营要求、规模 (scale) 和访问模式 (access pattern) 发生了变化。

## 参考资料

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. 不要凭感觉选择数据库

一种非常危险的数据库选择方式是：

```txt
MongoDB 易于使用 → 选择 MongoDB
SQL 很熟悉 → 选择 PostgreSQL
Cassandra 扩展性好 → 选择 Cassandra
Redis 速度快 → 把所有东西都放进 Redis
```

更正确的方法是问：

- 数据具有很强的关系性吗？
- 主要查询 (query) 是什么？
- 是读多还是写多？
- 需要事务 (transaction) 吗？
- 需要全文搜索 (full-text search) 吗？
- 数据朝哪个方向增长？
- 系统能容忍最终一致性 (eventual consistency) 吗？
- 团队有能力运营它吗？

数据库不仅仅是存储数据的地方。它还带来了一套运营模式 (operational model)。

## 2. 对于大多数产品，SQL 仍然是很好的起点

对于 CRM、仪表板或小型 SaaS，PostgreSQL/MySQL 仍然是一个合理的起点。

因为它们有：

- 事务 (transactions)；
- 清晰的 schema；
- 良好的连接 (joins)；
- 强大的索引 (indexes)；
- 灵活的查询；
- 易于备份；
- 容易找到懂用的人；
- 良好的生态系统。

例如，CRM 有线索 (leads)、联系人 (contacts)、交易 (deals)、报价 (quotes)。这天然就是关系型数据：

```txt
客户 ── 交易 ── 报价
    │
    └── 活动
```

使用 SQL 有助于清晰地建模，并避免数据过早变得松散。

## 3. MongoDB 适合文档数据快速变化的情况

MongoDB 适合某些情况：

- 灵活的文档数据；
- schema 快速变化；
- 对象嵌套层级深；
- 不需要复杂的连接 (joins)；
- 原型设计 (prototyping) 速度很重要。

例如，存储工作流配置：

```json
{
  "workflow_id": "wf_123",
  "steps": [
    { "type": "trigger", "event": "lead.created" },
    { "type": "condition", "field": "source", "equals": "website" },
    { "type": "action", "name": "send_follow_up" }
  ]
}
```

对于这种格式，文档数据库可能很方便。

但是，如果你开始需要复杂的报告、连接多个表或严格的数据约束，SQL 会更容易让人活下去。

## 4. Cassandra/ScyllaDB 解决的是完全不同的问题

Cassandra 和 ScyllaDB 并不是为了在所有方面取代 SQL。它们在大型分布式工作负载、基于明确键的读/写、水平扩展和良好的容错性方面表现出色。

但权衡 (trade-offs) 是：

- 查询必须围绕访问模式进行设计；
- 你不能像在 SQL 中那样随意查询；
- 数据建模更难；
- 运营复杂性更高；
- 迁移和一致性需要深入的了解。

Discord 使用 Cassandra 是因为消息存储需要海量扩展和容错能力。但当 Cassandra 集群造成太多繁重工作 (toil)、不可预测的延迟、GC 问题、压缩痛苦 (compaction pain) 和热分区 (hot partitions) 时，他们迁移到了 ScyllaDB 并添加了数据服务以更好地控制流量。

教训：Cassandra/ScyllaDB 解决了一组问题，但也带来了另一组问题。

## 5. 什么时候应该考虑迁移？

不要仅仅因为“听说新技术更好”就进行迁移。

当出现明确信号时，你应该考虑迁移：

### 延迟不再稳定

p99/p999 增加，用户觉得慢，值班 (on-call) 开始变得疲惫。

### 维护成本增加

团队花费了太多时间在救火上，而不是构建功能。

### 访问模式不适合当前数据库

例如，你需要快速查询时间线 (timeline)，但当前的 schema 使该查询过于昂贵。

### 规模超出了最初的设计

不仅仅是 2 倍的增长，而是数据/流量的基本性质发生了变化。

### 新数据库解决了正确的痛点

不是“新数据库更快”，而是“它对于我们的工作负载更快”。

## 6. 安全迁移需要清晰的计划

最少的数据迁移应该包括：

```txt
1. 了解当前的工作负载
2. 在接近生产的数据上进行基准测试 (Benchmark)
3. 如果需要，进行双写 (Dual-write) 或影子写入 (shadow-write)
4. 回填 (Backfill) 旧数据
5. 验证新旧数据库之间的读取结果
6. 通过功能标志 (feature flag) 进行切换 (Cutover)
7. 制定回滚 (rollback) 计划
8. 监控 p50/p95/p99、错误率、不匹配率
```

Discord 通过比较两个数据库之间一部分的读取结果来进行自动化验证。这是一个非常值得学习的细节。迁移不仅仅是移动数据，它还要证明数据在移动后仍然正确。

## 结论

从 Discord 身上学到的教训不是“去用 ScyllaDB”。教训是：你的数据库必须遵循你的访问模式和运营现实。

在规模很小的时候，选择易于理解、运营和调试的数据库。当你成长时，观察真正的瓶颈。如果你必须迁移，那是因为数据和工作负载迫使你这么做，而不是因为新技术看起来更酷。

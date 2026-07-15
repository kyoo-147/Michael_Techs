---
title: 当数据库开始让 on-call 团队精疲力尽时
description: 从 Discord 存储数万亿条消息的案例中，本文探讨了数据库不再适合其工作负载 (workload) 的迹象。
pubDatetime: '2023-04-18T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Database
  - Cassandra
  - ScyllaDB
  - On-call
categories:
  - Technical
  - Experience
draft: false
---

## 简介

数据库不仅仅在崩溃时才会发生故障。

还有一种更隐蔽的故障类型：系统仍在运行，但团队必须不断地照看它。延迟 (latency) 无法预测，修复 (repair) 时间长，on-call 令人精疲力尽，操作复杂，而且每次事件 (incident) 都会消耗大量时间。

Discord 在“How Discord Stores Trillions of Messages”一文中所述的从 Cassandra 迁移到 ScyllaDB 的案例就是一个非常值得一读的例子。

### 1. 规模 (Scale) 暴露了问题

Discord 曾经使用 MongoDB，后来在消息规模急剧增加时转向了 Cassandra。到了数万亿条消息的阶段，他们的 Cassandra 集群变得更难操作。

Discord 的文章提到了以下问题：

- 延迟不稳定；
- 维护费力；
- 集群修复和操作复杂；
- 墓碑 (tombstones) 影响数据读取；
- on-call/繁文缛节 (toil) 增加。

重点是：数据库并没有错。是工作负载 (workload) 和规模 (scale) 发生了变化。

### 2. 数据库何时成为负担？

一些迹象：

- 每次事件都与数据库有关；
- 查询延迟的波动无法预测；
- 最初的模式 (schema) 不再适合工作负载；
- 删除/修改数据会产生巨大的副作用；
- 团队必须花太多时间进行调整 (tuning)；
- 增加节点并不能彻底解决问题。

在那个时候，问题不再是“哪个数据库最好”，而是“哪个数据库最适合这个工作负载”。

### 3. 给小型 CRM 的教训

一个小型 CRM 暂时还不需要考虑 Cassandra 或 ScyllaDB。但关于工作负载的教训却非常贴近。

例如，CRM 中的活动日志 (activity log)：

```text
创建了线索 (lead_created)
发送了消息 (message_sent)
打开了报价 (quote_opened)
更新了交易 (deal_updated)
跟进失败 (followup_failed)
```

如果日志增长很快，常见的查询可能是：

- 获取客户的时间线；
- 获取交易的最新活动；
- 过滤过去 24 小时内的错误事件；
- 统计已发送的跟进数量。

表设计必须从查询模式 (query patterns) 出发，而不仅仅是从纸面上漂亮的实体 (entities) 出发。

### 4. 一个更简单的活动日志模式 (schema)

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

在初期，这可能就足够了。当规模扩大时，你可以分离档案 (archives)、分区 (partitions)、事件存储 (event stores) 或搜索引擎。

### 5. 结论

Discord 的案例很棒，因为它不仅仅是一个数据库迁移的故事。它是一个关于工作负载、运营成本和团队健康的故事。

一个好的系统不应该只是速度快。它必须足够易于操作，这样团队就不会被数据库拖入无休止的 on-call 循环中。

## 参考资料

- Discord Engineering — How Discord Stores Trillions of Messages: https://discord.com/blog/how-discord-stores-trillions-of-messages
- ScyllaDB Tech Talk — How Discord Migrated Trillions of Messages from Cassandra to ScyllaDB: https://www.scylladb.com/tech-talk/how-discord-migrated-trillions-of-messages-from-cassandra-to-scylladb/

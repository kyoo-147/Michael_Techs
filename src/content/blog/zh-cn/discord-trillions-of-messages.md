---
title: Discord 如何存储数万亿条消息 (trillions of messages)？
description: >-
  阅读 Discord 从 Cassandra 迁移到 ScyllaDB 的案例，并汲取关于数据库、热分区 (hot partition)、迁移和延迟
  (latency) 的教训。
pubDatetime: '2022-05-03T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Message Storage
  - Database
  - Cassandra
  - Scalability
  - System Design
categories:
  - Technical
---

有些系统从外面看起来很简单：用户发送消息，其他人打开应用程序就能看到。

但是当扩展 (scale) 到 Discord 的级别时，“存储消息”不再只是一个普通的 `messages` 表。它变成了一个关于分区 (partition)、热键 (hot key)、延迟 (latency)、迁移 (migration)、值班 (on-call) 的问题，以及如何防止系统在世界杯决赛全世界都在发垃圾信息时崩溃的问题。

这篇文章是我阅读 Discord 官方工程博客 **How Discord Stores Trillions of Messages** 时的笔记。

## 参考资料

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. 真正的问题不是“存储消息”

在 2017 年的版本中，Discord 从 MongoDB 迁移到了 Cassandra，因为他们需要一个能够良好扩展、容错，并且随着数据增长所需维护更少的数据库。

但到 2022 年初，存储消息的 Cassandra 集群已经增长到 **177 个节点**，并包含**数万亿条消息**。问题开始出现：

- 延迟不可预测；
- 值班人员经常被呼叫 (paged)；
- 维护操作变得昂贵；
- 一个热分区 (hot partition) 影响了整个集群；
- JVM 的压缩 (compaction) 和垃圾回收 (GC) 增加了运营的复杂性。

我在这里觉得有趣的一点是：系统在现阶段可能是对的，但随着规模和访问模式的改变，它会逐渐变得不再适用。

这不仅仅是一句“Cassandra 扩展性好”就能解决的。更现实的问题是：

> 我们数据的读/写模式是什么？是否存在异常热的分区？当维护任务运行时，系统还能保持稳定的延迟吗？

## 2. Schema 和分区是一切的起点

Discord 按照 `channel_id` 和一个基于时间的 `bucket` 对消息进行分区。这是有道理的，因为同一个频道中的消息通常是按时间顺序读取的。

但是有一个非常现实的细节：一个只有几个人的小服务器和一个拥有几十万人的大服务器可能共享完全相同的 schema，但流量却天差地别。

当一个大型频道有许多并发读者或发送者时，该分区就会变热。Cassandra 的读取比写入更昂贵，因为它们必须从内存表 (memtable) 和磁盘上的多个 SSTable 中读取。如果一个分区被过度读取，节点的延迟就会飙升，其他查询也会受到影响。

这是第一个教训：

> 数据库 schema 不仅仅是数据结构。它也是你对用户行为的假设。

如果这个假设是错的，系统将以延迟为代价。

## 3. Discord 不仅仅是更换了数据库

我喜欢 Discord 文章中的一点是，他们并没有讲述一个“我们切换到 ScyllaDB 然后一切都变好了”的故事。

他们知道热分区仍然可能发生。因此，除了从 Cassandra 迁移到 ScyllaDB 之外，他们还在 Rust 中构建了位于 API 单体架构和数据库之间的**数据服务 (data services)**。

这些数据服务发挥了几个关键作用：

- 将数据库查询分组为清晰的 gRPC 端点；
- 不包含业务逻辑；
- 请求合并 (request coalescing)：如果多个请求读取同一行，则只查询数据库一次；
- 一致性哈希路由 (consistent hash routing)：对同一频道的请求路由到同一服务实例，以增加合并的能力。

简而言之：与其让数据库承受全部的流量高峰，他们不如在中间放置一个缓冲层。

对于像 CRM 这样的小型系统，这个教训仍然适用。例如，CRM 仪表板有 50 个用户同时打开它以查看同一笔交易或对话历史记录。与其让每个客户端都直接向数据库发送查询，不如使用：

- 缓存 (cache)；
- 请求合并 (request coalescing)；
- API 聚合 (API aggregation)；
- 后台任务 (background job)；
- 为仪表板单独设置的读模型 (read model)。

## 4. 大规模迁移需要验证，而不仅仅是“复制数据”

Discord 需要在零停机时间 (zero downtime) 的要求下迁移数万亿条消息。最初，他们计划使用 Spark 迁移器，估计大约需要三个月。然后他们在 Rust 中编写了一个迁移器，读取令牌范围 (token ranges)，使用 SQLite 设置检查点，并将数据推送到 ScyllaDB。迁移速度有时达到每秒数百万条消息。

对我来说最重要的部分不是速度，而是他们进行**双读/验证 (dual read / validate)** 的地方：将一小部分读取请求发送到两个数据库并比较结果。

一个值得记住的模式：

```txt
旧 DB  ─┐
         ├─ 比较结果 → 报告不匹配
新 DB  ─┘
```

在迁移真实系统时，特别是关键数据，不要相信“感觉没问题”的直觉。你必须进行验证。

## 5. 小例子：应用于 CRM 的活动日志 (activity log)

一个小型 CRM 可能会这样存储活动日志：

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

这个 schema 在小规模下已经足够好了。但是如果一个实体 (entity) 有太多的活动，或者仪表板不断读取最新的活动，我们需要进一步思考：

- 我们需要按 `workspace_id` 分区吗？
- 仪表板需要读模型 (read model) 吗？
- 我们需要缓存最新的活动吗？
- 我们需要归档 (archive) 旧活动吗？
- 我们需要为通知单独设置一个事件流 (event stream) 吗？

这就是我们向 Discord 学习而不是照抄 Discord 的方式。小系统不需要立刻上 ScyllaDB。但小系统仍然需要了解访问模式。

## 6. 我保留的教训

一个大型消息系统不会因为缺乏花哨的数据库而死亡。它死于许多小事的累积：schema、分区、读取模式、压缩、GC、热分区、迁移、验证和值班时的繁重工作 (on-call toil)。

对我来说，这篇文章有 5 个教训：

1. **根据访问模式选择数据库，而不是根据炒作。**
2. **分区键 (Partition key) 是架构决策，而不仅仅是 schema 的细节。**
3. **在中间添加服务层可以保护数据库免受流量高峰的冲击。**
4. **海量数据迁移必须具有自动化验证。**
5. **如果系统服务于真实用户，p99 延迟比平均延迟更重要。**

回头看看 CRM、AI 工作流或实时仪表板，我看到了相同的思维方式：不要只构建一个能运行的功能。要问这个功能会读取什么、写入什么、多少次、谁在同时读取，如果数据增长 100 倍，哪个部分会最先让人头疼。

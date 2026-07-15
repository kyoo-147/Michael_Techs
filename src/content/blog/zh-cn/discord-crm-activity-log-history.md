---
title: 从 Discord 到 CRM：如何存储活动日志 (activity logs) 和对话历史 (conversation history)？
description: 从 Discord 处理消息存储的方式中吸取教训，为小型 CRM 设计活动日志和对话历史记录。
pubDatetime: '2023-05-11T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - CRM
  - Activity Log
  - Conversation History
  - Database Design
  - System Design
categories:
  - Technical
  - Product
---

在 CRM 中，有两类数据非常容易被忽视：**活动日志 (activity logs)** 和 **对话历史 (conversation history)**。

起初，它只有几行：创建了线索 (lead)、员工打了个电话、客户回复了消息、发送了报价 (quote)、交易 (deal) 改变了阶段。

但几个月后，这里就成了讲述与客户关系的整个历史的地方。如果设计得太简单，以后仪表板 (dashboard) 会变慢，搜索会很困难，数据迁移 (migration) 会很累，而 AI 助手会缺乏上下文。

我阅读了 Discord 存储数万亿条消息的案例，以在更小的规模上重新思考这个问题：如果 Discord 必须处理数百万个社区的消息历史记录，那么 CRM 应该如何存储活动和对话，使其既简单又可扩展？

## 参考资料

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. 活动日志不是消息，但有相同的问题

Discord 按频道和时间存储消息。CRM 有一个非常相似的模式 (pattern)：

```txt
客户 (Customer) / 线索 (Lead) / 交易 (Deal)
  └── 按时间排序的活动
        ├── 笔记 (note)
        ├── 电话 (call)
        ├── 电子邮件 (email)
        ├── 消息 (message)
        ├── 报价已发送 (quote_sent)
        └── 交易阶段已更改 (deal_stage_changed)
```

用户通常不会随机阅读活动。他们按实体 (entity) 阅读：

- 打开一个线索 → 查看互动历史；
- 打开一个交易 → 查看报价、电话、消息；
- 打开一个客户 → 查看整个时间线 (timeline)；
- 仪表板 → 获取最近的活动。

所以最重要的访问模式是：

```txt
workspace_id + entity_type + entity_id + created_at DESC
```

如果模式 (schema) 不满足这种访问方式，以后只会越来越麻烦。

## 2. 先简单设计

对于一个小型 CRM 系统，我会从 PostgreSQL 开始，不需要立刻跳到 Cassandra 或 ScyllaDB。

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_timeline
ON activity_logs (
  workspace_id,
  entity_type,
  entity_id,
  created_at DESC
);
```

这种方法有好处：

- 易于查询；
- 易于调试 (debug)；
- 易于用于时间线；
- 灵活的元数据 (metadata)；
- 尚未过度工程化 (over-engineered)。

但是需要纪律：`metadata` 不能成为垃圾场。用于过滤/报告的重要字段仍应有自己的列。

## 3. 对话历史应该分开还是合并？

有两种方法。

### 方法 1：合并到活动日志中

每条消息也是一个活动。

优点：快速、简单、漂亮的时间线。

缺点：如果聊天很多，活动表会迅速膨胀。搜索消息也变得更加困难。

### 方法 2：单独的 conversations/messages 表

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  customer_id UUID,
  channel TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  direction TEXT NOT NULL,
  sender_id UUID,
  body TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_time
ON messages (conversation_id, created_at DESC);
```

然后活动日志只记录重要事件：

```txt
收到消息 (message_received)
消息已发送 (message_sent)
对话已分配 (conversation_assigned)
跟进已安排 (follow_up_scheduled)
```

如果 CRM 有真正的消息传递功能，我倾向于方法 2，因为对话是它自己的领域 (domain)。

## 4. 不要让仪表板读取过多的原始事件 (raw events)

一个常见的错误：仪表板需要“最近的活动”、“上次联系日期”、“未读消息数”、“最后一条消息预览”，因此每次加载都需要连接 (join)/查询大量原始活动。

在规模小的时候，这没问题。当工作区 (workspaces) 增加时，它会变慢。

更好的方法是建立一个读取模型 (read model) 或汇总表 (summary table)：

```sql
CREATE TABLE customer_activity_summary (
  workspace_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  last_activity_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INT DEFAULT 0,
  PRIMARY KEY (workspace_id, customer_id)
);
```

每当有新活动时，后端都会更新此摘要。仪表板只读取摘要。

这是 Discord 案例的一个缩影：不要让根数据库处理所有类型的查询。有时你需要一个中间层或完全为特定屏幕服务的数据模型。

## 5. 什么时候开始考虑队列 (queues)？

当每个活动产生许多副作用 (side effects) 时：

- 发送通知；
- 实时更新仪表板；
- 计算线索得分 (lead score)；
- 创建提醒；
- 更新摘要；
- 调用 AI 建议下一步操作。

那时，不应该在主请求中完成所有操作。

```txt
用户操作
  → 写入活动
  → 发布事件 (publish event)
  → workers 处理通知 / 摘要 / AI 建议
```

主请求只需可靠地保存数据。次要任务留给 worker 稍后处理。

## 结论

从 Discord 到 CRM，规模相差甚远。但思维方式是一样的：理解数据是如何读取和写入的。

一个好的 CRM 不仅仅有线索、联系人和交易的表。它需要一个可靠的历史层，以便用户了解客户身上发生了什么。以后，如果添加 AI 助手，活动日志和对话历史将是最重要的上下文，这样 AI 就不会像个无知的聊天机器人一样回答问题。

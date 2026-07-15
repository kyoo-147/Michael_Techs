---
title: Shopee 与分布式追踪 (distributed tracing)：如何观察请求穿过微服务 (microservices)？
description: 分析 Shopee 使用 ClickHouse 进行分布式追踪的案例，以及为多服务系统提供的经验教训。
pubDatetime: '2022-06-14T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Shopee
  - Distributed Tracing
  - ClickHouse
  - Microservices
  - Observability
categories:
  - Technical
draft: false
---

## 简介

当一个系统很小的时候，日志 (logs) 通常就足够了。

但是，当一个请求 (request) 必须经过多个服务 (services)、数据库 (databases)、队列 (queues) 和外部 API 时，“错误在哪里？”这个问题就开始变得令人讨厌了。

Shopee 使用 ClickHouse 进行分布式追踪 (distributed tracing) 的案例是一个很好的例子，可以帮助我们理解为什么可观察性 (observability) 不仅仅是漂亮的仪表板 (dashboards)，而是能够看到请求在系统中的真实路径的能力。

### 1. 微服务 (Microservices) 的问题

界面上的一个简单工作流 (workflow) 背后可能隐藏着许多步骤：

```text
用户请求 (User request)
→ API 网关 (API Gateway)
→ 认证服务 (Auth Service)
→ 订单服务 (Order Service)
→ 支付服务 (Payment Service)
→ 通知服务 (Notification Service)
→ 数据库 (Database)
→ 外部提供商 (External Provider)
```

如果请求很慢，仅仅查看各个独立的系统日志很难知道瓶颈 (bottleneck) 在哪里。

分布式追踪通过将追踪 ID (trace id) 附加到请求上，然后跟踪该请求经过哪些服务、每个步骤花费多长时间以及哪个步骤失败来解决这个问题。

### 2. Shopee 使用追踪来查看“大局 (big picture)”

根据 ClickHouse 的文章，Shopee 需要在复杂的微服务架构中获得可见性 (visibility)。分布式追踪有助于在请求穿过多个服务时对其进行跟踪，从而更快地找到瓶颈或错误。

值得注意的是，Shopee 使用 ClickHouse 作为追踪数据 (tracing data) 的存储/查询引擎 (storage/query engine)。这是一个合乎逻辑的选择，因为追踪数据通常非常大，有许多行，并且需要按时间、服务、追踪 ID、延迟或错误进行快速查询。

### 3. 为小型系统提供的经验教训

一个小型 CRM/AI 工作流不需要从一开始就建立一个庞大的追踪平台。但是模式 (pattern) 是一样的。

例如，一个线索 (lead) 进入系统：

```text
网站表单 (Website Form)
→ 线索 API (Lead API)
→ CRM 数据库
→ 丰富服务 (Enrichment Service)
→ AI 评分 (AI Scoring)
→ 消息工作流 (Message Workflow)
→ 仪表板 (Dashboard)
```

如果客户报告“该线索没有收到跟进消息”，我们需要知道错误出在哪里：

- 表单没有发送请求；
- API 验证失败；
- 数据库插入失败；
- AI 评分超时 (timeout)；
- 消息提供商出现错误；
- 仪表板尚未刷新。

如果每个步骤都有相同的 `trace_id`，调试 (debugging) 就会容易得多。

### 4. 一个简单的追踪可能是什么样子？

```json
{
  "trace_id": "lead_20260623_001",
  "steps": [
    {"service": "lead-api", "status": "ok", "latency_ms": 42},
    {"service": "crm-db", "status": "ok", "latency_ms": 18},
    {"service": "ai-scoring", "status": "timeout", "latency_ms": 5000},
    {"service": "follow-up-worker", "status": "skipped"}
  ]
}
```

只看这里就能发现问题出在 AI 评分上。不需要瞎猜。

### 5. 结论

追踪不仅仅适用于大型科技公司 (Big Tech)。大型科技公司在大规模上使用它，但其背后的思维方式非常适合小型产品：当一个系统有多个步骤时，必须有一种方法可以看到请求经过了哪些步骤。

一个好的系统不应该只是在演示 (demo) 时能运行。它必须在出现错误时可以进行调试。

## 参考资料

- ClickHouse — Seeing the Big Picture: Shopee's Journey to Distributed Tracing with ClickHouse: https://clickhouse.com/blog/seeing-the-big-picture-shopees-journey-to-distributed-tracing-with-clickhouse
- ClickHouse video — Distributed Tracing in ClickHouse at Shopee: https://clickhouse.com/videos/distributed-tracing-clickhouse-shopee

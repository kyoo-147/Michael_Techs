---
title: Netflix 微服务：为什么可观测性比你想象中更重要？
description: 阅读 Netflix 关于微服务的文章，理解为什么分布式系统需要分层观察：请求流、瓶颈，以及实例级指标。
pubDatetime: '2022-03-24T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Netflix
  - Microservices
  - Observability
  - Monitoring
  - Distributed Systems
categories:
  - Technical
  - AI
---

当你在白板上画架构图时，microservices 听起来总是很美好。

每个 service 都很小、彼此独立、可以单独部署、也可以单独扩缩容。但一旦 production 出问题，感受往往完全不同：一个 request 可能会穿过 8 个 service、2 个 cache、1 个 database、1 个 queue，最后在某个没人说得准的地方 timeout。

这也是我喜欢 Netflix 那篇 **A Microscope on Microservices** 的原因。它不是用口号谈 microservices，而是在讨论一个非常真实的问题：当系统变得足够大时，通用型 monitoring tool 已经不够用了。你需要不同“放大倍率”去看同一个系统。

## 我参考的资料

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. Microservices 会让你需要回答的问题变得更多

在 monolith 里，如果一个 request 很慢，至少你知道问题还在同一个 codebase 里。

但在 microservices 架构里，一个 request 可能会这样走：

```txt
API Gateway
  -> Auth Service
  -> CRM Service
  -> Activity Service
  -> Notification Service
  -> AI Suggestion Service
  -> Database / Cache / Queue
```

当用户说“dashboard 很慢”的时候，问题已经不再是“哪个 function 慢”，而会变成：

- 是哪个 service 变慢了？
- 是哪个 downstream 出现了瓶颈？
- 是 CPU、network、database 还是 external API 的问题？
- 是所有用户都这样，还是只发生在某个 workspace？
- 是否和一次新部署有关？
- 是 p99 变差了，还是只是 average 变差？

如果没有 observability，很多时候答案只能靠猜。

## 2. Netflix 用 “microscope” 这个比喻非常准确

在那篇文章里，Netflix 提到要从多个层次去观察系统：

### 10x — request flow

看一个 request 穿过了哪些 service，哪个 service 调用了哪个 service，压力主要落在什么地方。

### 100x — bottleneck

当某个 service 变慢时，观察哪些 metric 和这个变化相关：CPU、GC、downstream call、database、error、timeout。

### 1000x — instance-level metrics

有时候问题只发生在某个具体 instance 上：thread runaway、CPU 分布不均、异常 host，或者只有高分辨率指标才看得出来的问题。

这里有一个很重要的点：分布式系统不可能只靠一张图就被真正理解。

## 3. Observability 不只是 logs

很多小项目会觉得“有 log 就够了”。但 log 只是其中一部分。

一个最基础的 observability 组合，通常至少包括：

```txt
Logs       -> 发生了什么？
Metrics    -> 系统现在健康还是脆弱？
Traces     -> request 去了哪里、时间花在哪？
Alerts     -> 什么时候需要人介入？
Dashboards -> 看趋势、做时间维度上的比较
```

比如一个 AI workflow：

```txt
POST /api/leads
  -> validate lead
  -> save database
  -> call enrichment API
  -> call LLM
  -> create follow-up task
  -> send notification
```

如果这个 workflow 很慢，一条 “request timeout” 的 log 远远不够。我们还需要知道：

- LLM call 花了多久？
- enrichment API 的 error rate 是多少？
- database insert 有没有变慢？
- queue backlog 有没有上升？
- retry 是否正在把系统流量进一步打爆？

## 4. 一个小例子：给 AI workflow 做 observability

如果是我来做，我会先从很简单的一套开始：

### Metrics

```txt
ai_workflow_requests_total
ai_workflow_latency_ms
llm_call_latency_ms
llm_call_error_total
workflow_queue_depth
workflow_retry_total
```

### 带上下文的 Logs

```json
{
  "workflow_id": "wf_123",
  "workspace_id": "ws_001",
  "lead_id": "lead_456",
  "step": "llm_follow_up_generation",
  "latency_ms": 2310,
  "status": "success"
}
```

### Trace

```txt
Lead Created Request
  |-- DB insert: 24ms
  |-- Enrichment API: 410ms
  |-- LLM call: 2310ms
  |-- Task creation: 18ms
  `-- Notification: 90ms
```

只要先做到这个程度，系统一旦出错，我们就不会那么“盲”。

## 5. Microservices 不应该先于 observability

一个很常见的错误是：service 拆得很早，但 logging、metrics、tracing、alerting 都还没有。

结果就是：架构图看起来更现代了，但 debug 却更困难。

对于小团队来说，很多时候一个 modular monolith 加上一套足够好的 observability，反而会比“谁也看不清里面发生什么”的 microservices 更可靠。

一个更合理的顺序通常是：

```txt
1. 先把 monolith / module 结构理清楚
2. 加入带 context 的 logs
3. 加基础 metrics
4. 引入 background jobs
5. 给关键 flow 加 trace
6. 只有在确实有理由时再拆 service
```

## 结论

Microservices 并不会天然让系统变得更好。它只是把一个系统拆成很多更小的部分。如果没有 observability，你只是把一个大问题变成很多个更难定位的小问题。

对于小型 AI 产品来说，这个教训尤其直接：在谈大规模扩展之前，先让你的系统变得可观察。知道 request 去了哪里、花了多久、在哪一步失败，仅仅做到这一点，就已经能让产品成熟很多。

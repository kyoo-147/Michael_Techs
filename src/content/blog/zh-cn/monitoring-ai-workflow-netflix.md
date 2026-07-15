---
title: AI 工作流的监控 (Monitoring)：向 Netflix 学习但在小规模应用
description: >-
  为小型 AI 工作流设计恰到好处的监控：日志 (logs)、指标 (metrics)、链路追踪 (traces)、评估 (evaluation) 和业务信号
  (business signals)。
pubDatetime: '2023-06-08T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - System Design Case Studies
  - Monitoring
  - AI Workflow
  - Netflix
  - Observability
  - Logs
  - Metrics
categories:
  - Technical
  - AI
---

AI 工作流的监控不应该从一个漂亮的仪表板 (dashboard) 开始。

它应该从一个更简单的问题开始：**当工作流失败时，我知道它在哪里失败了吗？**

我阅读了 Netflix 关于可观测性 (observability) 的文章，并发现了一个非常明确的观点：大型系统需要大量的“放大倍数”来进行调试 (debug)。但是对于小型产品，我们不需要把整个 Netflix 系统搬过来。我们只需要采取正确的思维方式，并构建一个“恰到好处”的版本。

## 参考资料

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. AI 工作流的故障点比我们想象的要多

以 CRM 工作流为例：

```txt
创建线索 (Lead)
  → 检查数据
  → 数据丰富 (enrichment)
  → 调用 LLM 进行分类
  → 生成跟进消息
  → 保存到 CRM
  → 发送通知
  → 更新仪表板
```

当工作流失败时，原因可能是：

- 线索数据缺失；
- 丰富 (enrichment) API 超时；
- LLM 返回的格式错误；
- 新的提示词 (prompt) 版本产生了更差的输出；
- 数据库锁/慢；
- 队列积压 (backlogged)；
- 通知服务商错误；
- 前端缓存了旧数据。

如果我们不监控每一步，我们只会看到一行：“工作流失败 (workflow failed)”。

那一行几乎没用。

## 2. 应该具备的三层监控

### 第 1 层：技术健康状况 (Technical health)

```txt
请求数 (request_count)
错误率 (error_rate)
p95 延迟 (latency_p95)
p99 延迟 (latency_p99)
队列深度 (queue_depth)
重试次数 (retry_count)
数据库查询时间 (database_query_time)
```

它回答：系统运行是否顺畅？

### 第 2 层：AI 行为 (AI behavior)

```txt
模型名称 (model_name)
提示词版本 (prompt_version)
输出解析错误率 (output_parse_error_rate)
评估分数 (evaluation_score)
人工纠正率 (human_correction_rate)
低置信度比例 (low_confidence_rate)
```

它回答：AI 是否在生成合理的输出？

### 第 3 层：产品影响 (Product impact)

```txt
线索响应时间 (lead_response_time)
创建的跟进数量 (follow_up_created_count)
发送的跟进数量 (follow_up_sent_count)
创建的报价数量 (quote_created_count)
交易阶段转化率 (deal_stage_conversion)
用户接受率 (user_acceptance_rate)
```

它回答：工作流是否创造了价值？

## 3. 日志必须有上下文 (Context)

像这样的日志是不够的：

```txt
Error: LLM failed
```

日志应该有上下文：

```json
{
  "event": "workflow.step_failed",
  "workflow_id": "lead_follow_up_v1",
  "run_id": "run_789",
  "workspace_id": "ws_001",
  "lead_id": "lead_123",
  "step": "generate_follow_up_message",
  "model": "gpt-4.1-mini",
  "prompt_version": "followup_v3",
  "error_type": "json_parse_error",
  "latency_ms": 2840
}
```

你不需要记录太多，但日志必须帮助读者了解正在发生的事情。

## 4. 像故事一样追踪 (Trace) 工作流

一个好的链路追踪 (trace) 就像一个时间线：

```txt
run_789
  ├── validate_lead: 12ms
  ├── enrich_company: 430ms
  ├── classify_lead: 910ms
  ├── generate_follow_up: 2840ms
  ├── parse_output: failed
  └── fallback_to_draft_template: 18ms
```

看到这个追踪，我们立刻就知道问题出在解析输出的步骤，而不是数据库或前端。

## 5. 警报 (Alerts) 要少而准

一个小型系统不需要 50 个警报。如果警报太多，最终就没有人会去读。

我会从几个警报开始：

```txt
10 分钟内工作流失败率 > 5%
队列深度连续 15 分钟增加
LLM 超时率 > 10%
输出解析错误激增
更改提示词后人工纠正率增加
```

最后一点非常重要：不要只对技术问题发出警报，还要对 AI 质量发出警报。

## 结论

AI 工作流的监控不需要一开始就很复杂。但必须从一开始就做对。

首先，带有上下文的日志。  
然后，每个步骤的指标 (metrics)。  
接着，追踪 (traces) 以了解流程。  
最后，评估 (evaluation) 和业务指标以了解 AI 是否真正有用。

一个不可观测的 AI 工作流只是一个漂亮的黑盒。它今天能运行，但明天在哪里失败却无人知晓。

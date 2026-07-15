---
title: 可扩展 ML 系统的微服务架构模式 (Microservice Architecture Patterns for Scalable ML Systems)
description: 关于如何将机器学习系统分解为更小的服务以使其更易于部署、监控和扩展的实用笔记。
pubDatetime: '2022-12-01T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - ML Systems & MLOps
  - Microservices
  - ML Systems
  - Scalable Architecture
  - Deployment
  - Monitoring
  - Recommendation Systems
categories:
  - Technical
  - AI
---

在学习机器学习时，有一种非常常见的误解：我们认为做出一个好模型就万事大吉了。

但在实际产品中，模型只是很小的一部分。剩下的部分是：数据从哪里来，模型如何部署 (deploy)，哪个服务调用模型，我们如何知道它出错了，新版本是否会破坏旧的工作流，以及如果流量激增，系统能承受得住吗？

这就是为什么我想阅读有关 **ML 系统的微服务架构 (microservice architecture)** 的文章。不是因为微服务总是好的，而是因为它迫使我们将 ML 视为一个生产系统，而不仅仅是一个运行一次就放在那里的 notebook。

## 1. 真正的问题

一个简单的 ML 系统通常是这样开始的：

```txt
数据 → 训练模型 → 保存模型 → API 预测 → 前端显示结果
```

在 Demo 阶段，这个流程很好。

但是进入生产环境后，事情开始变得更加复杂：

- 数据随时间变化；
- 模型有多个版本；
- 推理 (inference) 需要低延迟 (latency)；
- 某些任务需要在后台运行；
- 某些服务需要比其他服务扩展 (scale) 更多；
- 错误可能出在数据、模型、API、队列、数据库或前端；
- 如果没有良好的监控 (monitoring)，模型可能会在无人知晓的情况下悄悄崩溃。

论文 *Microservice Architecture Patterns for Scalable Machine Learning Systems* 描述了将 ML 工作流分解为独立服务，而不是将所有内容保留在单体应用 (monolith) 中的方向。其主要思想是：可以将训练、推理、预处理、监控和部署打包成独立的组件，使其更易于扩展和运营。

## 2. 不应将微服务仅仅视为一种趋势

微服务并不意味着拆分得越小越好。

如果项目很小，过早地拆分会使系统更加混乱：更多的 repo，更多的 API，更多的配置，更多的故障点。但是，如果系统开始具有许多不同类型的工作负载 (workloads)，微服务就变得有意义了。

例如，在 AI 工作流中：

```txt
前端 CRM
  ↓
后端 API
  ↓
工作流服务 (Workflow Service)
  ↓
LLM 服务 / ML 推理服务 (Inference Service)
  ↓
数据库 + 向量数据库 + 日志 (Logging)
```

在这里，`后端 API` 和 `ML 推理服务` 不一定以相同的方式扩展。CRM 仪表板可能会有许多读取数据的请求，而推理服务可能会更消耗 GPU/CPU。如果将它们放在同一个应用程序中，优化将会更加困难。

## 3. 一种易于理解的服务拆分方法

对于一个实际的 ML 系统，它可以分为以下几组：

### 数据服务 (Data Service)

负责获取数据、验证 schema、清理数据和保存元数据。

例如：

```txt
lead_events
customer_profiles
conversation_logs
product_catalog
```

在 CRM 中，该服务确保线索 (lead) 数据不会缺少电子邮件、电话、来源、阶段或时间戳。

### 训练服务 (Training Service)

负责训练或微调 (fine-tune) 模型。该服务不一定持续运行。它可以按计划或由触发器 (trigger) 运行。

```txt
新的标记数据 → 训练模型 → 评估 → 注册版本
```

### 推理服务 (Inference Service)

这是接收请求并返回预测的部分。

例如：

```http
POST /predict/lead-score
{
  "lead_source": "website",
  "industry": "restaurant",
  "last_message": "I need a CRM demo"
}
```

响应：

```json
{
  "score": 0.82,
  "priority": "high",
  "reason": "Lead requested a demo and provided business context"
}
```

### 监控服务 (Monitoring Service)

跟踪延迟、错误率、输入分布、输出分布和业务指标。

这是许多人容易跳过的部分。但是没有监控的生产 ML 就像在夜间不开车灯开车。

### 工作流服务 (Workflow Service)

负责将模型连接到业务操作。

例如：

```txt
线索得分 > 0.8
→ 创建交易 (deal)
→ 发送跟进 (follow-up)
→ 提醒销售回拨电话
→ 更新 CRM 活动
```

模型本身并不创造价值。工作流才是价值产生的地方。

## 4. 小例子：CRM 中的 AI 线索评分 (Lead Scoring)

假设我为 OneClick CRM 构建一个工作流：

> 当客户在网站上填写表单时，系统会自动分析线索、对其进行评分、创建交易并建议跟进。

一个简单的设计可能是：

```txt
网站表单
  ↓
线索 API 服务
  ↓
数据库
  ↓
线索评分服务 (Lead Scoring Service)
  ↓
工作流自动化服务
  ↓
通知 / 电子邮件 / CRM 更新
```

如果线索评分失败，系统仍应保存线索。你不应该让模型故障导致客户数据丢失。

我学到的一个原则是：

> ML 服务应该为工作流增加价值，但如果模型失败，它不应该让整个工作流瘫痪。

因此可以使用后备方案 (fallback)：

```txt
如果模型失败 → 临时使用基于规则的得分 → 标记以供审查
```

## 5. ML 系统中的监控需要关注多个层级

对于普通的后端，我们通常监控：

- 请求数；
- 错误率；
- 延迟 (latency)；
- CPU/RAM；
- 数据库查询时间。

对于 ML 系统，我们需要添加：

- 输入数据是否倾斜 (skewed)？
- 输出是否异常？
- 正在运行的是哪个模型版本？
- 预测是否创造了正确的业务操作？
- 离线指标是否仍然反映了真实指标？

例如，一个线索评分模型突然将 95% 的线索评为 `high priority`。后端仍在运行，API 仍然返回 200 OK，但产品可能出错了。

## 6. 权衡 (Trade-offs)

微服务有助于：

- 独立地扩展各个部分；
- 将模型与主后端分开部署；
- 更容易回滚 (rollback)；
- 明确各个服务的责任；
- 更容易监控每一层。

但它们也增加了：

- 运营的复杂性；
- 网络延迟；
- 日志记录/监控成本；
- 版本不匹配的风险；
- 需要更高的 DevOps 技能。

因此，对于一个小项目，我认为我们应该先从**模块化单体架构 (modular monolith)** 开始：

```txt
一个 repo，一个后端，但模块清晰：
- leads
- workflows
- inference
- monitoring
- notifications
```

当某一部分真正需要独立扩展时，那时再去拆分服务。

## 7. 结论

ML 中的微服务不仅仅是为了看起来像“企业级”。只有当它们使系统更容易部署、扩展、调试和回滚时，它们才有意义。

我学到的最重要的一点是：生产 ML 不仅仅是一个模型。它是一系列共同运行的服务、数据、API、监控和业务工作流。

如果一个好模型没有得到正确的部署，没有得到正确的监控，或者没有与具体的行动联系起来，它仍然只是一个实验。

## 参考资料

- [Microservice Architecture Patterns for Scalable Machine Learning Systems](https://arxiv.org/abs/2603.13672)
- [Design, Monitoring, and Testing of Microservices Systems: The Practitioners' Perspective](https://arxiv.org/abs/2108.03384)
- [ElasticRec: A Microservice-based Model Serving Architecture Enabling Elastic Resource Scaling for Recommendation Models](https://arxiv.org/abs/2406.06955)

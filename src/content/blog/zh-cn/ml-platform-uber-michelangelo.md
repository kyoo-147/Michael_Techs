---
title: ML 平台需要哪些模块？向 Uber Michelangelo 学习
description: >-
  分析 Uber Michelangelo，以了解生产环境中的 ML 平台 (ML platform) 需要数据 (data)、训练
  (training)、部署 (deployment)、预测 (prediction) 和监控 (monitoring)。
pubDatetime: '2022-02-17T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - ML Systems & MLOps
  - Uber
  - Michelangelo
  - ML Platform
  - Model Serving
  - Monitoring
categories:
  - Technical
  - AI
draft: false
---

## 简介

在 notebook 中运行良好的 ML 模型并不等于一个 ML 系统。

生产环境的 ML 需要更多东西：正确的数据、可重复的训练、安全的部署、稳定的预测、部署后的监控以及出错时的回滚 (rollback) 能力。

Uber Michelangelo 是一个经典的案例研究，可以帮助理解为什么大公司需要 ML 平台。

### 1. Michelangelo 解决了什么问题？

根据 Uber Engineering 的说法，Michelangelo 旨在帮助团队在 Uber 的规模上构建、部署和操作机器学习解决方案。

它涵盖了端到端 (end-to-end) 的 ML 工作流：

- 数据管理 (data management)；
- 训练 (training)；
- 评估 (evaluation)；
- 部署 (deployment)；
- 预测 (prediction)；
- 监控 (monitoring)。

简单来说，Michelangelo 试图将 ML 从孤立的项目转变为一个通用平台。

### 2. 为什么 ML 平台是必要的？

当每个团队都构建自己定制的管道 (pipeline) 时，问题就会出现：

- 训练和提供服务 (serving) 的数据不一致；
- 模型很难重现 (reproduce)；
- 手动部署；
- 不知道模型是否发生漂移 (drifting)；
- 无法跟踪预测质量；
- 每个项目都必须重复造轮子。

ML 平台的诞生就是为了减少这些重复的部分。

### 3. 一个极简的 ML 平台可以包含什么？

对于小型项目，你不需要构建 Michelangelo。但你可以学习它的结构：

```text
数据源 (Data Source)
→ 特征 / 数据集版本 (Feature / Dataset Version)
→ 训练管道 (Training Pipeline)
→ 评估报告 (Evaluation Report)
→ 模型注册表 (Model Registry)
→ 模型服务 API (Model Serving API)
→ 监控 (Monitoring)
→ 回滚 (Rollback)
```

对于作品集 (portfolio)，一个极其精简的版本：

```text
PostgreSQL / CSV
→ 训练脚本 (Training script)
→ 评估指标 (Evaluation metrics)
→ 保存的模型 (Saved model)
→ FastAPI 端点 (endpoint)
→ Docker 部署 (deployment)
→ 基本日志 + 延迟指标 (Basic logs + latency metrics)
```

### 4. 示例：CRM 中的线索评分 (lead scoring)

一个想要对线索进行评分的 CRM 可能需要：

- 线索数据；
- 交互历史；
- 交易 (deal) 结果；
- 特征提取 (feature extraction)；
- 模型训练；
- 预测分数的 API；
- 显示分数的仪表板 (dashboard)；
- 监控分数是否仍然有用。

如果你只是训练一个模型然后就停下来，系统并没有创造太多价值。价值在于进入工作流的分数：应该先打给哪个线索，应该发送哪个跟进，应该优先处理哪个报价。

### 5. 结论

Uber Michelangelo 表明，ML 平台并不是奢侈品。当 ML 进入生产环境并被多个团队使用时，这是一种自然的反应。

对于小型项目，你不需要复制整个系统。但你应该学习这个原则：ML 必须有明确的生命周期，而不仅仅是一个 notebook。

## 参考资料

- Uber Engineering — Meet Michelangelo: Uber's Machine Learning Platform: https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/
- Uber Engineering — Scaling Machine Learning at Uber with Michelangelo: https://www.uber.com/us/en/blog/scaling-michelangelo/

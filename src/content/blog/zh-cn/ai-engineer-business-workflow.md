---
title: 为什么 AI 工程师 (AI Engineer) 需要了解业务工作流 (business workflow)，而不仅仅是模型
description: AI 工程师不仅需要了解 prompt、RAG 或模型。要创造真正的价值，他们必须了解工作流、数据、用户以及系统在实践中是如何运行的。
pubDatetime: '2025-04-17T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - AI Product Thinking
  - AI Engineer
  - Business Workflow
  - Product Thinking
  - Applied AI
  - AI Product
categories:
  - AI
  - Product
---

刚开始学习 AI 时很容易犯一个错误：认为只要选对模型、写个好 prompt、加上 RAG，就能做出一个好产品。

但是，当把 AI 引入到一家真实的公司时，问题通常不再是“哪个模型更强大？”。更真实的问题是：

- 数据在哪里？
- 最终用户是谁？
- 他们正在遵循什么工作流？
- 哪个步骤最耗时？
- 哪个步骤需要人工审查？
- 如果 AI 给出了错误的答案，谁来负责？
- 我们如何知道这个系统真的能让业务变得更好？

这就是为什么我认为一个好的 AI 工程师不应该只了解模型。他们还需要了解**业务工作流 (business workflow)**。

## 1. 企业中的 AI 不是孤立存在的

一个演示版聊天机器人 (demo chatbot) 可以独立存在。但企业中的 AI 系统不行。

它通常处于许多事物之间：

```txt
表单 (Form) / 网站 (Website)
    ↓
数据库 (Database) / CRM
    ↓
业务规则 (Business rules)
    ↓
AI 模型 / LLM / RAG
    ↓
人工审批 (Human approval)
    ↓
电子邮件 / Zalo / Slack / 仪表板
```

例如，在一个 CRM 线索处理工作流中：

1. 客户在网站上填写表单，
2. 系统将线索保存到数据库，
3. AI 读取信息并对潜力级别进行分类，
4. 如果线索不错，则创建交易 (deal)，
5. 如果需要跟进，建议消息内容，
6. 员工进行审查，
7. 系统更新 CRM 中的状态。

在这里，LLM 只是很小的一部分。如果 API 失败、数据缺失、工作流不清晰、线索状态混乱，或者员工不信任 AI 的结果，那么再好的模型也救不了这个产品。

## 2. 前置部署工程师 (Forward Deployed Engineer) 指明了一个非常清晰的方向

Andrew Ng 最近写到了 **AI 前置部署工程师 (AI Forward Deployed Engineer)** 的角色：被“部署到靠近客户的地方”以定制 AI 解决方案、了解真实问题并将其在组织中实施的工程师。在他的写作 (Writing) 页面上，这被描述为 AI 工程中的一个新角色，工程师不仅要构建模型，还要帮助为客户组织定制解决方案。

我得出的结论是：在现实中，AI 工程师正在越来越接近于既懂技术又懂运营流程的人。

不是那种“我知道怎么用 LangChain”的类型。

而是：

> 我知道这个流程在哪里卡住了，哪些数据是可靠的，AI 应该在哪个步骤介入，以及哪个步骤仍然需要人工决策。

## 3. 业务工作流帮助我们知道 AI 应该做什么，以及不应该做什么

一个非常常见的错误是把所有东西都变成 AI Agent。

但并非每个步骤都需要 AI。

例如，在 CRM 中：

| 步骤 | 需要 AI 吗？ | 原因 |
|---|---|---|
| 保存新线索 | 不一定 | 普通的 CRUD 就足够了 |
| 验证电子邮件/电话号码 | 可以使用规则 | 不需要 LLM |
| 总结客户需求 | 可以使用 LLM | 自然文本数据，需要理解上下文 |
| 线索评分 (Lead scoring) | 可以使用规则 + ML | 需要明确的指标，而不仅仅是直觉 |
| 发送正式报价 | 应该有人工审查 | 业务风险高 |
| 跟进提醒 | 自动化就足够了 | 可以使用工作流调度器 (workflow scheduler) |

如果不了解工作流，就很容易在错误的地方使用 AI。

AI 应该被放置在有**上下文、非结构化数据或决策需要支持**的地方。对于具有良好规则的清晰、重复的步骤，传统的自动化通常就足够了。

## 4. AI 只有在减少实际工作中的摩擦时才能创造价值

一个在登陆页面 (landing page) 上听起来很棒的 AI 功能不一定能创造价值。

真正的价值通常来自于非常具体的事情：

- 减少线索响应时间，
- 减少数据输入步骤的数量，
- 减少遗忘的跟进，
- 减少查找客户信息所需的时间，
- 帮助新员工更快地了解交易历史，
- 帮助经理更清楚地看到销售渠道 (pipeline)。

例如，与其说“AI CRM 助手”，我更愿意设计得更清晰：

```txt
新线索进入系统
    ↓
AI 总结客户需求
    ↓
AI 建议标签：热门线索 / 需要咨询 / 需求不明确
    ↓
AI 提议下一步行动
    ↓
员工审查或编辑
    ↓
CRM 记录活动日志
```

这听起来不如“AI Agent 自动销售”那么花哨，但实用得多。

## 5. 我们需要用贴近业务的指标来衡量价值

具有高准确率 (accuracy) 的模型不一定能帮助企业表现得更好。

对于 AI 工作流，我会关注以下指标：

- 线索响应时间减少了多少？
- 按时跟进率是否提高了？
- 丢失的线索数量是否减少了？
- 员工是否真的在使用 AI 的建议？
- 创建报价的时间是否减少了？
- 客户回复是否更快了？
- 严重错误是减少了还是增加了？

这是许多应用 AI (applied AI) 文章都提到的一点：模型指标和业务指标是两回事。一个好的 AI 系统需要将两者连接起来。

## 6. 一个小例子：为报价流程设计 AI

假设企业有以下报价流程：

```txt
客户询问价格
    ↓
销售人员阅读需求
    ↓
寻找合适的产品/服务
    ↓
创建报价 (quote)
    ↓
发送给客户
    ↓
跟进 (Follow-up)
```

AI 不一定要立即自动发送报价。更安全的方法是：

- AI 总结客户需求，
- AI 建议相关的产品/服务，
- AI 创建报价草稿，
- 负责人检查价格和条款，
- 系统在批准后发送，
- CRM 自动创建跟进提醒。

在这里，AI 帮助减少了准备时间，但在关键步骤上仍保持控制。

## 7. 结论

AI 工程师不应该只问：“哪个模型最好？”

更正确的问题是：

> 哪个工作流最痛苦，AI 应该站在该工作流的哪个位置，我们如何知道它是否真的帮助用户更好地工作？

对我来说，这是 AI 产品工程 (AI Product Engineering) 一个非常实用的方向。AI 不是产品的装饰层。它必须被插入到正确的流程、正确的数据、正确的用户和正确的价值创造点。

## 参考资料

- Andrew Ng — Writing: Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf

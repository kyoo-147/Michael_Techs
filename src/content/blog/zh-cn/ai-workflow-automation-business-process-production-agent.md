---
title: "AI workflow automation: 从 business process 到 production agent"
description: "一个关于 AI workflow automation 的案例研究：从 process mapping、data contract 到 approval gates、observability 和 production agent。"
pubDatetime: "2026-07-12T08:00:00.000Z"
locale: zh-cn
author: Michael
featured: true
tags:
  - AI Workflow Automation Engineer
  - AI Workflow Automation
  - Production Agent
  - Business Process
  - Case Study
categories:
  - AI
  - Product
  - Technical
---

AI workflow automation 不应该从 agent 开始，而应该从 process 开始。

常见错误是用一个强模型去自动化一个模糊的业务问题。更好的路径是先 map workflow，再决定 AI 应该在哪些地方提供帮助。

这就是我理解 **AI workflow automation engineer** 这个角色的方式。

## 从 process 开始

在构建 agent 前，我想知道：

- 谁启动 workflow；
- 哪些数据进入系统；
- 有哪些 decision points；
- 哪些部分用 rule 就足够；
- 哪里出现 unstructured text 或 judgment；
- 哪些 action 需要 human approval；
- 成功如何衡量。

例如 customer intake workflow 可能包括 form submission、lead scoring、follow-up drafting、quote preparation、approval 和 CRM update。只有其中一部分需要 AI。

## 设计 agent boundary

production agent 需要边界。它应该知道自己能做什么、能建议什么，以及什么必须经过 approval。

```txt
Business event
    -> workflow state
    -> AI analysis
    -> proposed action
    -> policy check
    -> human approval if needed
    -> tool execution
    -> audit log
```

这种结构比让模型直接访问所有 tool 更可靠。

## Data contract 和 observability

agent 应尽量在结构化数据上运行。

与其说“读这个然后做点什么”，系统应该定义输入输出：

- lead summary；
- risk level；
- suggested next action；
- required approval；
- confidence；
- evidence。

observability 也必须存在。需要 logs、traces、cost tracking、tool-call history 和 error handling。否则 automation 很难被信任。

## Human approval

不是所有 action 都应该自动执行。

发送内部 summary 风险可能较低。给客户发送 quote、改变 deal stage 或删除数据，风险更高。production workflow 应该把高风险 action 送入 approval gates。

目标不是移除人类，而是减少重复摩擦，同时在业务需要的地方保留控制。

## 我学到的东西

好的 AI automation 往往是“无聊但可靠”的。它减少手工工作，保持记录干净，提出有用的下一步，并以可审查的方式失败。

production agent 不是魔法员工。它是一个带有 data contracts、policies、approvals 和 metrics 的 workflow component。

相关项目：[Dossier](/zh-cn/work/dossier)、[Sandora](/zh-cn/work/sandora) 和 [EverDock Desktop](/zh-cn/work/everdock-desktop).


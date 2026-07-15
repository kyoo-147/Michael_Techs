---
title: AI Agent 不应该从 Agent 开始，而应该从工作流 (workflow) 开始
description: >-
  在谈论 AI Agent、工具使用 (tool use) 或自主系统 (autonomous system)
  之前，应该从实际的工作流开始：谁做什么，数据在哪里，哪些步骤需要自动化，哪些步骤需要人类保持控制。
pubDatetime: '2025-05-08T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - AI Product Thinking
  - AI Agents
  - Workflow Automation
  - Product Design
  - Business Process
  - Applied AI
categories:
  - AI
  - Product
---

最近大家都在谈论 AI Agent。

Agent 预订会议。Agent 发送电子邮件。Agent 调用 API。Agent 自主完成任务。Agent 自己思考。听起来非常吸引人。

但是，如果我们从“我要构建一个 AI Agent”这句话开始，我认为很容易走错方向。因为 agent 不是产品。Agent 只是一种实现方式。

我们应该从工作流 (workflow) 开始。

## 1. 工作流是企业中真正存在的东西

在一家小型企业中，人们不会说：

> 我需要一个自主的多智能体系统 (autonomous multi-agent system)。

他们通常会说：

- 我忘记跟进客户了。
- 来自网站的线索 (leads) 丢失了。
- 员工输入 CRM 数据不一致。
- 创建报价需要太长时间。
- 我不知道该优先处理哪个客户。
- 每天我都要把数据从表单复制到表格中，然后手动发送 Zalo 消息。

这些才是真正的问题。

如果我们把它看作一个工作流，我们可以画得很简单：

```txt
线索从网站到达
    ↓
保存到 CRM
    ↓
对需求进行分类
    ↓
发送初步回复
    ↓
创建交易 (deal) 或跟进任务
    ↓
经理查看仪表板
```

只有在工作流清晰之后，我们才决定哪些步骤需要规则 (rules)，哪些需要自动化，哪些需要 LLM，哪些需要人工审批。

## 2. 智能体工作流 (Agentic workflow) 并不意味着把一切都交给 AI 自动运行

IBM 将智能体工作流定义为由 AI 驱动的流程，在这些流程中，agent 可以以一定程度的自主性进行计划、使用工具、协调和执行任务。但关键点是，工作流仍然是工作流：它有目标，有处理步骤，有输入/输出，也有边界。

简单来说：

> 一个好的 agent 不是什么都做的 agent。一个好的 agent 是知道在一个设计明确的流程中如何做好自己分内工作的 agent。

例如：

```txt
不好：
AI Agent 自主处理整个销售流程。

更好：
AI 协助分类线索、总结需求、建议下一步行动，但发送报价或做出价值承诺的步骤仍然需要人工审批。
```

## 3. 一个好的工作流通常有 5 个部分

在设计 AI 工作流时，我通常将其分为 5 个部分：

### 输入 (Input)

数据从哪里来？

- 网站表单，
- 电子邮件，
- CRM，
- PDF 文件，
- 聊天片段，
- 转录的通话记录。

### 上下文 (Context)

AI 需要知道什么才能处理它？

- 客户信息，
- 互动历史，
- 产品/服务，
- 定价政策，
- 内部规则。

### 决策 (Decision)

AI 需要做出决定还是仅仅提供协助？

- 分类线索，
- 总结内容，
- 建议回复，
- 标记风险，
- 提议后续步骤。

### 行动 (Action)

系统接下来会做什么？

- 创建任务，
- 更新 CRM，
- 发送消息草稿，
- 调用 API，
- 创建报价，
- 写入日志。

### 控制 (Control)

谁来检查？什么时候需要停止？

- 人工审批 (human approval)，
- 置信度阈值 (confidence threshold)，
- 审计日志 (audit log)，
- 回滚 (rollback)，
- 发生错误时发出通知。

如果这 5 个部分不清楚，添加一个 agent 只会使系统更难控制。

## 4. 示例：用于 CRM 线索跟进的 AI Agent

一个“恰到好处”的设计可能是这样的：

```txt
提交网站表单
    ↓
后端将线索保存到 PostgreSQL
    ↓
AI 阅读内容并总结需求
    ↓
规则引擎检查来源、预算、紧急程度
    ↓
AI 建议下一步行动
    ↓
销售人员批准或编辑
    ↓
系统创建活动日志 + 跟进提醒
```

这里可能有一个 AI Agent，但它并不“自由飞翔”。它有具体的任务：

- 阅读线索，
- 调用工具获取客户数据，
- 创建摘要，
- 提议下一步行动，
- 未经批准，不要自动发送重要的承诺。

这种方法不如 agent 自己做所有事情的演示那么性感，但它在真实产品中是可用的。

## 5. 需要记录日志 (log) 的内容

对于 AI 工作流，日志不仅仅用于调试。日志也是为了了解系统为何做出某个决定。

你至少应该记录：

```json
{
  "workflow_id": "lead_followup_001",
  "lead_id": "lead_123",
  "input_summary": "客户询问针对 5 人销售团队的 CRM 咨询",
  "ai_action": "suggest_next_action",
  "ai_output": "建议打电话咨询并发送 CRM 演示",
  "human_approved": true,
  "created_task_id": "task_789"
}
```

从一开始不需要很复杂，但必须有痕迹。

因为总有一天你会问：“为什么 AI 会发送这个建议？”如果没有日志，你只有感觉，没有证据。

## 6. 我们应该什么时候使用 agent？

当一个任务具备以下所有 3 个因素时，我会使用 agent：

1. 需要多个处理步骤，
2. 需要阅读上下文或选择工具，
3. 结果可以被验证。

合理的例子：

- 分析线索并创建跟进草稿，
- 阅读文档并在回答问题时附上来源，
- 通过 API 检查订单状态并进行总结，
- 汇总仪表板数据并解释见解 (insights)。

暂时不应使用 agent 的例子：

- 将表单保存到数据库，
- 发送固定的电子邮件，
- 计算总收入，
- 验证电话号码，
- 创建简单的提醒。

传统的自动化做这些事情更好、更便宜，也更容易调试。

## 结论

AI Agent 是一个非常强大的工具，但它不应该成为起点。

起点应该是一个真实的工作流：

> 谁在做什么，哪个步骤最痛苦，数据在哪里，哪些决定很重要，AI 应该在哪里协助而不会失去控制？

当工作流清晰时，agent 就有了用武之地。当工作流不清晰时，agent 只会让一切看起来稍微聪明一点，但系统会变得更难让人信任。

## 参考资料

- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- Andrew Ng — Writing: Agents on the Desktop / Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

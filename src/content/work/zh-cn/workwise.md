---
locale: zh-cn
title: "WorkWise"
summary: "面向 company operations、AI agent actions、policy、approval、auditability 与 model cost control 的 governed workflow router。"
description: "WorkWise 是面向高风险运营 request 的 workflow control layer，覆盖资金、风险、审批和审计场景。它把每个步骤 route 到 parser、rule engine、small model、strong model 或 human approval，在减少 token waste 的同时保留 policy enforcement、evidence、approval path 和 audit trail。"
overview: "WorkWise 专注于不应该被当作自由聊天处理的 operations request：procurement intake、invoice exception handling 和 AI agent spend/action control。项目目前处于开发和测试阶段，目标是在商业化扩展前验证 workflow routing、cost comparison、risk gating 与 human-in-the-loop approval。"
problem: "当企业把 AI 引入运营流程时，invoice、procurement、refund、data export 或 agent action 不能交给不受约束的 model response。Naive single-model flow 可能浪费 token、遗漏 policy、跳过 approval、缺少 evidence、难以 audit，甚至允许超出权限边界的 action。"
approach: "WorkWise 把每个 request 转换为 governed workflow。系统会分类 workflow、抽取关键字段、执行 policy checks、计算 risk level、选择 cheapest sufficient route、在需要时请求 approval、生成 action package，并为每一步记录 audit trail。架构重点包括 policy gate、model routing、tool permissions、spend tracking、workflow trace 与 reliability loop。"
role: "Founder / Product Builder / Full Stack Developer"
period: "2026 - 现在"
featured: true
order: 6
heroImage: "/work/workwise/agent-registry.png"
showBody: false
metrics:
  - value: "3 Workflows"
    label: "procurement, invoice exceptions, and agent control"
  - value: "Token Routing"
    label: "parser, rules, small model, strong model, or approval"
  - value: "Policy Audit"
    label: "risk scoring, approval paths, and audit trails"
outcomes:
  - "围绕 procurement intake、invoice exception handling 和 AI agent spend/action control 三个 workflow 形成 MVP 方向。"
  - "设计 Operations Inbox，用于收集运营 request、分类 workflow、识别 missing data、评估 risk，并选择合适处理 route。"
  - "创建 routing model，用 hybrid routing 对比 naive single-model baseline，在不需要 strong model 的步骤降低 token 与 model cost。"
  - "定义 structured action package，包含 extracted fields、missing data、risk factors、policy results、approval paths、recommended actions、evidence 与 audit timelines。"
  - "围绕 agent governance、tool permissions、action approvals、AI spend tracking、model routing、policy gates 与 workflow reliability 设计 control plane。"
  - "项目目前处于开发和测试阶段，用于验证 decision quality、cost savings、approval accuracy 与 shadow-mode readiness。"
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/WorkWise"
    note: "Repository 目前代表 active MVP/prototype。部分产品界面、system design 与 governance 方向仍在商业化前测试。"
highlights:
  - title: "System overview"
    description: "WorkWise 作为 AI Ops Control Plane，连接 agents、models、tools、workflows、policy、approvals、spend 与 audit events。"
    src: "/work/workwise/system-overview.png"
  - title: "System architecture"
    description: "架构分为 UI、application/control plane、gateway/SDK、integrations 与 data/storage，让 governance 留在运营层。"
    src: "/work/workwise/system-architecture.png"
  - title: "Action lifecycle"
    description: "一个 action 会经过 model/tool gateway、policy gate、approval decision、execution、audit log、trace、retry 与 escalation。"
    src: "/work/workwise/action-lifecycle.png"
  - title: "MVP product map"
    description: "核心界面包括 Agent Registry、Pending Approvals、AI Spend Dashboard、Workflow Trace 与 Policy Center。"
    src: "/work/workwise/mvp-product-map.png"
timeline:
  - date: "01.2026"
    label: "Token-efficient routing 与 governed company operations 的产品定位"
  - date: "02.2026"
    label: "Procurement、invoice exception 与 AI agent spend/action control 的 MVP workflows"
  - date: "03.2026"
    label: "Request analysis API、workflow templates 与 structured action packages"
  - date: "04.2026"
    label: "Policy gate、approval queue、spend tracking 与 workflow trace design"
  - date: "05.2026"
    label: "Agent governance、model routing、permissions 与 reliability 的 system design"
  - date: "现在"
    label: "持续开发和测试 workflow routing、risk gating、cost comparison 与 shadow-mode validation"
storyBlocks:
  - title: "不是 operations chatbot"
    body: "WorkWise 从一个现实约束出发：许多运营 request 涉及资金、数据、tool access 和审批责任。这类 request 需要 workflow governance、auditability 与 approval path，而不是一句 AI answer。"
  - title: "按步骤 route，而不是全部交给大模型"
    body: "一个 request 会被拆成多个步骤。Parser 处理结构，rule engine 处理确定性规则，small model 处理简单分类，strong model 只在需要 reasoning 时使用，human approval 保留对高风险 action 的最终审查。"
  - title: "Action package 是决策单元"
    body: "输出不是 chat response，而是 action package：extracted fields、missing data、risk factors、policy result、approval path、recommended action、evidence 与 timeline。Reviewer 可以据此 approve、reject、request info 或 block。"
  - title: "为可控测试而构建"
    body: "WorkWise 目前处于开发和测试阶段。更合适的 rollout path 是 shadow mode：让系统与现有流程并行分析和建议，先测量 cost savings、decision quality 与 approval accuracy，再逐步扩大自动化范围。"
gallery:
  - label: "Agent Registry"
    src: "/work/workwise/agent-registry.png"
  - label: "Agent Governance"
    src: "/work/workwise/agent-governance.png"
  - label: "Tool Permissions and Access Control"
    src: "/work/workwise/tool-permissions.png"
  - label: "Agent Action Approvals"
    src: "/work/workwise/action-approvals.png"
  - label: "AI Spend Limit and Cost Tracking"
    src: "/work/workwise/spend-tracking.png"
  - label: "Model Routing Optimization"
    src: "/work/workwise/model-routing.png"
  - label: "Policy Gate"
    src: "/work/workwise/policy-gate.png"
  - label: "Workflow Reliability"
    src: "/work/workwise/workflow-reliability.png"
---

## Context

WorkWise 是面向 company operations 的 governed workflow router，用 routing、policy、approval、auditability 与 cost governance 控制高风险 request 和 AI actions。

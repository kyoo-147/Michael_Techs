---
locale: en
title: "WorkWise"
summary: "A governed workflow router for company operations, AI agent actions, policy, approvals, auditability, and model cost control."
description: "WorkWise is a workflow control layer for operational requests that involve money, risk, approvals, and audit requirements. It routes each step through a parser, rule engine, small model, strong model, or human approval so companies can reduce token waste while preserving policy enforcement, evidence, approval paths, and audit trails."
overview: "WorkWise focuses on operational requests that should not be handled as free-form chat: procurement intake, invoice exception handling, and AI agent spend/action control. The project is currently in development and testing, with the goal of validating workflow routing, cost comparison, risk gating, and human-in-the-loop approval before broader commercialization."
problem: "As companies introduce AI into operations, requests involving invoices, procurement, refunds, data export, or agent actions cannot be left to an unconstrained model response. A naive single-model flow can overspend tokens, miss policy requirements, skip approval, lack evidence, become hard to audit, or allow actions beyond the intended permission boundary."
approach: "WorkWise turns each request into a governed workflow. The system classifies the workflow, extracts important fields, runs policy checks, scores risk, chooses the cheapest sufficient route, requests approval when needed, creates an action package, and records an audit trail for every step. The architecture emphasizes policy gates, model routing, tool permissions, spend tracking, workflow trace, and reliability loops."
role: "Founder / Product Builder / Full Stack Developer"
period: "2026 - present"
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
  - "Shaped the MVP direction around three workflows: procurement intake, invoice exception handling, and AI agent spend/action control."
  - "Designed an Operations Inbox for collecting operational requests, classifying workflows, identifying missing data, scoring risk, and choosing the right processing route."
  - "Created a routing model that compares hybrid routing against a naive single-model baseline to reduce token and model cost where a strong model is not necessary."
  - "Defined structured action packages with extracted fields, missing data, risk factors, policy results, approval paths, recommended actions, evidence, and audit timelines."
  - "Designed the control plane around agent governance, tool permissions, action approvals, AI spend tracking, model routing, policy gates, and workflow reliability."
  - "Currently in development and testing to validate decision quality, cost savings, approval accuracy, and shadow-mode readiness."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/WorkWise"
    note: "The repository represents an active MVP/prototype. Some product screens, system design details, and governance direction are being tested before commercialization."
highlights:
  - title: "System overview"
    description: "WorkWise acts as an AI Ops Control Plane across agents, models, tools, workflows, policy, approvals, spend, and audit events."
    src: "/work/workwise/system-overview.png"
  - title: "System architecture"
    description: "The architecture separates UI, application/control plane, gateway/SDK, integrations, and data/storage so governance stays in the operating layer."
    src: "/work/workwise/system-architecture.png"
  - title: "Action lifecycle"
    description: "An action passes through model/tool gateways, policy gates, approval decisions, execution, audit logs, trace, retry, and escalation."
    src: "/work/workwise/action-lifecycle.png"
  - title: "MVP product map"
    description: "The core surfaces include Agent Registry, Pending Approvals, AI Spend Dashboard, Workflow Trace, and Policy Center."
    src: "/work/workwise/mvp-product-map.png"
timeline:
  - date: "01.2026"
    label: "Product framing for token-efficient routing and governed company operations"
  - date: "02.2026"
    label: "MVP workflows for procurement, invoice exceptions, and AI agent spend/action control"
  - date: "03.2026"
    label: "Request analysis API, workflow templates, and structured action packages"
  - date: "04.2026"
    label: "Policy gate, approval queue, spend tracking, and workflow trace design"
  - date: "05.2026"
    label: "System design for agent governance, model routing, permissions, and reliability"
  - date: "Present"
    label: "Developing and testing workflow routing, risk gating, cost comparison, and shadow-mode validation"
storyBlocks:
  - title: "Not an operations chatbot"
    body: "WorkWise starts from a practical constraint: many operational requests involve money, data, tool access, and approval responsibility. These requests need workflow governance, auditability, and approval paths, not just an AI answer."
  - title: "Route by step instead of sending everything to a large model"
    body: "A request is broken into steps. Parsers handle structure, rule engines handle deterministic checks, small models handle simple classification, strong models handle reasoning only when needed, and human approval keeps risky actions under review."
  - title: "The action package is the decision unit"
    body: "The output is not a chat response. It is an action package: extracted fields, missing data, risk factors, policy result, approval path, recommended action, evidence, and timeline. That gives reviewers a clear basis for approving, rejecting, requesting more information, or blocking."
  - title: "Built for controlled testing"
    body: "WorkWise is currently in development and testing. The right rollout path is shadow mode: let the system analyze and recommend alongside the existing process, measure cost savings, decision quality, and approval accuracy, then expand automation only where the evidence supports it."
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

WorkWise is a governed workflow router for company operations, built to control high-risk requests and AI actions through routing, policy, approvals, auditability, and cost governance.

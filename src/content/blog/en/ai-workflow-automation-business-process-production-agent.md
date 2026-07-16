---
title: "AI workflow automation: from business process to production agent"
description: "A case study on turning a business process into AI workflow automation, from process mapping and data contracts to approval gates, observability, and production agents."
pubDatetime: "2026-07-12T08:00:00.000Z"
locale: en
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

AI workflow automation should not start with an agent. It should start with a process.

The mistake I see often is trying to automate a vague business problem with a powerful model. The better path is to map the workflow first, then decide where AI should help.

This is how I think about the work of an **AI workflow automation engineer**.

## Start with the process

Before building an agent, I want to know:

- who starts the workflow;
- what data enters the system;
- which decision points exist;
- what can be automated with rules;
- where unstructured text or judgment appears;
- which actions need human approval;
- how success is measured.

For example, a customer intake workflow may include form submission, lead scoring, follow-up drafting, quote preparation, approval, and CRM updates. Only some of those steps need AI.

## Design the agent boundary

A production agent needs a boundary. It should know what it can do, what it can suggest, and what requires approval.

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

This structure is more reliable than giving the model direct access to every tool.

## Data contracts and observability

The agent should operate on structured data whenever possible.

Instead of "read this and do something," the system should define inputs and outputs:

- lead summary;
- risk level;
- suggested next action;
- required approval;
- confidence;
- evidence.

Observability is also required. You need logs, traces, cost tracking, tool-call history, and error handling. Without that, the automation becomes hard to trust.

## Human approval

Not every action should be automatic.

Sending an internal summary may be low risk. Sending a customer-facing quote, changing a deal stage, or deleting data is higher risk. A production workflow should route risky actions through approval gates.

The goal is not to remove humans. The goal is to remove repetitive friction while keeping control where the business needs it.

## What I learned

The best AI automation feels boring in a good way. It reduces manual work, keeps records clean, proposes useful next steps, and fails in reviewable ways.

A production agent is not a magic worker. It is a controlled workflow component with data contracts, policies, approvals, and metrics.

Related projects: [Dossier](/work/dossier), [Sandora](/work/sandora), and [EverDock Desktop](/work/everdock-desktop).


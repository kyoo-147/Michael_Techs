---
title: 'AI Agents shouldn''t start with agents, but with workflows'
description: >-
  Before talking about AI Agents, tool use, or autonomous systems, we should
  start with a real workflow: who does what, where the data is, what steps need
  automation, and what steps need human control.
pubDatetime: '2025-05-08T00:00:00.000Z'
locale: en
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

Recently everyone is talking about AI Agents.

Agents booking meetings. Agents sending emails. Agents calling APIs. Agents doing tasks autonomously. Agents thinking for themselves. It sounds very appealing.

But if we start with the sentence "I'm going to build an AI Agent", I think it's very easy to go in the wrong direction. Because an agent is not a product. An agent is just an implementation method.

What we should start with is the workflow.

## 1. The workflow is what actually exists in a business

In a small business, people don't say:

> I need an autonomous multi-agent system.

They usually say:

- I forgot to follow up with a customer.
- Leads from the website are falling through the cracks.
- Employees are entering CRM data inconsistently.
- Creating quotes takes too long.
- I don't know which customer to prioritize first.
- Every day I have to copy data from a form to a sheet and then manually message via Zalo.

These are the real problems.

If we look at it as a workflow, we can draw it very simply:

```txt
Lead arrives from website
    ↓
Save to CRM
    ↓
Classify needs
    ↓
Send initial response
    ↓
Create deal or follow-up task
    ↓
Manager reviews dashboard
```

Only after the workflow is clear do we decide which steps need rules, which need automation, which need LLMs, and which need human approval.

## 2. Agentic workflow doesn't mean leaving everything for AI to run autonomously

IBM defines agentic workflows as AI-driven processes where agents can plan, use tools, coordinate, and execute tasks with a degree of autonomy. But the important point is that a workflow is still a workflow: it has a goal, processing steps, inputs/outputs, and boundaries.

Simply put:

> A good agent is not an agent that does everything. A good agent is an agent that knows how to do its specific part within a clearly designed process.

For example:

```txt
Not good:
AI Agent handles the entire sales process autonomously.

Better:
AI assists in classifying leads, summarizing needs, suggesting next actions, but the steps of sending a quote or making value commitments still require human approval.
```

## 3. A good workflow usually has 5 parts

When designing an AI workflow, I usually divide it into 5 parts:

### Input

Where does the data come from?

- website forms,
- emails,
- CRM,
- PDF files,
- chat snippets,
- transcribed calls.

### Context

What does the AI need to know to process it?

- customer information,
- interaction history,
- products/services,
- pricing policies,
- internal rules.

### Decision

Does the AI need to make a decision or just assist?

- classify leads,
- summarize content,
- suggest responses,
- flag risks,
- propose next steps.

### Action

What will the system do next?

- create tasks,
- update CRM,
- send draft messages,
- call APIs,
- create quotes,
- write logs.

### Control

Who checks it? When does it need to stop?

- human approval,
- confidence thresholds,
- audit logs,
- rollbacks,
- notifications if errors occur.

If these 5 parts are not clear, adding an agent will only make the system harder to control.

## 4. Example: AI Agent for CRM lead follow-up

A "just enough" design could look like this:

```txt
Website form submitted
    ↓
Backend saves lead to PostgreSQL
    ↓
AI reads content and summarizes needs
    ↓
Rule engine checks source, budget, urgency
    ↓
AI suggests next action
    ↓
Sales approves or edits
    ↓
System creates activity log + follow-up reminder
```

There might be an AI Agent here, but it doesn't "fly free". It has specific tasks:

- read the lead,
- call a tool to get customer data,
- create a summary,
- propose a next action,
- do not automatically send important commitments unless approved.

This approach is less sexy than a demo of an agent doing everything by itself, but it is usable in a real product.

## 5. Things that need to be logged

With AI workflows, logs are not just for debugging. Logs are also to know why the system made a decision.

At a minimum, you should log:

```json
{
  "workflow_id": "lead_followup_001",
  "lead_id": "lead_123",
  "input_summary": "Customer asked for CRM consulting for a sales team of 5",
  "ai_action": "suggest_next_action",
  "ai_output": "Suggest calling to consult and send a CRM demo",
  "human_approved": true,
  "created_task_id": "task_789"
}
```

It doesn't need to be complex from the start, but there must be a trail.

Because one day you will ask: "Why did the AI send this suggestion?" If there is no log, you only have feelings, not evidence.

## 6. When should we use an agent?

I would use an agent when a task has all 3 of these factors:

1. requires multiple processing steps,
2. requires reading context or choosing tools,
3. the result can be verified.

Reasonable examples:

- analyzing a lead and creating a draft follow-up,
- reading documents and answering questions with sources,
- checking order status via API and summarizing,
- aggregating dashboard data and explaining insights.

Examples where you shouldn't use an agent yet:

- saving a form to a database,
- sending a fixed email,
- calculating total revenue,
- validating phone numbers,
- creating simple reminders.

Traditional automation does these better, cheaper, and is easier to debug.

## Conclusion

An AI Agent is a very powerful tool, but it shouldn't be the starting point.

The starting point should be a real workflow:

> Who is doing what, which step hurts the most, where is the data, which decisions are important, and where should AI assist without losing control?

When the workflow is clear, the agent has its place. When the workflow is unclear, an agent just makes everything look a little smarter, but the system becomes much harder to trust.

## References

- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- Andrew Ng — Writing: Agents on the Desktop / Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework

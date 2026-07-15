---
title: 'Why AI Engineers need to understand business workflows, not just models'
description: >-
  An AI Engineer doesn't just need to know prompts, RAG, or models. To create
  real value, they must understand the workflow, data, users, and how the system
  operates in practice.
pubDatetime: '2025-04-17T00:00:00.000Z'
locale: en
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

There is a fairly common mistake when first learning AI: thinking that just picking the right model, writing a good prompt, and adding RAG will result in a good product.

But when bringing AI into a real company, the problem usually isn't "which model is stronger?". The more real problems are:

- where is the data?
- who is the end user?
- what workflow are they following?
- which step is taking the most time?
- which step needs a human to review?
- if the AI gives a wrong answer, who is responsible?
- how do we know this system actually makes the business better?

That's why I think a good AI Engineer shouldn't just understand models. They need to understand the **business workflow**.

## 1. AI in a business doesn't live alone

A demo chatbot can stand alone. But an AI system in a business cannot.

It usually sits in the middle of many things:

```txt
Form / Website
    ↓
Database / CRM
    ↓
Business rules
    ↓
AI model / LLM / RAG
    ↓
Human approval
    ↓
Email / Zalo / Slack / Dashboard
```

For example, with a CRM lead processing workflow:

1. customer fills out a form on the website,
2. system saves the lead into the database,
3. AI reads the information and categorizes the potential level,
4. if the lead is good, create a deal,
5. if follow-up is needed, suggest message content,
6. employee reviews it,
7. system updates the status in the CRM.

Here, the LLM is just a small part. If the API fails, data is missing, the workflow is unclear, the lead status gets messy, or employees don't trust the AI's result, then even a good model can't save the product.

## 2. Forward Deployed Engineers show a very clear direction

Andrew Ng recently wrote about the role of an **AI Forward Deployed Engineer**: an engineer "deployed close to the customer" to customize AI solutions, understand the real problem, and implement it into the organization. On his Writing page, this is described as a new role in AI Engineering, where the engineer doesn't just build models but also helps customize the solution for the client organization.

The point I take away is: AI Engineers in reality are moving closer to being someone who knows both technology and operational processes.

Not the "I know how to use LangChain" type.

But rather:

> I understand where this process is stuck, which data is reliable, at which step AI should intervene, and which step still requires a human decision.

## 3. Business workflows help us know what AI should do, and shouldn't do

A very common mistake is turning everything into an AI Agent.

But not every step needs AI.

For example, in a CRM:

| Step | Need AI? | Reason |
|---|---|---|
| Save a new lead | Not necessarily | Normal CRUD is enough |
| Validate email/phone number | Can use rules | No need for LLM |
| Summarize customer needs | Can use LLM | Natural text data, needs context understanding |
| Lead scoring | Can use rules + ML | Needs clear metrics, not just intuition |
| Send an official quote | Should have a human review | High business risk |
| Follow-up reminder | Automation is enough | Can use workflow scheduler |

If you don't understand the workflow, it's easy to use AI in the wrong place.

AI should be placed where there is **context, unstructured data, or decisions needing support**. For clear, repetitive steps with good rules, traditional automation is usually enough.

## 4. AI creates value when it reduces friction in real work

An AI feature that sounds great on a landing page doesn't necessarily create value.

Real value usually comes from very specific things:

- reducing lead response time,
- reducing the number of data entry steps,
- reducing forgotten follow-ups,
- reducing time spent finding customer info,
- helping new employees understand transaction history faster,
- helping managers see the pipeline more clearly.

For example, instead of saying "AI CRM Assistant", I would design it more clearly:

```txt
New lead enters system
    ↓
AI summarizes customer needs
    ↓
AI suggests tags: hot lead / needs consulting / unclear needs
    ↓
AI proposes next action
    ↓
Employee reviews or edits
    ↓
CRM records activity log
```

This sounds less flashy than "AI Agent sells automatically", but it is much more practical.

## 5. We need to measure value with metrics close to the business

A model with high accuracy doesn't necessarily help the business perform better.

With an AI workflow, I look at metrics like:

- how much did lead response time decrease?
- did the on-time follow-up rate increase?
- did the number of dropped leads decrease?
- do employees actually use the AI's suggestions?
- did the quote creation time decrease?
- do customers reply faster?
- did critical errors decrease or increase?

This is a point many applied AI articles mention: model metrics and business metrics are two different things. A good AI system needs to connect both.

## 6. A small example: designing AI for a quoting process

Suppose a business has the following quoting process:

```txt
Customer asks for price
    ↓
Sales reads needs
    ↓
Find suitable product/service
    ↓
Create quote
    ↓
Send to customer
    ↓
Follow-up
```

The AI doesn't necessarily have to automatically send the quote right away. A safer way:

- AI summarizes customer requirements,
- AI suggests related products/services,
- AI creates a draft quote,
- the person in charge checks the prices and terms,
- the system sends it after approval,
- CRM automatically creates a follow-up reminder.

Here, AI helps reduce preparation time, but still keeps control at the important step.

## 7. Conclusion

An AI Engineer shouldn't just ask: "Which model is the best?"

The more correct question is:

> Which workflow hurts the most, where should AI stand in that workflow, and how do we know it actually helps the user work better?

To me, this is a very practical direction for AI Product Engineering. AI is not a decorative layer for a product. It must be plugged into the right process, the right data, the right users, and the right value-creation point.

## References

- Andrew Ng — Writing: Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf

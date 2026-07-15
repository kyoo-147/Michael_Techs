---
title: 'Operate what you build: lessons for small AI products'
description: >-
  Analyzing the ownership mindset in production engineering and how to apply it
  to AI workflows, CRMs, dashboards, and small products.
pubDatetime: '2024-03-14T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Ownership
  - Production Engineering
  - Monitoring
  - AI Product
  - DevOps
categories:
  - Product
  - Experience
---

There is a very different feeling between "finishing a feature" and "being responsible for that feature running in real life".

A feature running on your machine is one thing. A feature running with real data, real users, real errors, real costs, and real latency is another.

I like the phrase **operate what you build** because it pulls engineers away from the mindset: "once coded, it's done". With AI products, this is even more important because an error isn't just a 500 server response. An error could be the AI answering incorrectly, the workflow sending the wrong follow-up, a slow dashboard, or model drift that nobody knows about.

## Sources

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)
- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Building features is not enough

An AI lead management flow might look great in a demo:

```txt
Website form
  → CRM lead
  → AI classification
  → create follow-up message
  → update dashboard
```

But production will ask harder questions:

- what if the LLM API times out?
- what if the lead is a duplicate?
- if the follow-up message has the wrong tone, who reviews it?
- if the queue backlog increases, does the dashboard warn anyone?
- if LLM costs spike abnormally, who knows?
- if the model gives different answers after a prompt change, where is it tested?

This is the gap between a demo and a product.

## 2. Ownership means knowing where the system hurts

Operate what you build doesn't mean one person has to do everything. It means the builder understands their system well enough to:

- know which metrics are important;
- know when to alert;
- know how to rollback;
- know which data is the source of truth;
- know which errors affect real users;
- know the trade-offs between speed and safety.

With an AI workflow, I would track at least:

```txt
Workflow success rate
Workflow failure rate
LLM latency
LLM cost per workflow
Retry count
Queue depth
Human approval rate
User correction rate
```

These metrics are much more practical than just looking at "is the server alive".

## 3. AI products need human-in-the-loop at the right places

Not every step needs human approval. But there are points that should have controls:

- sending emails/quotes to clients;
- changing crucial deal stages;
- generating content with legal risks;
- responding to children or sensitive groups;
- overwriting important CRM data.

For example:

```txt
AI generates follow-up message
  → if normal lead: auto-save draft
  → if high deal value: requires human approval
  → if low confidence: add "review needed" flag
```

This is how you make AI less dangerous while remaining useful.

## 4. Monitoring is not just for the backend

A small AI product should monitor the product layer as well:

### Technical metrics

```txt
API latency
Error rate
Queue depth
Database query time
LLM timeout
```

### AI metrics

```txt
Prompt version
Model version
Evaluation score
Human correction rate
Hallucination reports
```

### Business metrics

```txt
Lead response time
Follow-up completion rate
Quote sent rate
Deal conversion
User active rate
```

If you only monitor the server, you only know the system is running. But you don't know if the product is creating value.

## 5. A very small example of a rollback

Suppose you change the prompt for AI follow-ups:

```txt
prompt_v1: polite, concise
prompt_v2: friendly, lots of upsell suggestions
```

After deploying `prompt_v2`, users start editing the messages more. The correction rate jumps from 12% to 35%.

If you don't log the prompt version, you don't know where the error came from. If you don't have feature flags, your rollback is slow. If you don't have an evaluation set, you only know when users complain.

A safer approach:

```txt
1. Version the prompt
2. Run an evaluation set before deploy
3. Canary to 10% of workspaces
4. Monitor correction rate
5. Rollback if metrics are bad
```

You don't need an overly complex system. But you must have production awareness.

## Conclusion

Operate what you build is a mindset well worth having for AI product builders.

It doesn't slow you down. On the contrary, it helps you build with more confidence. Because when you have logs, metrics, rollbacks, evals, and alerts, you dare to change the system without relying on luck.

For me, this is the boundary between an AI demo and a real AI product.

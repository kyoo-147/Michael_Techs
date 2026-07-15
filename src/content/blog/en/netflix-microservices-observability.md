---
title: 'Netflix Microservices: why is observability more important than you think?'
description: >-
  Reading Netflix's post on microservices to understand why distributed systems
  need multi-level observation: request flows, bottlenecks, and instance-level
  metrics.
pubDatetime: '2022-03-24T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Netflix
  - Microservices
  - Observability
  - Monitoring
  - Distributed Systems
categories:
  - Technical
  - AI
---

Microservices sound great when drawing an architecture diagram.

Each service is small, independent, separately deployed, and separately scaled. But when a production issue occurs, the feeling can be very different: a request goes through 8 services, 2 caches, 1 database, 1 queue, and then times out somewhere nobody knows for sure.

That is why I like Netflix's post **A Microscope on Microservices**. It doesn't talk about microservices with slogans. It talks about a very real problem: when a system is too large, a general monitoring tool is not enough. You need different "magnifications" to view the system.

## Sources

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. Microservices increase the number of questions to answer

In a monolith, when a request is slow, at least you know it's in one codebase.

In microservices, a request might travel like this:

```txt
API Gateway
  → Auth Service
  → CRM Service
  → Activity Service
  → Notification Service
  → AI Suggestion Service
  → Database / Cache / Queue
```

When a user says "the dashboard is slow", the question is no longer "which function is slow?" but rather:

- which service is slow?
- which downstream is bottlenecked?
- is it slow due to CPU, network, database, or an external API?
- is the error happening for all users or just one workspace?
- is a new deployment related?
- did p99 increase or just the average?

Without observability, the answer is usually a guess.

## 2. Netflix uses the "microscope" metaphor very correctly

In their post, Netflix talks about observing the system at multiple levels:

### 10x — request flow

Looking at which services the request passes through. Which service calls which service. Where the demand lies.

### 100x — bottleneck

When a service is slow, seeing which metrics correlate with that change: CPU, GC, downstream calls, database, errors, timeouts.

### 1000x — instance-level metrics

Sometimes the problem is on a specific instance: thread runaways, uneven CPU, anomalous hosts, metrics that only show up at high resolution.

This is a very important point: a distributed system cannot be understood with a single chart.

## 3. Observability is not just logs

Many small projects think "having logs is enough". But logs are just one part.

A basic observability suite usually includes:

```txt
Logs      → what happened?
Metrics   → is the system healthy or weak?
Traces    → where did the request go and where did it spend time?
Alerts    → when does someone need to look at it?
Dashboards→ looking at trends and comparing over time
```

For example, an AI workflow:

```txt
POST /api/leads
  → validate lead
  → save database
  → call enrichment API
  → call LLM
  → create follow-up task
  → send notification
```

If this workflow is slow, a "request timeout" log is not enough. We need to know:

- how long did the LLM call take?
- what is the error rate of the enrichment API?
- is the database insert slow?
- is the queue backlog increasing?
- are retries hammering the system with traffic?

## 4. A small example: observability for an AI workflow

I would start very simply:

### Metrics

```txt
ai_workflow_requests_total
ai_workflow_latency_ms
llm_call_latency_ms
llm_call_error_total
workflow_queue_depth
workflow_retry_total
```

### Contextual Logs

```json
{
  "workflow_id": "wf_123",
  "workspace_id": "ws_001",
  "lead_id": "lead_456",
  "step": "llm_follow_up_generation",
  "latency_ms": 2310,
  "status": "success"
}
```

### Trace

```txt
Lead Created Request
  ├── DB insert: 24ms
  ├── Enrichment API: 410ms
  ├── LLM call: 2310ms
  ├── Task creation: 18ms
  └── Notification: 90ms
```

With just this, when an error happens, we are much less blind.

## 5. Microservices shouldn't come before observability

A common mistake: splitting services too early, but having no logging, metrics, tracing, or alerting.
The result is the architecture looks more modern, but debugging is harder.

For small teams, sometimes a modular monolith + good observability is much more reliable than microservices where no one can see inside.

A more reasonable order:

```txt
1. Clear monolith/modules
2. Contextual logs
3. Basic metrics
4. Background jobs
5. Trace important flows
6. Split services only when there's a real reason
```

## Conclusion

Microservices do not naturally make a system better. They just split the system into many smaller parts. Without observability, you just turn one big bug into many small bugs that are harder to find.

For small AI products, the lesson is very clear: before talking about large scale, make your system observable first. Knowing where the request goes, how long it takes, and at what step it fails — just that alone helps the product mature tremendously.

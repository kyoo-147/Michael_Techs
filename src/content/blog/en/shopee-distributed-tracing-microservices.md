---
title: >-
  Shopee and distributed tracing: how to watch a request go through
  microservices?
description: >-
  Analyzing Shopee's use of ClickHouse for distributed tracing and lessons for
  multi-service systems.
pubDatetime: '2022-06-14T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Shopee
  - Distributed Tracing
  - ClickHouse
  - Microservices
  - Observability
categories:
  - Technical
draft: false
---

## Introduction

When a system is small, logs are usually enough.

But when a request has to go through multiple services, databases, queues, and external APIs, the question "where is the error?" starts becoming annoying.

Shopee's use of ClickHouse for distributed tracing is a good example to understand why observability is not just about pretty dashboards, but the ability to see the real path of a request through the system.

### 1. The problem with microservices

A simple workflow on the UI can hide many steps behind it:

```text
User request
→ API Gateway
→ Auth Service
→ Order Service
→ Payment Service
→ Notification Service
→ Database
→ External Provider
```

If a request is slow, just looking at individual service logs makes it very hard to know where the bottleneck is.

Distributed tracing solves this by attaching a trace id to the request, then tracking which services that request goes through, how long each step takes, and which step fails.

### 2. Shopee uses tracing to see the "big picture"

According to ClickHouse's article, Shopee needed visibility in a complex microservices architecture. Distributed tracing helps track a request as it traverses multiple services, making it faster to find bottlenecks or errors.

The notable point is that Shopee uses ClickHouse as the storage/query engine for tracing data. This is a logical choice because trace data is usually very large, with many rows, and needs fast querying by time, service, trace id, latency, or error.

### 3. Lessons for smaller systems

A small CRM/AI workflow doesn't need a massive tracing platform from the start. But the pattern remains the same.

For example, a lead entering the system:

```text
Website Form
→ Lead API
→ CRM Database
→ Enrichment Service
→ AI Scoring
→ Message Workflow
→ Dashboard
```

If a customer reports "the lead didn't get a follow-up message", we need to know where the error is:

- the form didn't send the request;
- the API validation failed;
- the database insert failed;
- AI scoring timed out;
- the message provider had an error;
- the dashboard hasn't refreshed.

If every step has the same `trace_id`, debugging will be much easier.

### 4. What might a simple trace look like?

```json
{
  "trace_id": "lead_20260623_001",
  "steps": [
    {"service": "lead-api", "status": "ok", "latency_ms": 42},
    {"service": "crm-db", "status": "ok", "latency_ms": 18},
    {"service": "ai-scoring", "status": "timeout", "latency_ms": 5000},
    {"service": "follow-up-worker", "status": "skipped"}
  ]
}
```

Just looking at this shows the problem is in AI scoring. No guessing needed.

### 5. Conclusion

Tracing isn't just for Big Tech. Big Tech uses it at a large scale, but the mindset behind it is very suitable for small products: when a system has multiple steps, there must be a way to see which steps a request goes through.

A good system shouldn't just run during a demo. It must be debuggable when there is an error.

## References

- ClickHouse — Seeing the Big Picture: Shopee's Journey to Distributed Tracing with ClickHouse: https://clickhouse.com/blog/seeing-the-big-picture-shopees-journey-to-distributed-tracing-with-clickhouse
- ClickHouse video — Distributed Tracing in ClickHouse at Shopee: https://clickhouse.com/videos/distributed-tracing-clickhouse-shopee

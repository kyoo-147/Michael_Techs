---
title: 'Monitoring AI workflows: learning from Netflix but applying at small scale'
description: >-
  Designing just enough monitoring for small AI workflows: logs, metrics,
  traces, evaluation, and business signals.
pubDatetime: '2023-06-08T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Monitoring
  - AI Workflow
  - Netflix
  - Observability
  - Logs
  - Metrics
categories:
  - Technical
  - AI
---

Monitoring for an AI workflow shouldn't start with a beautiful dashboard.

It should start with a simpler question: **when the workflow fails, do I know where it failed?**

I read Netflix's posts on observability and found one very clear point: large systems need a lot of "magnification" to debug. But with small products, we don't need to bring the whole Netflix system over. We just need to take the right mindset and build a "just enough" version.

## Sources

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. AI workflows have more failure points than we think

Take a CRM workflow for example:

```txt
Lead is created
  → check data
  → enrichment
  → call LLM for classification
  → generate follow-up message
  → save to CRM
  → send notification
  → update dashboard
```

When the workflow fails, the cause could be:

- lead data is missing;
- enrichment API times out;
- LLM returns wrong format;
- new prompt version produces worse output;
- database lock/slow;
- queue is backlogged;
- notification provider error;
- frontend caches old data.

If we don't monitor each step, we only see one line: "workflow failed".

That line is almost useless.

## 2. Three layers of monitoring you should have

### Layer 1: Technical health

```txt
request_count
error_rate
latency_p95
latency_p99
queue_depth
retry_count
database_query_time
```

It answers: is the system running smoothly?

### Layer 2: AI behavior

```txt
model_name
prompt_version
output_parse_error_rate
evaluation_score
human_correction_rate
low_confidence_rate
```

It answers: is the AI generating decent outputs?

### Layer 3: Product impact

```txt
lead_response_time
follow_up_created_count
follow_up_sent_count
quote_created_count
deal_stage_conversion
user_acceptance_rate
```

It answers: is the workflow creating value?

## 3. Logs must have context

Logs like this are not enough:

```txt
Error: LLM failed
```

Logs should have context:

```json
{
  "event": "workflow.step_failed",
  "workflow_id": "lead_follow_up_v1",
  "run_id": "run_789",
  "workspace_id": "ws_001",
  "lead_id": "lead_123",
  "step": "generate_follow_up_message",
  "model": "gpt-4.1-mini",
  "prompt_version": "followup_v3",
  "error_type": "json_parse_error",
  "latency_ms": 2840
}
```

You don't need to log too much, but logs must help the reader know what is happening.

## 4. Trace a workflow like a story

A good trace is like a timeline:

```txt
run_789
  ├── validate_lead: 12ms
  ├── enrich_company: 430ms
  ├── classify_lead: 910ms
  ├── generate_follow_up: 2840ms
  ├── parse_output: failed
  └── fallback_to_draft_template: 18ms
```

Looking at this trace, we know immediately the problem is at the parse output step, not the database or the frontend.

## 5. Few but correct alerts

A small system doesn't need 50 alerts. If there are too many alerts, eventually no one reads them.

I would start with a few alerts:

```txt
Workflow failure rate > 5% in 10 minutes
Queue depth increases continuously for 15 minutes
LLM timeout rate > 10%
Output parse error spikes
Human correction rate increases after prompt change
```

The last point is very important: don't just alert on technical issues, but also on AI quality.

## Conclusion

Monitoring for AI workflows doesn't need to start complex. But it must start right.

First, logs with context.  
Then, metrics for each step.  
Then, traces to understand the flow.  
Finally, evaluation and business metrics to know if the AI is truly useful.

An unobservable AI workflow is just a pretty black box. It runs today, but nobody knows where it fails tomorrow.

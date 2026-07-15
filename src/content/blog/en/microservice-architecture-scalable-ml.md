---
title: Microservice Architecture Patterns for Scalable ML Systems
description: >-
  Practical notes on how to break a Machine Learning system into smaller
  services to make it easier to deploy, monitor, and scale.
pubDatetime: '2022-12-01T00:00:00.000Z'
locale: en
author: Michael
tags:
  - ML Systems & MLOps
  - Microservices
  - ML Systems
  - Scalable Architecture
  - Deployment
  - Monitoring
  - Recommendation Systems
categories:
  - Technical
  - AI
---

There is a very common misconception when learning Machine Learning: we think that making a good model is the end of the road.

But in a real product, the model is just a small part. The rest is where data comes in, how the model is deployed, which service calls the model, how we know when it fails, whether a new version breaks the old workflow, and if traffic spikes, can the system handle it?

That's why I wanted to read about **microservice architecture for ML systems**. Not because microservices are always good, but because it forces us to look at ML as a production system, not just a notebook that runs once and sits there.

## 1. The real problem

A simple ML system usually starts like this:

```txt
Data → Train model → Save model → API predict → Frontend displays results
```

In the demo phase, this flow is fine.

But when going into production, things start getting more complex:

- data changes over time;
- the model has multiple versions;
- inference needs low latency;
- some tasks need to run in the background;
- some services need to scale more than others;
- errors can be in data, model, API, queue, database, or frontend;
- without good monitoring, the model dies silently without anyone knowing.

The paper *Microservice Architecture Patterns for Scalable Machine Learning Systems* describes a direction of breaking ML workflows into independent services instead of keeping everything in a monolith. The main idea is: training, inference, preprocessing, monitoring, and deployment can be packaged into separate components to make them easier to scale and operate.

## 2. Microservices shouldn't be seen as just a trend

Microservices don't mean splitting things as small as possible.

If the project is small, splitting too early will make the system more chaotic: more repos, more APIs, more configs, more points of failure. But if the system starts having many different types of workloads, microservices make sense.

For example, in an AI workflow:

```txt
Frontend CRM
  ↓
Backend API
  ↓
Workflow Service
  ↓
LLM Service / ML Inference Service
  ↓
Database + Vector Database + Logging
```

Here, `Backend API` and `ML Inference Service` do not necessarily scale the same way. The CRM dashboard might have many read data requests, while the inference service might be more GPU/CPU intensive. If kept in the same app, optimization will be harder.

## 3. An easy-to-understand way to split services

With a practical ML system, it can be divided into the following groups:

### Data Service

Responsible for fetching data, validating schemas, cleaning data, and saving metadata.

For example:

```txt
lead_events
customer_profiles
conversation_logs
product_catalog
```

In a CRM, this service ensures lead data doesn't lack emails, phones, sources, stages, or timestamps.

### Training Service

Responsible for training or fine-tuning models. This service doesn't necessarily run continuously. It can run on a schedule or by triggers.

```txt
new labeled data → train model → evaluate → register version
```

### Inference Service

This is the part that receives requests and returns predictions.

For example:

```http
POST /predict/lead-score
{
  "lead_source": "website",
  "industry": "restaurant",
  "last_message": "I need a CRM demo"
}
```

Response:

```json
{
  "score": 0.82,
  "priority": "high",
  "reason": "Lead requested a demo and provided business context"
}
```

### Monitoring Service

Tracks latency, error rates, input distributions, output distributions, and business metrics.

This is a part many people skip. But production ML without monitoring is like driving at night without turning on the headlights.

### Workflow Service

Responsible for connecting the model to business actions.

For example:

```txt
lead score > 0.8
→ create deal
→ send follow-up
→ remind sales to call back
→ update CRM activity
```

A model doesn't create value on its own. The workflow is where value appears.

## 4. Small example: AI lead scoring for a CRM

Suppose I build a workflow for OneClick CRM:

> When a customer fills out a form on the website, the system automatically analyzes the lead, scores it, creates a deal, and proposes a follow-up.

A simple design could be:

```txt
Website Form
  ↓
Lead API Service
  ↓
Database
  ↓
Lead Scoring Service
  ↓
Workflow Automation Service
  ↓
Notification / Email / CRM Update
```

If lead scoring fails, the system should still save the lead. You shouldn't let a model failure cause customer data loss.

A principle I've learned is:

> An ML service should add value to the workflow, but it shouldn't kill the workflow completely if the model fails.

So a fallback can be used:

```txt
If model fails → use temporary rule-based score → mark for review
```

## 5. Monitoring in an ML system requires looking at multiple layers

With a normal backend, we usually monitor:

- request count;
- error rate;
- latency;
- CPU/RAM;
- database query time.

With an ML system, we need to add:

- is the input data skewed?
- is the output unusual?
- what model version is running?
- are predictions creating the right business actions?
- do offline metrics still reflect real metrics?

For example, a lead scoring model suddenly scores 95% of leads as `high priority`. The backend is still running, API still returns 200 OK, but the product might be wrong.

## 6. Trade-offs

Microservices help:

- scale each part independently;
- deploy models separately from the main backend;
- rollback more easily;
- clarify responsibilities for each service;
- make it easier to monitor each layer.

But they also increase:

- operational complexity;
- network latency;
- logging/monitoring costs;
- risk of version mismatches;
- require higher DevOps skills.

So for a small project, I think we should start with a **modular monolith** first:

```txt
One repo, one backend, but clear modules:
- leads
- workflows
- inference
- monitoring
- notifications
```

When a part truly needs to scale separately, that's when you split the service.

## 7. Conclusion

Microservices in ML aren't just to look "enterprise". They only make sense when they make the system easier to deploy, scale, debug, and rollback.

The most important thing I learned is: production ML isn't just a model. It's a chain of services, data, APIs, monitoring, and business workflows running together.

If a good model isn't deployed properly, monitored correctly, or tied to concrete actions, it remains just an experiment.

## References

- [Microservice Architecture Patterns for Scalable Machine Learning Systems](https://arxiv.org/abs/2603.13672)
- [Design, Monitoring, and Testing of Microservices Systems: The Practitioners' Perspective](https://arxiv.org/abs/2108.03384)
- [ElasticRec: A Microservice-based Model Serving Architecture Enabling Elastic Resource Scaling for Recommendation Models](https://arxiv.org/abs/2406.06955)

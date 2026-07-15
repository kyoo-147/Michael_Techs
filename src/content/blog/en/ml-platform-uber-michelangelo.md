---
title: What blocks does an ML platform need? Learning from Uber Michelangelo
description: >-
  Analyzing Uber Michelangelo to understand that a production ML platform needs
  data, training, deployment, prediction, and monitoring.
pubDatetime: '2022-02-17T00:00:00.000Z'
locale: en
author: Michael
tags:
  - ML Systems & MLOps
  - Uber
  - Michelangelo
  - ML Platform
  - Model Serving
  - Monitoring
categories:
  - Technical
  - AI
draft: false
---

## Introduction

An ML model that runs well in a notebook is not an ML system.

Production ML needs much more: right data, reproducible training, safe deployment, stable prediction, post-deployment monitoring, and the ability to rollback when errors occur.

Uber Michelangelo is a classic case study to understand why big companies need ML platforms.

### 1. What problem does Michelangelo solve?

According to Uber Engineering, Michelangelo was designed to help teams build, deploy, and operate machine learning solutions at Uber's scale.

It covers the end-to-end ML workflow:

- data management;
- training;
- evaluation;
- deployment;
- prediction;
- monitoring.

Simply put, Michelangelo attempts to turn ML from isolated projects into a common platform.

### 2. Why is an ML platform necessary?

When every team builds their own custom pipeline, problems emerge:

- training and serving data are inconsistent;
- models are hard to reproduce;
- manual deployment;
- not knowing if the model is drifting or not;
- no way to track prediction quality;
- every project has to reinvent the wheel.

An ML platform is born to reduce those repetitive parts.

### 3. What could a minimalist ML platform include?

For a small project, you don't need to build Michelangelo. But you can learn its structure:

```text
Data Source
→ Feature / Dataset Version
→ Training Pipeline
→ Evaluation Report
→ Model Registry
→ Model Serving API
→ Monitoring
→ Rollback
```

An extremely compact version for a portfolio:

```text
PostgreSQL / CSV
→ Training script
→ Evaluation metrics
→ Saved model
→ FastAPI endpoint
→ Docker deployment
→ Basic logs + latency metrics
```

### 4. Example: lead scoring in a CRM

A CRM that wants to score leads might need:

- lead data;
- interaction history;
- deal results;
- feature extraction;
- model training;
- an API to predict scores;
- a dashboard to display scores;
- monitoring to see if the score is still useful.

If you just train a model and stop, the system hasn't created much value. Value lies in the score entering the workflow: which lead to call first, which follow-up to send, which quote to prioritize.

### 5. Conclusion

Uber Michelangelo shows that an ML platform is not a luxury. It is a natural reaction when ML enters production and multiple teams use it.

For small projects, you don't need to copy the whole thing. But you should learn the principle: ML must have a clear lifecycle, not just a notebook.

## References

- Uber Engineering — Meet Michelangelo: Uber's Machine Learning Platform: https://www.uber.com/us/en/blog/michelangelo-machine-learning-platform/
- Uber Engineering — Scaling Machine Learning at Uber with Michelangelo: https://www.uber.com/us/en/blog/scaling-michelangelo/

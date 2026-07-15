---
title: Why a good model doesn't necessarily create business value?
description: >-
  A note from the Booking.com case: model performance and business performance
  are two different things, especially when ML goes into a real product.
pubDatetime: '2024-04-11T00:00:00.000Z'
locale: en
author: Michael
tags:
  - ML Systems & MLOps
  - ML Evaluation
  - Business Metrics
  - Model Performance
  - A/B Testing
  - Product Impact
categories:
  - AI
  - Product
---

There is a phrase I think AI Engineers should remember early on:

> A good model on a benchmark doesn't necessarily make a better product.

It sounds a bit annoying, because when learning Machine Learning we are usually taught to optimize accuracy, precision, recall, F1, and loss. Those metrics are important. But in a real product, they are not the final answer.

Booking.com has a very readable paper: **150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com**. They analyzed about 150 deployed ML applications for customers, and one of the big lessons was: **model performance is not the same as business performance**.

## 1. How are model metrics and business metrics different?

Model metrics answer the question:

```txt
Did the model predict correctly?
```

Business metrics answer the question:

```txt
Did that prediction make the product better?
```

These two questions are close, but not the same.

For example, a model predicts which lead is likely to buy. Offline evaluation shows the model has a good AUC, good precision. But when integrated into the CRM, sales doesn't use it because:

- the reason for the prediction is unclear;
- the lead score updates too slowly;
- the suggestion doesn't match how sales works;
- the model prioritizes "easy to predict" leads, not high-value leads;
- the workflow after the prediction is not well designed.

Result: the model is more accurate, but the business doesn't improve.

## 2. A very everyday example

Suppose there is an AI scoring leads:

```txt
Lead A: score 0.91
Lead B: score 0.77
Lead C: score 0.64
```

If we only look at the model, we would say Lead A should be prioritized.

But the business might ask more:

- Does Lead A have a budget?
- Does Lead A need to buy right now?
- Is Lead A in an industry we serve well?
- Does sales have enough context to call?
- If we call this lead, what is the probability of converting into a real deal?

Therefore, a good AI workflow shouldn't just display a score. It needs to turn the score into an action:

```txt
Lead A scored high because they requested a demo, provided a clear description of needs, and came from a suitable industry.
Suggestion: call within the next 2 hours, send proposal template A if they reply.
```

The model score is just one part. The next action is where value is created.

## 3. Why is A/B testing important?

Booking.com emphasizes testing business impact with randomized controlled trials/A/B testing. The reason is because many changes look reasonable on paper but fail to create an uplift in the real product.

With an ML product, A/B testing can answer:

```txt
Does the group using AI suggestions have a better close rate?
Does the group using the new ranking have a better click-through rate?
Does the group receiving automated follow-ups reply more?
```

If we don't test, we easily fall into the feeling "the model is better, so the product must be better".

But a real product has real users, real behavior, real annoyances. There are things offline metrics can't see.

## 4. Proxy metrics can deceive you

A common mistake is optimizing proxy metrics.

For example:

```txt
Increase clicks
Increase time spent on page
Increase AI-generated messages
Increase recommendations shown
```

But more clicks isn't necessarily good. More messages don't necessarily help sales. More recommendations aren't necessarily timely.

With a CRM, better metrics could be:

```txt
lead response time decreases
number of forgotten follow-ups decreases
stage conversion rate increases
sales spends less time on data entry
customers receive clearer responses
```

Meaning, the metric must be tied to a real workflow.

## 5. A small checklist before deploying a model

Before putting a model into a product, I think we should ask:

1. What decision does this model help users make?
2. Is the prediction explained enough for the user to trust it?
3. If the model is wrong, what are the consequences?
4. Is there a fallback?
5. Are decisions and outcomes logged?
6. Are business metrics measured after deployment?
7. Is there a rollback plan?

For example, with AI follow-up in a CRM:

```txt
Model task: suggest follow-up content
User action: sales reviews and sends
Business metric: response rate, time-to-follow-up, deal stage movement
Safety: don't auto-send if confidence is low or context is missing
Fallback: use manual template
```

When written clearly like this, the model starts becoming part of a product system.

## 6. Lessons for AI product builders

What I take away is: AI Engineers shouldn't just talk using model metrics. They must learn to talk using business workflows.

Not to turn engineers into salespeople, but to know if the system we built actually solves the problem.

A good model should answer both sides:

```txt
Technically: is the model accurate enough, stable, and is latency appropriate?
Product-wise: does the model help users work better?
```

If it only has the first part, it's a research/demo.
If it has both, then it's an applied AI product.

## 7. Conclusion

A good model is a necessary condition. But business value comes from the whole system: the right data, the right UX, the right workflow, the right metrics, the right monitoring, and the right feedback loop.

I think this is a very important lesson for people working in AI today. Because AI is easier to build demos for than ever before. But a running demo doesn't mean a value-creating product.

## References

- [150 Successful Machine Learning Models: 6 Lessons Learned at Booking.com](https://booking.ai/150-successful-machine-learning-models-6-lessons-learned-at-booking-com-681e09107bec)
- [150 Successful Machine Learning Models — ACM Digital Library](https://dl.acm.org/doi/10.1145/3292500.3330744)
- [The Morning Paper: 150 Successful Machine Learning Models](https://blog.acolyer.org/2019/10/07/150-successful-machine-learning-models/)

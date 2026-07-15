---
title: 'Feed ranking and feedback loops: lessons for product builders'
description: >-
  Explaining the feedback loop in recommendation systems and how product
  builders should design signals, metrics, and guardrails.
pubDatetime: '2022-11-03T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Feed Ranking
  - Feedback Loop
  - Product Design
  - Recommendation
  - User Behavior
categories:
  - AI
  - Product
---

Feed ranking is a very fascinating problem because it seems simple: there is a lot of content, choose which one to put first.

But after a while, the feed doesn't just reflect user preferences. It begins to reciprocally affect preferences, behavior, beliefs, and how users interact with the product.

That is the feedback loop.

I write this post as a note for product builders: if you ever build CRM recommendations, AI suggestions, content feeds, search rankings, or next-best-actions, you need to understand this loop before touching complex models.

## Sources

- TikTok Newsroom — [How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- arXiv — [The Feedback Loop Between Recommendation Systems and Reactive Users](https://arxiv.org/abs/2504.07105)
- arXiv — [Dynamics of Algorithmic Content Amplification on TikTok](https://arxiv.org/abs/2503.20231)

## 1. What is a feedback loop?

A recommendation loop usually looks like this:

```txt
System recommends item
  → user views / ignores / clicks / likes / buys / edits
  → system logs the signal
  → model/ranking changes
  → next recommendation is affected
```

It looks good. What the user likes, the system learns.

But the problem is the system is also **shaping what the user will see next**. If it only optimizes one metric like watch time or clicks, the system can gradually push the user into a narrower content zone.

In workplace products, the loop also exists. If a CRM constantly suggests "send discount follow-up" and the user chooses it because it's fast, the system might learn that discounts are good actions, even though long-term it reduces margin.

## 2. User signals are not neutral

A click does not always mean a like.

A user might click because:

- curiosity;
- shocking title;
- no better options;
- by mistake;
- just checking;
- wants to remove it from the list;
- pushed into it by the UI.

Similarly, in a CRM:

```txt
User selects AI suggestion
```

Doesn't mean the suggestion was good. They might choose it because they are too lazy to rewrite. Therefore, we need subsequent signals:

- did they edit it?
- was the message actually sent?
- did the customer reply?
- did the deal progress?
- did the user undo it?

## 3. Ranking should have multiple goals

A feed that only optimizes engagement might feel "addictive", but that's not necessarily good.

A CRM suggestion system shouldn't just optimize "user clicks suggestion". It should balance:

```txt
- usefulness
- user trust
- business outcome
- safety
- diversity of actions
- long-term value
```

For example:

```txt
Score(action) =
  relevance_score
  + urgency_score
  + business_value_score
  - risk_score
  - repetition_penalty
```

Initially, it can be rule-based. You don't need ML right away.

## 4. Exploration is easily forgotten

If a system always recommends what's winning, it will rarely try new things. Over time, recommendations get stuck.

With a content feed, this makes users feel it's repetitive.
With a CRM, this makes the team only try a few familiar actions.

A simple approach:

```txt
80% exploit: choose the best current action
20% explore: try other reasonable actions
```

But exploration in a business tool must have limits. You can't "experiment" by sending risky emails to major clients. You can explore at the draft level, not auto-send.

## 5. Guardrails for the feedback loop

I would set a few guardrails:

- don't use a single metric;
- avoid repeating the same type of suggestion too much;
- let the user say "not useful";
- log why an action was suggested;
- measure correction rate;
- distinguish between click, accept, complete, and outcome;
- require human approval for risky actions.

For example, the UI should show:

```txt
Suggested because:
- Customer has not replied for 3 days
- Quote was sent but not viewed
- Similar deals often need a follow-up call
```

Simple explanations help users trust the system more.

## Conclusion

The feedback loop is the heart of a recommendation system. But it is also where the product can easily skew itself.

For product builders, the lesson isn't "build an algorithm like TikTok". The lesson is: design the signals, metrics, and guardrails first. Models only learn well when the product's data loop is clear and healthy enough.

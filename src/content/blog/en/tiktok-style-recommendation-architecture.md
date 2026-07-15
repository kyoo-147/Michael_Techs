---
title: >-
  TikTok-style recommendation: why is architecture as important as the
  algorithm?
description: >-
  Analyzing TikTok-style feeds through official sources and academic research to
  understand the role of platform architecture in recommendations.
pubDatetime: '2022-07-28T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - TikTok
  - Recommendation System
  - Platform Architecture
  - Feed Ranking
  - Algorithms
categories:
  - Technical
  - AI
---

When talking about TikTok, people often say: "its algorithm is too powerful".

That is partly true. But if we only talk about the algorithm, we miss half the story: **TikTok's product architecture also creates conditions for more powerful recommendations**.

A full-screen feed, one video at a time, extremely clear watch time signals, fast swiping behavior, little dependence on social graphs. These things are not just UI. They are data collection surfaces, they are feedback loops, they are how the product teaches the model to understand the user.

This post isn't trying to reverse-engineer TikTok. I just read TikTok's official sources and some academic research to understand why architecture is just as important as the algorithm.

## Sources

- TikTok Newsroom — [How TikTok recommends videos #ForYou](https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you)
- TikTok Support — [For You](https://support.tiktok.com/en/getting-started/for-you)
- arXiv — [Platform architecture determines whether recommendation algorithms can shape information quality on social media](https://arxiv.org/abs/2605.19204)

## 1. What does TikTok say about the For You feed?

According to TikTok's official description, the For You feed reflects each user's unique preferences. The ranking system is based on multiple groups of signals, including user interactions, video information, and certain device/account settings.

Interaction signals can include:

- videos you like/share/comment;
- accounts you follow;
- content you create;
- videos you watch to the end or skip;
- content you mark as not interested.

Simply put: the feed doesn't just learn from what you say you like, it learns from very small behaviors.

## 2. Product architecture generates good signals

TikTok has a very clear advantage: every time a user watches a video, the system receives fairly clean feedback.

```txt
Video A
  → watched 2 seconds then swiped
Video B
  → watched to the end
Video C
  → rewatched
Video D
  → liked + shared
```

For each item, the system can easily measure:

- watch time;
- completion rate;
- rewatch;
- skip;
- like;
- share;
- comment;
- follow after watching.

An endless short-video feed UI creates an extremely fast loop:

```txt
recommend → user reacts → collect signal → update ranking → recommend again
```

In many other products, signals are blurrier. For example, CRM search: a user clicking a customer doesn't necessarily mean it's a good result. They might click out of curiosity, because there are no other options, or because the name is similar.

## 3. What does the platform architecture paper say?

A 2026 paper on arXiv discusses how platform architecture and recommendation algorithms jointly affect information quality. The paper simulates various architectures: tree like Reddit, hierarchy like Facebook, network like Twitter, and complete graph like TikTok.

A notable point: the authors suggest that in more fluid platforms, algorithms have a stronger ability to shape information spread. With a structure like TikTok, popularity-based recommendations can create winner-take-all dynamics.

I read this part as a reminder: recommendations don't exist in a vacuum. They live within the product architecture.

## 4. Lessons for product builders

If you are building a small recommendation system, don't start with the question "which model to use?".

Ask first:

- what is an item?
- which user feedback is the clearest?
- which feedback is easily noisy?
- does the UI make the signal clearer?
- does the system need exploration?
- does it need to avoid repeating content?
- does the optimized metric cause side effects?

For example, in a CRM, "next best action" suggestions could be based on:

```txt
- which action the user chose
- which action the user ignored
- which action led to a real follow-up
- which action helped move the deal stage
- which action was heavily edited
```

But if the UI doesn't record skips/corrections, the model will lack feedback. Then, no matter how good the ranking is, it will be hard to improve.

## 5. A small recommendation flow for CRM

```txt
Candidate actions:
  - Call customer
  - Send follow-up email
  - Create quote
  - Schedule meeting
  - Mark as cold lead

Features:
  - deal stage
  - last activity time
  - lead source
  - customer segment
  - previous response behavior

Ranking:
  - rule-based baseline first
  - then ML if there is enough data

Feedback:
  - accepted
  - ignored
  - edited
  - completed
  - resulted in conversion
```

The first version doesn't need deep learning. What it needs is the right feedback loop.

## Conclusion

TikTok is powerful not just because of its algorithm. It's powerful because its product, UI, data, feedback loop, and algorithm are designed to feed each other.

For a small AI product, this is a lesson well worth keeping: before asking which model is best, design the system to capture the best signals. Because without a good feedback loop, a recommendation is just a list sorted to look smart.

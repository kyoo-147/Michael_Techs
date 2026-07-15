---
title: Does TikTok use Kafka/Flink for real-time recommendation?
description: >-
  A fact-checking post: what public sources allow us to say and not say about
  Kafka/Flink in TikTok's recommendation.
pubDatetime: '2022-09-06T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Kafka
  - Flink
  - Real-time ML
  - Source Check
categories:
  - Technical
  - AI
draft: false
---

## Introduction

The question "Does TikTok use Kafka/Flink for real-time recommendation?" sounds very reasonable, as real-time recommendation systems often need event streaming and stream processing.

But reasonable doesn't mean correct.

Based on the public sources I checked, TikTok has official articles explaining the For You feed at the product/recommendation signal level, but I haven't seen an official source explicitly state that TikTok uses Kafka or Flink in its recommendation pipeline.

So this post doesn't assert that TikTok uses Kafka/Flink. This post simply separates: what is known, what is just a common pattern, and what shouldn't be written as fact.

### 1. What do TikTok sources say?

TikTok says the For You feed is recommended by ranking videos based on multiple factors like user interactions, video information, and device/account settings. TikTok also has support documents saying recommender systems use preferences informed by interactions like following accounts or liking posts.

Thus, we know TikTok has a recommendation system that uses user behavior signals.

But these sources do not specify:

- whether Kafka is used;
- whether Flink is used;
- what the event streaming architecture looks like;
- what the feature store or online inference pipeline specifically entails.

### 2. What are Kafka and Flink usually used for?

Apache Kafka is an event streaming platform. It's usually used to ingest, store, and process streams of events.

Apache Flink is a stream processing framework, used for processing data streams with state, window, event time, and real-time analytics/processing problems.

In a general real-time recommendation system, Kafka/Flink might appear in parts like:

```text
User event
→ Event stream
→ Stream processing
→ Feature update
→ Online inference
→ Ranking result
```

But this is a general pattern, not a definitive statement about TikTok.

### 3. How to write correctly

Do not write:

```text
TikTok uses Kafka/Flink for real-time recommendation.
```

Should write:

```text
TikTok publicly states its For You feed is based on interaction signals and ranking. For real-time recommendation systems in general, event streaming and stream processing are two common technical blocks; Kafka and Flink are popular examples for these two technology groups. However, there are not enough public sources to assert that TikTok uses Kafka/Flink in its recommendation pipeline.
```

Writing like this sounds less "cool", but it is more accurate.

### 4. Lessons for small AI products

For a small CRM, you don't need Kafka/Flink initially. If there are only a few thousand events/day, a simple queue or background job is enough.

When should you think about Kafka/Flink?

- large event volume;
- multiple services consuming events;
- need for replay/backfill;
- need for real-time analytics;
- need for stateful stream processing;
- batch pipelines are too slow for the product.

Example of a small CRM:

```text
lead_created
→ background job enrich lead
→ AI scoring
→ update dashboard
```

No Kafka needed yet.

A larger CRM:

```text
lead_created
message_sent
quote_opened
deal_updated
→ event stream
→ multiple consumers
→ real-time scoring
→ analytics dashboard
```

At this point, event streaming starts to make more sense.

### 5. Conclusion

A good technical blog post doesn't need to pretend to know TikTok's internal architecture. Just state the facts: what signals TikTok publishes, what kind of problems Kafka/Flink solve, and when a small system really needs them.

If you don't know, say you don't know. That's also a part of engineering.

## References

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- Apache Kafka — Introduction: https://kafka.apache.org/intro
- Apache Flink — What is Apache Flink?: https://flink.apache.org/what-is-flink/

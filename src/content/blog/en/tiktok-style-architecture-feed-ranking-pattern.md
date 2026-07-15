---
title: >-
  TikTok-style architecture: should be understood as a feed ranking pattern, not
  an internal diagram
description: >-
  A cautious post about TikTok-style architecture: using only public sources to
  derive product patterns, without asserting internal architecture.
pubDatetime: '2022-08-16T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Recommendation Systems
  - TikTok
  - Feed Ranking
  - Product Architecture
  - Personalization
categories:
  - Technical
  - AI
draft: false
---

## Introduction

The phrase "TikTok-style architecture" sounds very appealing, but it's also easy to overstate.

Without official engineering documentation, one shouldn't draw a diagram and assert "TikTok uses Kafka/Flink/feature store like this". That's making things up.

A safer approach is to look at what TikTok publicly says about the For You feed, and then derive common patterns of a modern feed ranking system.

### 1. What does TikTok officially say?

TikTok says the For You feed is personalized for each user. The system recommends content by ranking videos based on multiple factors, starting from the interests users express, and then adjusting according to what the user is interested or not interested in.

The signals mentioned include:

- user interactions;
- video information;
- device/account settings.

TikTok also says they try to diversify recommendations, not just repeating the same type of content a user has liked.

### 2. Patterns that can be derived

From public sources, we can say a feed ranking system usually needs:

```text
User signals
→ Content candidates
→ Ranking
→ Diversity / safety rules
→ Feed result
→ New feedback signals
```

In which the feedback loop is a very important part. Users watch, swipe, like, follow, comment, click "not interested" — all of these become signals for the feed to continue adjusting.

### 3. What should not be asserted

Should not write:

```text
TikTok uses Kafka and Flink for real-time recommendation.
```

If there are no official sources or clear technical papers.

Can write more cautiously:

```text
A real-time feed ranking system often might need event streaming and stream processing. Kafka/Flink are two popular technologies for this group of problems, but TikTok's public sources are not enough to assert that TikTok uses them in a specific way.
```

This is the difference between responsible technical analysis and guessing.

### 4. Applying to CRM/AI workflows

A CRM can also learn the feed ranking pattern, but at a smaller scale:

```text
Lead events
→ Candidate next actions
→ Scoring/ranking
→ Business rule
→ Suggested action
→ User feedback
```

For example, if sales ignores a suggestion or a customer doesn't respond, the system should record it. If a quote is opened multiple times, the lead can be prioritized higher.

### 5. Conclusion

"TikTok-style architecture" should be understood as a pattern about feedback-rich products, personalization, and continuous ranking, not an internal diagram of TikTok.

When writing technical blogs, an important part is knowing the boundaries: what the source says, what we infer, and what we are not allowed to assert.

## References

- TikTok Newsroom — How TikTok recommends videos #ForYou: https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you
- TikTok Support — How TikTok recommends content: https://support.tiktok.com/en/using-tiktok/exploring-videos/how-tiktok-recommends-content
- TikTok Newsroom — Safeguard and diversify recommendations: https://newsroom.tiktok.com/en-us/an-update-on-our-work-to-safeguard-and-diversify-recommendations

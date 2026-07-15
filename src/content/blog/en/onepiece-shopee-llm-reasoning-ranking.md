---
title: 'OnePiece at Shopee: How LLM-style reasoning enters a ranking system'
description: >-
  Notes on the OnePiece paper and how context engineering and reasoning are
  introduced into an industrial cascade ranking system.
pubDatetime: '2024-01-18T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - Ranking System
  - Industrial Recommender
  - LLM Reasoning
categories:
  - Technical
  - AI
  - Product
draft: false
---

## Introduction

When hearing "LLM-style reasoning", many people immediately think of chatbots. But Shopee's OnePiece paper shows another direction: bringing context engineering and reasoning ideas into an industrial ranking/recommendation system.

This is quite interesting, because ranking systems have traditionally been viewed as a pipeline of retrieval → ranking → reranking, optimizing CTR, CVR, GMV, or some business metric.

OnePiece asks the question: if LLMs get stronger thanks to context and reasoning, can ranking models learn a part of that mindset?

### 1. A ranking system is not just model scoring

In e-commerce, ranking is not simply "sorting products from good to bad".

A ranking system must consider:

- who the user is;
- what they just searched for;
- what they clicked/bought before;
- what the current context is;
- which products are potentially a good fit;
- which business metric is being optimized.

The pipeline is usually a cascade:

```text
Candidate Retrieval → Ranking → Reranking → Final List
```

Each layer filters out the number of items and increases precision.

### 2. OnePiece brings context engineering to ranking

According to the paper, OnePiece brings two ideas from LLMs into retrieval/ranking:

- **structured context engineering:** enriching the input with interaction history, preferences, and scenario signals;
- **block-wise latent reasoning:** allowing the model to have steps to refine representations in a more multi-step manner;
- **progressive multi-task training:** using user feedback sequences to supervise the learning process.

Simply put: instead of just feeding raw features into the model, the system tries to "tell the right context" so the model understands the user and the situation better.

### 3. An easy-to-understand example

Suppose a user searches for "rain jacket".

If only looking at the query, the system might return raincoats, waterproof jackets, and windbreakers.

But if context is added:

```text
User previously bought trekking gear
Currently in a rainy area
Usually chooses medium-priced products
Recently clicked on outdoor gear
```

Ranking might prioritize outdoor waterproof products instead of cheap plastic raincoats.

This is the spirit of context engineering: the model doesn't naturally understand everything if we don't provide enough structured context.

### 4. Lessons for CRM search

A CRM also has a ranking problem.

When searching for a customer or lead, results should consider:

- name/contact match;
- open deals;
- latest interaction;
- priority level;
- deal value;
- quote status;
- follow-up history.

Just keyword matching is not enough. A hot lead must be prioritized over an old, inactive contact, even if the text match is the same.

### 5. Conclusion

OnePiece is a good example that "LLM thinking" doesn't just belong in chatbots. Context engineering and reasoning can become a pattern for many other systems, especially search/ranking/recommendation.

The important thing is not to drag LLMs into everything, but to learn the useful parts: providing better context, designing better representations, and evaluating with real metrics.

## References

- OnePiece: Bringing Context Engineering and Reasoning to Industrial Cascade Ranking System: https://arxiv.org/abs/2509.18091
- Hugging Face Papers — OnePiece: https://huggingface.co/papers/2509.18091

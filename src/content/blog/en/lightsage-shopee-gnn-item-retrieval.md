---
title: 'LightSAGE at Shopee: GNN for item retrieval in e-commerce ads'
description: >-
  Analyzing the LightSAGE paper on how Shopee uses graph neural networks for
  item retrieval in recommendation ads.
pubDatetime: '2022-07-07T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Recommendation Systems
  - Shopee
  - GNN
  - Item Retrieval
  - Vector Search
  - E-commerce
categories:
  - Technical
  - AI
draft: false
---

## Introduction

In recommendation systems, many people jump straight into model architecture. But Shopee's LightSAGE paper highlights a very practical reality: in an industrial setup, the model is only one part.

With item retrieval in e-commerce ads, parts like graph construction, data sparsity, cold-start, and long-tail items can determine whether the system is usable or not.

### 1. What is item retrieval?

An e-commerce platform can have millions of products. When it needs to recommend ads, the system cannot score every single product.

So there is usually a retrieval step:

```text
User / Context → Retrieve a few hundred or thousand candidate items → Ranking → Ads display
```

Retrieval must be fast and broad enough. If retrieval misses good items, the ranking step later has no chance to fix it.

### 2. How does LightSAGE use graphs?

According to the LightSAGE paper, Shopee builds the item graph by combining strong-signal user behaviors with high-precision collaborative filtering. Then they use GNN to generate quality item embeddings for vector search.

The notable point is that the paper doesn't just say "use GNN". It talks about three very production-oriented problems:

- building a quality graph;
- handling data sparsity;
- handling cold-start and long-tail items.

These are the things that often make recommendation systems much harder than a demo.

### 3. Why do graphs fit e-commerce?

In e-commerce, items don't stand alone.

One product might be related to another because they are:

- viewed together by a group of users;
- often bought together;
- part of the same search intent;
- have similar click/buy behaviors;
- belong to the long-tail but are strongly related to a small niche.

Graphs help represent these relationships better than a flat feature table.

### 4. A simple example

Suppose there are three products:

```text
A: men's running shoes
B: running socks
C: sports water bottle
```

If many users view A then buy B, or buy A then click C, the graph creates links between these items. The model doesn't just look at the product content, but also learns from collective behavior.

With CRM, a similar idea could be used for light lead scoring:

```text
Lead A is similar to Lead B
Lead B converted to a deal
Lead A might need to be followed up sooner
```

Of course, a small CRM doesn't need a GNN right away. But the mindset of "relationships between entities matter" is very worth learning.

### 5. Conclusion

LightSAGE is a great case because it pulls the recommendation system back to reality: it's not just the model, but the data, graph, vector search, long-tail, cold-start, and A/B testing.

If you are building a small AI product, the lesson is: before choosing a complex model, ask if your data has enough relationships, enough signals, and a good enough evaluation process.

## References

- LightSAGE: Graph Neural Networks for Large Scale Item Retrieval in Shopee's Advertisement Recommendation: https://arxiv.org/abs/2310.19394

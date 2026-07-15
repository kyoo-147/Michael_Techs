---
title: 'Designing a ranking system: from Airbnb to CRM search'
description: >-
  Drawing lessons from Airbnb Search and Embedding-Based Retrieval to design a
  CRM search/ranking system in a practical way.
pubDatetime: '2022-03-08T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Airbnb
  - Ranking System
  - Search
  - CRM Search
  - Personalization
  - Relevance
categories:
  - Technical
  - Product
---

Search in a CRM sounds much smaller than Airbnb.

Airbnb has to help users find a suitable place to stay among millions of listings. A CRM only needs to find leads, customers, deals, quotes. But looking closely, the core problem is quite similar: **users don't just need the correct results, they need the most useful results at that moment**.

I read Airbnb's posts on Embedding-Based Retrieval and search ranking to rethink: if building a serious CRM search, where should we start?

## Sources

- Airbnb Engineering — [Embedding-Based Retrieval for Airbnb Search](https://airbnb.tech/ai-ml/embedding-based-retrieval-for-airbnb-search/)
- Airbnb Engineering — [Machine Learning-Powered Search Ranking of Airbnb Experiences](https://medium.com/airbnb-engineering/machine-learning-powered-search-ranking-of-airbnb-experiences-110b4b1a0789)
- arXiv — [Learning to Rank for Maps at Airbnb](https://arxiv.org/abs/2407.00091)

## 1. Airbnb doesn't just "search text"

In the Embedding-Based Retrieval post, Airbnb says search is tasked with surfacing the most relevant listings to the user's query. But because there are so many eligible homes, the system needs to retrieve a smaller subset for more expensive ranking models to process later.

The architecture usually has multiple layers:

```txt
Query
  → candidate retrieval
  → ranking
  → re-ranking / business rules
  → UI result
```

This is a pattern very much worth learning.

With a CRM, we shouldn't think of search as just:

```sql
WHERE name ILIKE '%keyword%'
```

Good search might need to understand intent:

- search by customer name;
- find hot deals;
- find newly sent quotes;
- find conversations with relevant content;
- find customers not followed up with for a long time;
- find a lead similar to a previous case.

## 2. CRM search should start simple

The first version should be a lightweight hybrid:

```txt
Keyword search
  + filters
  + recency
  + entity priority
  + permission
```

Example query: "acme quote"

Results should prioritize:

1. customers with names similar to Acme;
2. quotes related to that customer;
3. deals with the newest quotes;
4. conversations mentioning the quote.

You don't need embeddings right away if keywords + filters solve 80%.

## 3. When are embeddings useful?

Embeddings are useful when the user doesn't type the exact keyword.

For example:

```txt
"customer asking for pill inspection machine price"
```

It could relate to:

```txt
Pharmaceutical QC Defect Detection Machine
blister inspection
industrial camera
quality control
```

Keyword search might miss if the words don't match. Embeddings help map the query and document closer together in vector space.

Airbnb uses a two-tower architecture to map queries and listings into embeddings. The listing tower can be computed offline, and the query tower in real-time to reduce latency. For a small CRM, we can be simpler:

```txt
Offline:
- create embeddings for customer summaries
- create embeddings for deal summaries
- create embeddings for conversation chunks

Online:
- create embedding for query
- vector search top K
- apply filters/permissions
- rerank by recency + business priority
```

## 4. Ranking is not just relevance

A "relevant" search result is not necessarily the result that should be at the top.

In a CRM, ranking might consider:

```txt
relevance_score
recency_score
deal_value
stage_priority
ownership
last_activity
risk/urgency
```

For example:

```txt
Score =
  0.45 * relevance
+ 0.20 * recency
+ 0.15 * deal_priority
+ 0.10 * user_ownership
+ 0.10 * urgency
```

This is not a fixed formula. It's just a way to start thinking clearly.

## 5. Training data shouldn't be picked randomly

Airbnb emphasizes building training data based on the user's journey, including meaningful positive and negative examples. They don't just random sample negatives, because then the problem is too easy and the model doesn't learn well.

In a CRM, if we later train a ranking model, we must also be careful:

Positive signals:

```txt
user clicked result
user spent a long time opening result
user completed action after opening
user searched similar query and picked same entity
```

Negative signals:

```txt
result shown but skipped
user immediately went back
user searched again with refined query
user marked result not relevant
```

But clicks are not enough. Outcomes are what matters.

## 6. A small design for CRM search

```txt
/search?q=acme quote
  → parse query
  → keyword search PostgreSQL
  → vector search if query is long/semantic
  → merge candidates
  → permission filter
  → rank
  → return grouped results
```

The response can be grouped:

```json
{
  "customers": [],
  "deals": [],
  "quotes": [],
  "conversations": []
}
```

The UI shouldn't mix everything into one list if the user needs to distinguish entities.

## Conclusion

The lesson from Airbnb isn't that a small CRM must build complex ranking systems immediately.

The lesson is that search should be seen as a multi-layer system: retrieve, filter, rank, explain, measure. The first version can be very simple. But if designed correctly from the start, adding embeddings, personalization, or AI search later won't require a total rewrite.

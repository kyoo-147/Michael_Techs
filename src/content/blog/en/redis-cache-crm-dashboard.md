---
title: When Does It Make Sense to Use Redis Cache for a CRM Dashboard?
description: >-
  Practical notes on using Redis cache to optimize a CRM dashboard: when to use
  it, what to cache, invalidation strategies, and how to avoid common pitfalls.
pubDatetime: '2023-08-03T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Technical Notes
  - Redis
  - Caching
  - CRM Dashboard
  - Performance
  - Backend
  - System Optimization
categories:
  - Technical
  - Product
---

## Introduction

When a CRM dashboard has little data, everything usually works fine. Querying the database directly to render tables for leads, deals, and quotes is enough.

But as data grows, the dashboard starts to slow down:

```text
Total leads by status
Pipeline revenue by month
Number of deals in the proposal stage
Top performing lead sources
Most recent activity of each sales rep
```

Each time a user opens the dashboard, the backend has to query multiple tables, join data, group by, and aggregate. At this point, many people immediately think: "Just add a Redis cache."

Redis can help a lot, but you shouldn't cache everything everywhere. This article documents how I decide **when it makes sense to use Redis cache for a CRM dashboard**.

## 1. What problem does Redis cache solve?

Redis is often used to store frequently accessed data in memory. For a CRM dashboard, caching is useful when:

- data is read more often than written
- aggregate queries take a long time
- many users view the exact same dashboard
- data doesn't need to be accurate to the second
- responses can be accepted as stale for a few seconds or minutes

Example overview dashboard:

```text
Total leads today
Open deals value
Conversion rate this month
Revenue by pipeline stage
```

This data usually doesn't need absolute real-time accuracy. A 30–60 second delay is acceptable in many small CRMs.

## 2. When do you NOT need Redis yet?

Don't add Redis too early just to "look professional".

You don't need Redis yet if:

- the database is still small
- queries take under 100–200ms
- the dashboard has few users
- you haven't set up good indexes yet
- you haven't measured the bottleneck
- data changes constantly and requires exact real-time accuracy

Before caching, you should do 3 things:

```text
1. Measure where the slow queries are.
2. Add database indexes in the right places.
3. Optimize queries or schemas if necessary.
```

Cache should not hide bad database design. It should be an optimization layer after understanding the bottleneck.

## 3. What to cache in a CRM dashboard

I prioritize caching aggregate data:

### Dashboard summary

```text
crm:dashboard:summary:org:{orgId}
```

Example value:

```json
{
  "totalLeads": 1240,
  "newLeadsToday": 32,
  "openDeals": 86,
  "pipelineValue": 45000,
  "updatedAt": "2026-06-25T00:00:00Z"
}
```

### Pipeline by stage

```text
crm:pipeline:by_stage:org:{orgId}
```

```json
[
  { "stage": "qualified", "count": 20, "value": 12000 },
  { "stage": "proposal", "count": 8, "value": 18000 }
]
```

### Lead source performance

```text
crm:lead_source:performance:org:{orgId}:month:{yyyyMM}
```

This data doesn't need to be updated every second, making it very suitable for caching.

## 4. What NOT to cache in a rush

I am careful with:

- sensitive personal information
- permission-specific responses
- freshly written data that needs to be seen immediately
- complex search/filter queries per user
- paginated lists that change constantly

Example:

```text
GET /leads?search=nguyen&status=qualified&owner=user_123&page=3
```

You can cache it, but there will be many keys and invalidation is hard. For the first version, I prioritize caching summaries/aggregates first.

## 5. Cache-aside pattern

The easiest pattern to start with is cache-aside.

Data read flow:

```text
1. Backend checks Redis.
2. If cache exists → return immediately.
3. If no cache exists → query database.
4. Save the result to Redis with a TTL.
5. Return the result to the frontend.
```

Pseudo-code:

```ts
async function getDashboardSummary(orgId: string) {
  const key = `crm:dashboard:summary:org:${orgId}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const summary = await queryDashboardSummaryFromDb(orgId);

  await redis.set(key, JSON.stringify(summary), {
    EX: 60,
  });

  return summary;
}
```

A TTL of 60 seconds means the dashboard can be stale for a maximum of about 1 minute. For many business dashboards, this is acceptable.

## 6. Invalidation: the hardest part of caching

Caching isn't hard because of `redis.get`. Caching is hard because of the question: **when do you delete the cache?**

There are 3 simple ways:

### Method 1: TTL-only

Set a short TTL, for example 30–60 seconds.

Pros:

- simple
- fewer invalidation bugs
- fits overview dashboards

Cons:

- data can be stale during the TTL period

### Method 2: Invalidate on write

When creating a new lead/deal/quote, delete the related keys.

```ts
await createLead(data);
await redis.del(`crm:dashboard:summary:org:${orgId}`);
await redis.del(`crm:lead_source:performance:org:${orgId}:month:${month}`);
```

Pros:

- fresher data

Cons:

- easy to forget to delete related keys
- many writes can render the cache useless

### Method 3: Background refresh

Have a scheduled job that recalculates the dashboard summary and writes it to Redis.

```text
Every 1 minute → compute dashboard summary → update Redis
```

This approach is suitable if the dashboard is viewed a lot and aggregate queries are heavy.

## 7. Example application for OneClick CRM

For OneClick CRM, I cache in this order:

### Phase 1

Cache dashboard overview:

```text
total leads
open deals
pipeline value
quotes sent
activities due today
```

TTL: 30–60 seconds.

### Phase 2

Cache analytics by month:

```text
lead source conversion
deal stage distribution
quote acceptance rate
follow-up completion rate
```

TTL: 5–15 minutes.

### Phase 3

If there are many users and multiple orgs, add background refresh and cache per organization.

```text
crm:dashboard:summary:org:{orgId}
crm:pipeline:by_stage:org:{orgId}
crm:quote:acceptance_rate:org:{orgId}:month:{yyyyMM}
```

## 8. Metrics to measure

If you add Redis without measuring, you won't know if it helps.

I will measure:

```text
cache hit rate
cache miss rate
average response time
p95 response time
query time before/after cache
Redis memory usage
stale data complaints
```

Example:

```text
Before cache: dashboard summary p95 = 1200ms
After cache:  dashboard summary p95 = 180ms
Cache hit rate: 82%
```

If the hit rate is low, the key design might not be good or the data is too dynamic.

## 9. Common pitfalls

- Caching everything too early.
- No TTL.
- Keys without orgId/userId leading to data exposure between tenants.
- Caching permission-dependent responses but keys lack permission context.
- Not measuring hit rate.
- No fallback when Redis is down.
- Using cache to hide bad queries/database design.

With a multi-tenant CRM, the key should always include `orgId`.

```text
bad:  crm:dashboard:summary
good: crm:dashboard:summary:org:{orgId}
```

## 10. Conclusion

Redis cache is very useful for CRM dashboards, but should be used in the right places.

I will only add Redis when:

```text
queries have started to become slow
there are more reads than writes
aggregate data is viewed repeatedly
being stale for a few seconds/minutes is acceptable
metrics are in place to measure effectiveness
```

Key lessons:

- Cache summaries/aggregates first, don't cache complex lists immediately.
- A short TTL is usually good enough for small dashboards.
- Invalidation is the part that needs careful design.
- Redis should make the system faster, not make the logic messier.

## References

- Redis Docs: https://redis.io/docs/latest/
- Redis — Query Caching for Microservices: https://redis.io/tutorials/howtos/solutions/microservices/caching/
- Azure Architecture Center — Cache-Aside pattern: https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
- AWS Caching overview: https://aws.amazon.com/caching/

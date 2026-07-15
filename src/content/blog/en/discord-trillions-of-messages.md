---
title: How does Discord store trillions of messages?
description: >-
  Reading the Discord case of migrating from Cassandra to ScyllaDB and drawing
  lessons on databases, hot partitions, migration, and latency.
pubDatetime: '2022-05-03T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Message Storage
  - Database
  - Cassandra
  - Scalability
  - System Design
categories:
  - Technical
---

Some systems look very simple on the outside: users send messages, others open the app and read them.

But when scaling to Discord's level, "storing messages" is no longer just a normal `messages` table. It becomes a problem of partitions, hot keys, latency, migration, on-call, and how to keep the system from breaking right when the whole world is spamming during a World Cup final.

This post is my notes from reading Discord's official engineering blog: **How Discord Stores Trillions of Messages**.

## Source

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. The real problem is not "storing messages"

In the 2017 version, Discord migrated from MongoDB to Cassandra because they needed a database that scaled well, was fault-tolerant, and required less maintenance as data grew.

But by early 2022, the Cassandra cluster storing messages had grown to **177 nodes** and contained **trillions of messages**. Problems started appearing:

- unpredictable latency;
- on-call getting paged frequently;
- maintenance operations became expensive;
- a hot partition affected the whole cluster;
- JVM compaction and GC added operational complexity.

What I find interesting here: a system can be right in a previous stage but gradually become wrong as scale and access patterns change.

It's not just "Cassandra scales well" and you're done. The more realistic question is:

> What is the read/write pattern of our data? Are there abnormally hot partitions? When maintenance runs, can the system still maintain stable latency?

## 2. Schema and partition are where everything starts

Discord partitions messages by `channel_id` and a time-based `bucket`. This makes sense because messages in the same channel are usually read chronologically.

But there is a very realistic detail: a small server with a few people and a massive server might share the exact same schema, but traffic differs wildly.

When a large channel has many concurrent readers or senders, that partition becomes hot. Cassandra reads are more expensive than writes because they must read from memtables and multiple SSTables on disk. If a partition is read too heavily, the node's latency spikes, and other queries are affected.

Here is the first lesson:

> A database schema is not just a data structure. It's your assumption about user behavior.

If that assumption is wrong, the system will pay for it in latency.

## 3. Discord didn't just change the database

One thing I liked in Discord's post is they didn't just tell a story of "we switched to ScyllaDB and everything got better".

They knew hot partitions could still happen. So besides migrating from Cassandra to ScyllaDB, they also built **data services** in Rust sitting between the API monolith and the database.

These data services play several key roles:

- group database queries into clear gRPC endpoints;
- contain no business logic;
- request coalescing: if multiple requests read the same row, query the database only once;
- consistent hash routing: requests for the same channel route to the same service instance to increase coalescing capability.

Simply put: instead of letting the database bear the full traffic spike, they placed an absorbing layer in between.

For a smaller system like a CRM, this lesson still applies. For example, a CRM dashboard has 50 users opening it simultaneously to view the same deal or conversation history. Instead of having every client hammer the database, we can use:

- cache;
- request coalescing;
- API aggregation;
- background jobs;
- separate read models for the dashboard.

## 4. Large migrations require validation, not just "copy data"

Discord needed to migrate trillions of messages with zero downtime requirements. Initially, they planned to use a Spark migrator, estimating it would take about three months. Then they wrote a migrator in Rust, reading token ranges, checkpointing with SQLite, and pushing data to ScyllaDB. The migration speed sometimes hit millions of messages per second.

The most important part to me wasn't the speed, but where they did **dual read / validate**: sending a small portion of read requests to both databases and comparing the results.

A pattern worth remembering:

```txt
Old DB  ─┐
         ├─ compare result → report mismatch
New DB  ─┘
```

When migrating a real system, especially critical data, don't trust the "feels fine" instinct. You must have validation.

## 5. Small example: applying to a CRM's activity log

A small CRM might store activity logs like this:

```sql
CREATE TABLE activity_logs (
  id BIGSERIAL PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

This schema is good enough at a small scale. But if an entity has too many activities, or the dashboard constantly reads the newest activities, we need to think further:

- do we need to partition by `workspace_id`?
- do we need a read model for the dashboard?
- do we need to cache the latest activities?
- do we need to archive old activities?
- do we need a separate event stream for notifications?

This is how we learn from Discord without copying Discord. Small systems don't need ScyllaDB immediately. But small systems still need to understand access patterns.

## 6. Lessons I keep

A large messaging system doesn't die from lacking a fancy database. It dies from many small things combined: schema, partitions, read patterns, compaction, GC, hot partitions, migration, validation, and on-call toil.

For me, this post has 5 lessons:

1. **Choose databases by access patterns, not by hype.**
2. **Partition keys are architectural decisions, not just schema details.**
3. **Adding a service layer in the middle can protect the database from traffic spikes.**
4. **Massive data migrations must have automated validation.**
5. **p99 latency is more important than average latency if the system serves real users.**

Looking back at CRMs, AI workflows, or realtime dashboards, I see the same mindset: don't just build a feature that runs. Ask what that feature will read, what it will write, how many times, who reads concurrently, and if data grows 100x, which part will cause headaches first.

---
title: When the database starts exhausting the on-call team
description: >-
  From Discord's case of storing trillions of messages, the post looks at the
  signs that a database is no longer suited for the workload.
pubDatetime: '2023-04-18T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - Database
  - Cassandra
  - ScyllaDB
  - On-call
categories:
  - Technical
  - Experience
draft: false
---

## Introduction

A database doesn't just fail when it crashes.

There is a more silent type of failure: the system is still running, but the team has to constantly baby it. Latency is unpredictable, repairs take a long time, on-call is exhausting, operations are complex, and every incident eats up a lot of time.

Discord's case of moving from Cassandra to ScyllaDB in the article "How Discord Stores Trillions of Messages" is a very worthwhile example to read.

### 1. Scale reveals the problem

Discord used to use MongoDB, then moved to Cassandra when message scale increased sharply. Reaching the trillions of messages stage, their Cassandra cluster became much harder to operate.

Discord's article mentions problems like:

- unstable latency;
- labor-intensive maintenance;
- complex cluster repair and operations;
- tombstones impacting data reading;
- increased on-call/toil.

The important point: the database wasn't wrong. The workload and scale had changed.

### 2. When does a database become a burden?

A few signs:

- every incident relates to the database;
- query latency fluctuates unpredictably;
- the initial schema no longer fits the workload;
- deleting/modifying data creates massive side effects;
- the team has to spend too much time tuning;
- adding more nodes doesn't thoroughly solve the problem.

At that point, the question is no longer "which database is best", but "which database best fits this workload".

### 3. Lessons for a small CRM

A small CRM doesn't need to think about Cassandra or ScyllaDB yet. But the workload lesson is very close.

For example, an activity log in a CRM:

```text
lead_created
message_sent
quote_opened
deal_updated
followup_failed
```

If logs grow fast, common queries might be:

- fetch a customer's timeline;
- fetch the latest activity of a deal;
- filter error events in the last 24 hours;
- count the number of follow-ups sent.

Table design must start from query patterns, not just from pretty entities on paper.

### 4. A simpler schema for activity logs

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_activity_entity_time
ON activity_logs (workspace_id, entity_type, entity_id, created_at DESC);
```

Initially, this might be enough. When scaling larger, you can separate archives, partitions, event stores, or search engines.

### 5. Conclusion

Discord's case is great because it's not just a database migration story. It's a story about workload, operational cost, and team health.

A good system shouldn't just be fast. It must be easy enough to operate so that the team doesn't get dragged into an endless on-call loop by the database.

## References

- Discord Engineering — How Discord Stores Trillions of Messages: https://discord.com/blog/how-discord-stores-trillions-of-messages
- ScyllaDB Tech Talk — How Discord Migrated Trillions of Messages from Cassandra to ScyllaDB: https://www.scylladb.com/tech-talk/how-discord-migrated-trillions-of-messages-from-cassandra-to-scylladb/

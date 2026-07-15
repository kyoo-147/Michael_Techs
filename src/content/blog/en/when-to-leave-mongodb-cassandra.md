---
title: When should you leave MongoDB/Cassandra/SQL? Lessons from Discord
description: >-
  Analyzing the database migration decision through the Discord case and how to
  choose a database based on access patterns, operational costs, and trade-offs.
pubDatetime: '2022-05-26T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - MongoDB
  - Cassandra
  - SQL
  - Database Migration
  - Trade-offs
  - Scalability
categories:
  - Technical
---

A very controversial question in system design is: **which database should we use?**

SQL, MongoDB, Cassandra, ScyllaDB, Redis, Elasticsearch... everyone praises something. But the Discord case shows a more realistic lesson: a database is not a one-time choice that stays right forever.

Discord went from MongoDB to Cassandra, and then migrated message storage to ScyllaDB. Not because the old database was "bad", but because operational, scale, and access pattern requirements had changed.

## Sources

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Don't choose databases based on emotions

A very dangerous way to pick a database is:

```txt
MongoDB is easy to use → pick MongoDB
SQL is familiar → pick PostgreSQL
Cassandra scales well → pick Cassandra
Redis is fast → put everything in Redis
```

The more correct way is to ask:

- is the data highly relational?
- what is the primary query?
- is it read-heavy or write-heavy?
- do we need transactions?
- do we need full-text search?
- in which direction does data grow?
- can the system tolerate eventual consistency?
- can the team operate it?

A database isn't just a place to store data. It brings along an operational model.

## 2. SQL is still a good starting point for most products

For a CRM, dashboard, or small SaaS, PostgreSQL/MySQL is still a reasonable starting point.

Because they have:

- transactions;
- clear schemas;
- good joins;
- powerful indexes;
- flexible querying;
- easy backups;
- easy to find people who know them;
- good ecosystem.

For example, a CRM has leads, contacts, deals, quotes. This is naturally relational data:

```txt
Customer ── Deals ── Quotes
    │
    └── Activities
```

Using SQL helps model clearly and avoids data becoming too loose too early.

## 3. MongoDB is suitable when document data changes fast

MongoDB fits some cases:

- flexible document data;
- fast-changing schema;
- heavily nested objects;
- no complex joins needed;
- prototyping speed is important.

For example, storing workflow configs:

```json
{
  "workflow_id": "wf_123",
  "steps": [
    { "type": "trigger", "event": "lead.created" },
    { "type": "condition", "field": "source", "equals": "website" },
    { "type": "action", "name": "send_follow_up" }
  ]
}
```

For this format, a document database can be convenient.

But if you start needing complex reports, joining many tables, or strict data constraints, SQL is easier to live with.

## 4. Cassandra/ScyllaDB are for entirely different problems

Cassandra and ScyllaDB are not meant to replace SQL in everything. They are strong at large distributed workloads, clear key-based read/writes, horizontal scaling, and good fault tolerance.

But the trade-offs:

- queries must be designed around the access pattern;
- you can't query arbitrarily like in SQL;
- data modeling is harder;
- operational complexity is higher;
- migration and consistency require deep understanding.

Discord used Cassandra because message storage needed massive scale and fault tolerance. But when the Cassandra cluster caused too much toil, unpredictable latency, GC issues, compaction pain, and hot partitions, they migrated to ScyllaDB and added data services to better control traffic.

Lesson: Cassandra/ScyllaDB solve one group of problems but create another group of problems.

## 5. When should you think about migration?

Don't migrate just because "I heard the new tech is better".

You should think about migration when there are clear signals:

### Latency is no longer stable

p99/p999 increases, users feel the slowness, on-call starts getting exhausting.

### Maintenance cost increases

The team spends too much time firefighting instead of building features.

### Access pattern doesn't fit the current database

For example, you need to query the timeline fast but the current schema makes the query too expensive.

### Scale outgrows the initial design

Not just 2x growth, but the fundamental nature of data/traffic changes.

### The new database solves the right pain

It's not "the new database is faster", but "it's faster for our workload".

## 6. Safe migration needs a clear plan

A minimum data migration should have:

```txt
1. Understand current workload
2. Benchmark on near-production data
3. Dual-write or shadow-write if needed
4. Backfill old data
5. Validate read result between old/new
6. Cutover via feature flag
7. Have a rollback plan
8. Monitor p50/p95/p99, error rate, mismatch rate
```

Discord had automated validation by comparing a portion of reads between the two databases. This is a very worthwhile detail to learn. Migration is not just moving data, it's proving the data is still correct after moving.

## Conclusion

The lesson from Discord isn't "go use ScyllaDB". The lesson is: your database must follow your access pattern and operational reality.

When small, choose what is easy to understand, operate, and debug. As you grow, observe real bottlenecks. If you must migrate, migrate because data and workload force you to, not because the new technology looks cooler.

---
title: 'From Discord to CRM: how to store activity logs and conversation history?'
description: >-
  Drawing lessons from how Discord handles message storage to design activity
  logs and conversation history for a small CRM.
pubDatetime: '2023-05-11T00:00:00.000Z'
locale: en
author: Michael
tags:
  - System Design Case Studies
  - Discord
  - CRM
  - Activity Log
  - Conversation History
  - Database Design
  - System Design
categories:
  - Technical
  - Product
---

In a CRM, there are two types of data that are very easily overlooked: **activity logs** and **conversation history**.

At first, it's just a few lines: a lead is created, an employee makes a call, a customer replies to a message, a quote is sent, a deal changes stage.

But after a few months, this becomes the place that tells the entire history of the relationship with the customer. If designed too simply, later the dashboard becomes slow, searching becomes hard, migration is exhausting, and AI assistants lack context.

I read the Discord case study on storing trillions of messages to rethink this problem at a smaller scale: if Discord has to handle message history for millions of communities, how should a CRM store activities and conversations so that it is both simple and scalable?

## Sources

- Discord Engineering — [How Discord Stores Trillions of Messages](https://discord.com/blog/how-discord-stores-trillions-of-messages)

## 1. Activity logs are not messages, but have the same problem

Discord stores messages by channel and time. A CRM has a very similar pattern:

```txt
Customer / Lead / Deal
  └── Activities over time
        ├── note
        ├── call
        ├── email
        ├── message
        ├── quote_sent
        └── deal_stage_changed
```

Users usually do not read activities randomly. They read by entity:

- open a lead → view interaction history;
- open a deal → view quotes, calls, messages;
- open a customer → view the entire timeline;
- dashboard → fetch the most recent activities.

So the most important access pattern is:

```txt
workspace_id + entity_type + entity_id + created_at DESC
```

If the schema doesn't serve this pattern, it will only get harder later.

## 2. Design simply first

For a small CRM system, I would start with PostgreSQL, no need to jump straight to Cassandra or ScyllaDB.

```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  actor_id UUID,
  action TEXT NOT NULL,
  source TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_activity_timeline
ON activity_logs (
  workspace_id,
  entity_type,
  entity_id,
  created_at DESC
);
```

This approach has benefits:

- easy to query;
- easy to debug;
- easy to use for timelines;
- flexible metadata;
- not over-engineered yet.

But discipline is required: `metadata` must not become a dumping ground. Important fields for filtering/reporting should still have their own columns.

## 3. Should conversation history be separate or merged?

There are two ways.

### Way 1: Merge into activity log

Every message is also an activity.

Ưu điểm: fast, simple, beautiful timeline.

Nhược điểm: if there's a lot of chatting, the activity table bloats quickly. Searching messages also becomes harder.

### Way 2: Separate conversations/messages tables

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL,
  customer_id UUID,
  channel TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  direction TEXT NOT NULL,
  sender_id UUID,
  body TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_conversation_time
ON messages (conversation_id, created_at DESC);
```

Then the activity log only records important events:

```txt
message_received
message_sent
conversation_assigned
follow_up_scheduled
```

I lean towards way 2 if the CRM has true messaging, because conversation is its own domain.

## 4. Don't let the dashboard read too many raw events

A common mistake: the dashboard needs "recent activities", "last contact date", "number of unread messages", "last message preview", so every load requires joining/querying a huge amount of raw activities.

When small, it's fine. When there are more workspaces, it becomes slow.

A better way is to have a read model or summary table:

```sql
CREATE TABLE customer_activity_summary (
  workspace_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  last_activity_at TIMESTAMPTZ,
  last_contact_at TIMESTAMPTZ,
  last_message_preview TEXT,
  unread_count INT DEFAULT 0,
  PRIMARY KEY (workspace_id, customer_id)
);
```

Whenever there's a new activity, the backend updates this summary. The dashboard only reads the summary.

This is a miniature version of the Discord lesson: don't make the root database handle every type of query. Sometimes you need an intermediate layer or data model that serves the exact screen.

## 5. When to start thinking about queues?

When each activity creates many side effects:

- send notification;
- update dashboard realtime;
- calculate lead score;
- create reminder;
- update summary;
- call AI to suggest next action.

At that point, it shouldn't all be done in the main request.

```txt
User action
  → write activity
  → publish event
  → workers process notification / summary / AI suggestion
```

The main request only needs to reliably save the data. The secondary tasks are left for workers to process later.

## Conclusion

From Discord to a CRM, the scale is vastly different. But the mindset is the same: understand how data is read and written.

A good CRM doesn't just have tables for leads, contacts, and deals. It needs a reliable history layer so users understand what happened with the customer. Later, if you add an AI assistant, the activity log and conversation history will be the most important context so the AI doesn't reply like a clueless chatbot.

---
title: 'Designing a safe AI companion: having memory while remaining controllable'
description: >-
  An AI companion with memory doesn't just mean saving as much as possible. For
  safety, we need to clearly design what memory is saved, who can view it, when
  it's deleted, and when humans must be brought into the control loop.
pubDatetime: 2026-06-23T00:00:00.000Z
locale: en
author: Michael
tags:
  - Safe & Human-centered AI
  - AI Companion
  - Memory
  - Safety
  - Parental Control
  - Human-centered AI
categories:
  - AI
  - Product
---

An AI companion with memory sounds very attractive.

It remembers your name. Remembers what you like. Remembers what you were sad about last time. Remembers your habits, your speaking style, your learning goals, and the things you often avoid.

But memory is also the part that makes me feel the need to be most careful.

Because if not designed well, "remembering to support" easily turns into "remembering too much, unclear who controls it, unclear how to delete it".

Especially if the product targets children, families, or people needing support, memory cannot just be a cool feature. It must be a responsibly designed part.

## 1. Memory is not a warehouse to stuff everything into

When talking about an AI with memory, it's easy to imagine simply:

```txt
What the user says → save it all → use it next time
```

But a real product shouldn't be like that.

A more reasonable design should divide memory into multiple layers:

| Memory type | Example | Should it be saved long-term? |
|---|---|---|
| Session memory | Content of the current conversation | Yes, but only during the session |
| User preference | Likes gentle voices, likes learning with images | Can be saved if user/parent agrees |
| Learning progress | Which lessons have been completed | Can be saved |
| Sensitive memory | Health, private emotions, family information | Very cautiously |
| Safety notes | Signs requiring adult attention | Needs a separate mechanism, not mixed with normal memory |

Good memory is not remembering a lot. Good memory is remembering the right things, for the right time, for the right purpose.

## 2. Memory needs clear control rights

UNICEF's guidance on AI and children emphasizes requirements such as: ensuring safety for children, data protection and privacy, transparency, explainability, accountability, and putting the child's best interests at the center.

Translating those principles into product design, I think of very specific controls:

- parents can see what the AI is saving,
- there is a button to delete memory,
- long-term memory can be turned off,
- the topics the AI is allowed to remember can be restricted,
- the AI must state clearly when it uses saved information,
- sensitive data must not be automatically saved like normal memory.

Users shouldn't be forced to trust the AI with blind faith. They need to see and adjust it.

## 3. A safer memory architecture

I would not design an AI companion with a `memories` table that saves everything.

A safer flow:

```txt
User message
    ↓
Safety filter
    ↓
Conversation response
    ↓
Memory candidate extractor
    ↓
Policy check
    ↓
Parent/user approval if needed
    ↓
Memory store
```

The important point is: not every sentence gets saved.

For example:

```json
{
  "memory_type": "preference",
  "content": "User prefers short and gentle explanations",
  "source": "conversation",
  "sensitivity": "low",
  "retention": "long_term",
  "visible_to_parent": true,
  "requires_approval": false
}
```

For more sensitive information:

```json
{
  "memory_type": "safety_note",
  "content": "User expressed strong distress during the session",
  "sensitivity": "high",
  "retention": "review_required",
  "visible_to_parent": true,
  "requires_approval": true
}
```

I'm not saying this is a perfect schema. But this way of thinking helps you avoid treating memory as a generic blob of data.

## 4. Distinguish between "personalization" and "emotional dependence"

The more an AI companion acts like a friend, the easier it is to create a sense of familiarity.

That has a good side: users might find it easier to talk, feel less pressure, and learn more naturally.

But there is a risky side: users, especially children, might rely too much on the AI or confuse the machine's response with a real relationship.

Therefore, I think an AI companion should have a few principles:

- do not claim to replace parents, teachers, doctors, or real friends,
- encourage users to talk to adults when they have important problems,
- do not prolong the conversation at all costs,
- do not use memory to manipulate emotions,
- do not make the child feel "the AI is the only one who understands me".

A good AI companion should support humans, not replace the human world.

## 5. Human-in-the-loop is not a minor detail

With safe products, humans are not just someone who "reviews if there is an error".

Humans must be in the design from the start.

For example, with an AI companion for children:

```txt
Child talks to AI
    ↓
AI responds gently
    ↓
System detects risk / sensitive topic
    ↓
Escalate to parent dashboard
    ↓
Parent reviews context
    ↓
Parent decides next action
```

Not everything needs an alert. If there are too many alerts, parents will ignore them. But high-risk cases need a clear mechanism.

## 6. Memory design checklist

Before adding memory to an AI companion, I would ask myself:

- How does this memory help the user?
- Does it need to be saved long-term?
- Does the user/parent know it is being saved?
- Can it be viewed, edited, deleted?
- What happens if the memory is wrong?
- Can the memory make the AI response biased or overly intimate?
- Are there separate rules for sensitive data?
- Are there logs for auditing?

If you can't answer these questions, it's best not to turn on long-term memory yet.

## 7. Conclusion

Memory is one of the parts that makes an AI companion more useful. But it is also the part that requires the most humility when designing.

To me, the principle should be:

> AI should only remember what helps the user improve, within limits that the user or guardian can understand, control, and delete.

A safe companion is not a companion that remembers everything. It is a companion that knows its limits.

## References

- UNICEF — Guidance on AI and Children: https://www.unicef.org/innocenti/reports/policy-guidance-ai-children
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- AI Risk Repository paper: https://arxiv.org/abs/2408.12622

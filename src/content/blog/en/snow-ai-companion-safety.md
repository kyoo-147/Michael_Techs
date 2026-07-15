---
title: 'Snow AI Companion: what to consider when designing child-safe AI?'
description: >-
  A design note for Snow AI Companion: if AI targets children, especially those
  needing support in communication and learning, the product must start with
  safety, control, and gentle companionship.
pubDatetime: 2026-06-22T00:00:00.000Z
locale: en
author: Michael
tags:
  - Safe & Human-centered AI
  - Snow AI Companion
  - Child-safe AI
  - AI Safety
  - Autism Support
  - Interaction Design
categories:
  - AI
  - Product
---

I started thinking about Snow from a fairly simple feeling: if technology can help a group of people, however small, then it is meaningful.

For children with autism or those having difficulties in communication, learning, and emotions, an AI companion sounds very appealing. It can be patient, repeat instructions, use a gentler voice, never get angry, and never rush.

But exactly because the product targets children, the first question shouldn't be:

> How to make the AI smarter?

It should be:

> How to make the AI safer, easier to control, and truly supportive of children instead of replacing humans?

## 1. Snow should not be an "AI best friend replacing parents"

This is a very important boundary.

Snow can be a gentle companion. But Snow should not replace parents, teachers, doctors, or therapists.

A safer positioning:

```txt
Snow = a companion supporting gentle interaction, learning, habits, and emotions.
Not a doctor.
Not a diagnostic expert.
Not a family replacement.
```

This should be reflected in the product right away:

- response language must be humble,
- when encountering sensitive topics, it must encourage talking to an adult,
- do not give medical advice/diagnoses,
- do not create the feeling that the child only needs the AI.

## 2. Child-safe AI must start from children's rights

The UNICEF Guidance on AI and Children lays out requirements such as: safety for children, data protection and privacy, non-discrimination, transparency, explainability, accountability, supporting the child's best interests, development, and well-being.

Translating this to Snow's design, I would summarize it into a few principles:

1. children must be protected before being personalized,
2. parents/guardians must have control,
3. children's data must be treated as sensitive,
4. AI must have clear limits,
5. risky situations need to be escalated to humans.

A product for children cannot use the same standards as a normal chatbot.

## 3. The control layers you should have

I would design Snow with multiple layers, instead of just putting a safety prompt at the beginning.

```txt
Child UI
    ↓
Input safety check
    ↓
Conversation policy
    ↓
AI response
    ↓
Output safety check
    ↓
Memory policy
    ↓
Parent dashboard / alerts
```

Each layer has a role:

| Layer | Purpose |
|---|---|
| Child UI | simple interface, less overwhelming |
| Input safety check | detect sensitive or risky content |
| Conversation policy | limit how AI responds |
| Output safety check | prevent inappropriate responses |
| Memory policy | decide what gets saved |
| Parent dashboard | for adults to view and control |

Important point: safety shouldn't be a prompt line like "be safe". Safety must go into the architecture.

## 4. Example: morning routine

A fairly benign use case for Snow is supporting a routine.

```txt
Snow: Hi, today let's do 3 small things together.
1. Wash face
2. Drink water
3. Pack backpack

Which one do you want to start with?
```

If the child doesn't want to:

```txt
Snow: That's okay, let's try the easiest one first. Do you want to drink water first or get your backpack first?
```

Here Snow doesn't need to be overly "smart". It needs to be:

- patient,
- use short sentences,
- clear choices,
- no pressure,
- no judgment.

Sometimes a product is good not because it can say a lot, but because it knows how to say just enough.

## 5. Example: when a child says something sensitive

If the child says:

```txt
I don't want to go to school anymore. I feel very scared.
```

Snow should not act as a therapist. A safer response could be:

```txt
Snow: It sounds like you are very scared today. That feeling is not pleasant at all.
Let's breathe slowly together for a bit.
After that, you should talk to your parents or an adult you trust, so they can help you better.
```

And the system could record a light safety note for the parent dashboard, depending on the risk level.

## 6. Memory should serve support, not manipulation

Snow can remember some useful things:

- the child likes learning with images,
- the child is receptive to short sentences,
- the child likes snow characters,
- which routines the child has completed,
- which topics parents have restricted.

But Snow should not indiscriminately save every private emotion as a "psychological profile" without a clear purpose and clear controls.

A good memory should look like:

```json
{
  "type": "learning_preference",
  "content": "Prefers visual instructions and short choices",
  "visibility": "parent_visible",
  "retention": "until_deleted",
  "source": "parent_setting"
}
```

More sensitive things require different rules, different retention, and perhaps approval.

## 7. Parent dashboard shouldn't just be a settings page

The parent dashboard should help adults understand and control the system.

Sections to include:

- toggle long-term memory,
- view saved memories,
- delete memories,
- restrict topics,
- view routine progress,
- view important alerts,
- manage screen time,
- configure suitable voices/interfaces.

I think the parent dashboard is part of safety, not a secondary feature.

## 8. What Snow should avoid

A few principles I want to keep:

- no medical diagnoses,
- do not advise children to hide things from parents,
- do not encourage dependence on AI,
- do not use pressuring language,
- do not save sensitive data unless necessary,
- do not optimize for engagement at all costs,
- do not turn the companion into the "only friend".

With products for children, sometimes knowing what NOT to do is as important as knowing what to do.

## 9. Conclusion

Snow should not be designed as a smart chatbot with a few protection layers slapped on at the end.

Snow should be designed from the ground up as a safe, gentle, controlled system that puts the child and family at the center.

To me, the right direction is:

> AI doesn't replace humans. AI creates an additional gentle, accessible, and responsible layer of support for those who need it.

That is why an AI product for children is worth building.

## References

- UNICEF — Guidance on AI and Children: https://www.unicef.org/innocenti/reports/policy-guidance-ai-children
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- AI Risk Repository paper: https://arxiv.org/abs/2408.12622

---
title: How Netflix uses ML to optimize streaming quality?
description: >-
  Notes from the Netflix Tech Blog on how Machine Learning is used to predict
  streaming quality, reduce playback errors, and improve viewer experience.
pubDatetime: '2022-04-12T00:00:00.000Z'
locale: en
author: Michael
tags:
  - ML Systems & MLOps
  - Netflix
  - Machine Learning
  - Streaming Quality
  - Prediction
  - System Optimization
categories:
  - Technical
  - AI
---

When watching Netflix, I usually think simply: press play, and if the movie runs smoothly, it's done.

But behind that play button are many technical decisions: which bitrate to choose, which server serves the content, is the current network stable, can the device handle it, should we lower the quality slightly to avoid buffering?

Netflix has a very readable post: **Using Machine Learning to Improve Streaming Quality at Netflix**. What's great about this post is it doesn't talk about ML in a distant way. It talks about a very practical matter: how to make videos run better for users.

## 1. Streaming quality isn't just about resolution

Users often think video quality is 720p, 1080p, or 4K.

But the real experience depends on many other things:

- does the video start fast or slow?
- is there rebuffering?
- does the quality drop continuously?
- is the audio/video stable?
- does the device decode well?
- does the network change while watching?

A 4K video that keeps freezing is still a terrible experience.

The great thing about Netflix is they view streaming quality as a continuous prediction and optimization system, not just a video file sent down to a device.

## 2. Where is ML used?

According to Netflix's post, they use statistical models and machine learning to predict issues related to video playback quality. The simple idea is: if the system can predict beforehand which viewing session is likely to encounter errors, it can choose a better serving strategy.

For example, before or during video playback, the system can look at:

```txt
network condition
device type
historical playback data
content characteristics
current session behavior
```

From there, it predicts things like:

```txt
likelihood of rebuffering
startup delay
throughput/network quality
suitable stream quality
```

This is a very important lesson: ML in production is usually not to be "smart for fun", but to make small decisions that directly affect user experience.

## 3. An easy-to-understand example

Suppose two people are watching the same movie.

Person A uses a TV with a stable network.

Person B uses a phone with a fluctuating mobile network.

If the system only chooses video quality based on a simple rule, Person B might experience a lot of buffering. But if the system predicts Person B's network is about to drop, it can choose a slightly lower bitrate so the video runs smoother.

It sounds small, but with streaming, "smooth" is often more important than "looking the best at every moment".

## 4. Lessons for small AI products

I find the Netflix case can be pulled back to smaller products like a CRM, AI workflow, or dashboard.

Not every project needs to scale like Netflix. But the mindset is very worth learning:

> Don't just optimize the model. Optimize the final experience the user feels.

For example, in a CRM:

- a lead scoring model might be 2% more accurate, but if the response takes 5 seconds, sales won't use it;
- a dashboard might have more charts, but if it loads too slow, users will skip it;
- an AI assistant might answer better, but if it occasionally hallucinates customer info, it's not trustworthy.

So when building an AI workflow, metrics shouldn't just be:

```txt
accuracy
F1 score
BLEU / benchmark score
```

But must also include:

```txt
latency
fallback rate
user correction rate
time saved
conversion impact
workflow completion rate
```

## 5. An ML system needs a feedback loop

Netflix has a massive advantage: they have real playback data.

Each viewing session can generate signals like:

- did playback succeed?
- was there buffering?
- did the user exit?
- did the quality change?
- which device/network frequently encounters errors?

From there, the system can keep learning.

With small products, we should also design a feedback loop right from the start, even if simple.

For example, an AI workflow in a CRM:

```txt
AI suggests follow-up
→ does sales edit the content or send it as is?
→ does the customer reply?
→ does the deal move to the next stage?
→ next time, should the AI suggest differently?
```

Without a feedback loop, an AI system stays stagnant. With a feedback loop, a product has the chance to get better over time.

## 6. A small design for a CRM dashboard

If I apply this mindset to a CRM dashboard, the flow could be:

```txt
User opens dashboard
  ↓
Backend fetches deals/leads/activities data
  ↓
Analytics service calculates conversion, response time, stage drop-off
  ↓
AI service suggests issues needing attention
  ↓
Frontend displays easy-to-understand insights
```

But the important part is logging:

```txt
which insight was clicked
which insight was ignored
which suggestion was applied
which suggestion created real results
```

Only then do you think about a better model.

## 7. Conclusion

My favorite lesson from Netflix is: good ML doesn't live alone in a notebook. Good ML lives in a system that knows how to observe, predict, act, and measure results.

Streaming quality is a very clear example: the model doesn't need to appear in front of the user, but if it makes the video run smoother, the user feels it immediately.

It's the same with AI products. Users don't care what model you use. They care if the product helps them work faster, with fewer errors, and is easier to understand.

## References

- [Using Machine Learning to Improve Streaming Quality at Netflix](https://netflixtechblog.com/using-machine-learning-to-improve-streaming-quality-at-netflix-9651263ef09f)
- [Improving Netflix Video Quality with Neural Networks](https://research.netflix.com/publication/for-your-eyes-only-improving-netflix-video-quality-with-neural-networks)
- [Netflix Technology Blog](https://netflixtechblog.com/)

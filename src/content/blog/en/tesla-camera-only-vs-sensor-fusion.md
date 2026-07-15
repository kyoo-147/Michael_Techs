---
title: 'Tesla camera-only perception vs sensor fusion: what is the real trade-off?'
description: >-
  Careful notes on camera-only perception, occupancy perception, and sensor
  fusion in autonomous driving.
pubDatetime: '2022-10-11T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Autonomous Driving
  - Computer Vision
  - Tesla
  - Sensor Fusion
  - Perception
  - Safety
categories:
  - Technical
  - AI
draft: false
---

## Introduction

In autonomous driving, the debate "camera-only vs sensor fusion" is often discussed in very extreme terms.

One side says cameras are enough because humans also drive using their eyes. The other side says autonomous vehicles should use LiDAR/radar/cameras to increase safety. But looking closer, the issue isn't just about choosing a sensor. The issue is whether the perception system understands the surrounding environment well enough to make safe decisions.

This post doesn't try to definitively prove one direction is absolutely right. I'm just noting down trade-offs from public sources and survey research.

### 1. What does Tesla say from official sources?

The Tesla AI page says they apply deep neural networks to problems ranging from perception to control. Tesla also mentions per-camera networks analyzing raw images to perform semantic segmentation, object detection, and monocular depth estimation.

The Tesla FSD Support page also mentions FSD (Supervised) uses onboard cameras with 360-degree visibility, but strongly emphasizes: FSD (Supervised) requires active driver supervision and does not make the vehicle autonomous.

This is a very important point when writing: do not call FSD Supervised fully autonomous driving.

### 2. What is sensor fusion?

Sensor fusion combines multiple data sources, such as camera, radar, and LiDAR.

Each sensor has strengths/weaknesses:

- Cameras are rich in semantic information, reading signs, colors, lane markings.
- Radar is strong at measuring velocity/distance, better in certain weather conditions.
- LiDAR provides more accurate 3D geometry, but is expensive and has its own trade-offs.

Surveys on multi-modal fusion emphasize that fusion is a hard problem because of noisy data, misalignment between sensors, different timing, and computational cost.

### 3. What are the benefits of camera-only?

Camera-only has several advantages:

- simpler hardware;
- lower cost;
- visually rich semantic data;
- if scaling a large fleet, a lot of video data can be collected.

But cameras also have challenges:

- monocular depth estimation is difficult;
- lighting, rain, fog, and glare can affect them;
- strange or occluded objects can cause errors;
- strict validation is needed.

### 4. What are the benefits of sensor fusion?

Sensor fusion can increase robustness because sensors compensate for each other. For example, radar-camera fusion can assist object detection when the camera has trouble seeing or when velocity/distance information is needed.

But fusion also makes the system more complex:

- synchronizing timestamps;
- calibrating sensors;
- handling sensor failures;
- hardware costs;
- the perception pipeline is harder to debug.

### 5. Conclusion

The real trade-off isn't "camera vs LiDAR who wins". The trade-offs are:

```text
Cost vs Robustness
Simplicity vs Redundancy
Scale data vs Sensor diversity
End-to-end learning vs Debuggability
Product ambition vs Safety validation
```

For small projects like BFMC, the practical lesson is: clearly state what sensors you use, what the limits are, what the edge cases are, and what the fallback system is. Being able to state the system's limits is sometimes more important than showing off a model that detects well.

## References

- Tesla AI & Robotics: https://www.tesla.com/AI
- Tesla Full Self-Driving (Supervised) Support: https://www.tesla.com/support/fsd
- Multi-modal Sensor Fusion for Auto Driving Perception: https://arxiv.org/html/2202.02703v3
- Radar-Camera Fusion for Object Detection and Semantic Segmentation in Autonomous Driving: https://arxiv.org/abs/2304.10410
- A Survey on Occupancy Perception for Autonomous Driving: https://arxiv.org/html/2405.05173v2

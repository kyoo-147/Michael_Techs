---
title: >-
  From Mask R-CNN to Mask R-CNN2Go: when computer vision research goes into
  production
description: >-
  A note on how a computer vision idea from research can be optimized to run on
  real devices.
pubDatetime: '2023-02-09T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Computer Vision
  - Edge AI
  - Mask R-CNN2Go
  - Production ML
  - Segmentation
categories:
  - Technical
  - AI
draft: false
---

## Introduction

A good paper doesn't automatically become a good product.

In computer vision, the gap between research and production often lies in very mundane things: is the model fast enough, can it run on actual devices, how much memory does it consume, is it stable when lighting changes, and is it easy to integrate into the existing pipeline?

Meta's Mask R-CNN2Go is a case worth learning because it doesn't just talk about algorithms, but discusses the direction of bringing computer vision down to mobile/embedded devices.

### 1. From Mask R-CNN

Mask R-CNN is a powerful framework for instance segmentation. It detects objects and simultaneously generates a mask for each object instance.

In terms of research, it is very important because it groups several problems together:

- object detection;
- instance segmentation;
- keypoint detection;
- analyzing objects at a more detailed level than bounding boxes.

But research models are usually not directly optimized for resource-constrained environments.

### 2. To Mask R-CNN2Go

Meta announced Mask R-CNN2Go as a computer vision model optimized for embedded and mobile devices. According to the Meta Engineering post, this model serves on-device use cases such as:

- object detection;
- classification;
- person segmentation;
- body pose estimation;
- real-time inference.

The point to learn here is: the problem is no longer "highest accuracy on a benchmark", but "good enough accuracy, low enough latency, able to run on actual devices".

### 3. Production changes the technical questions

When doing production, the questions often change to:

- Can the model run in real-time?
- Do we need to send images to the server, or run locally?
- Does the device have enough RAM/CPU/GPU?
- If the model is wrong, how does the user/system react?
- Does the model need to be updated frequently?
- Can we log errors to improve the dataset?

With a QC camera in a factory, the questions are similar. A model that detects defects well but infers too slowly will still bottleneck the production line. A model that is accurate in the lab but fails when lighting changes is not usable enough.

### 4. A small example: QC camera

Suppose a system inspects blister packs:

```text
Camera → Preprocess → Model inference → Classification → QC decision → Report
```

If running on an edge device, we need to care about:

- whether the input image has a fixed size;
- whether to crop the region of interest before inference;
- whether the model can run within the time limit for each product;
- whether false negatives are more dangerous than false positives;
- whether results need to be saved for auditing.

Here, edge AI isn't just "deploying a smaller model". It's designing the entire processing flow to fit the real environment.

### 5. Lessons learned

I like the Mask R-CNN2Go case because it reminds us of something quite important: research is the starting point, production is where engineering gets tested.

A computer vision product needs more than a model. It needs cameras, data, preprocessing, inference, UI, logging, fallback, and operational procedures.

## References

- Meta Engineering — Facebook joins MLPerf, open-sources Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN paper: https://arxiv.org/abs/1703.06870
- FAIR at 5: https://engineering.fb.com/2018/12/05/ai-research/fair-fifth-anniversary/

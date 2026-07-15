---
title: 'Computer vision on edge devices: learning from Meta Mask R-CNN2Go'
description: >-
  A short post on edge AI, latency, and the questions to answer before bringing
  computer vision down to real devices.
pubDatetime: '2023-01-17T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Computer Vision
  - Edge AI
  - Meta
  - Mask R-CNN2Go
  - Real-time Inference
categories:
  - Technical
  - AI
draft: false
---

## Introduction

Edge AI sounds very appealing: the model runs right on the device, no need to send data to the server, lower latency, more private.

But edge AI is also where things get much more real. Devices have limits. CPU/GPU have limits. Memory has limits. The runtime environment is not as clean as a notebook.

Meta Mask R-CNN2Go is a good case to view edge AI through the lens of production.

### 1. Why is on-device computer vision important?

There are problems where you shouldn't or can't constantly send images/videos to the cloud:

- industrial cameras need fast responses;
- mobile apps need real-time AR;
- image data is sensitive;
- unstable network;
- cloud upload/inference costs are too high.

In these cases, running the model near the data source is the logical choice.

### 2. What does Meta Mask R-CNN2Go show?

Meta says Mask R-CNN2Go is a computer vision model optimized for embedded/mobile devices, supporting use cases like object detection, person segmentation, and body pose estimation with real-time inference.

This shows an important direction: to put a model into a product, it must be optimized for real running conditions.

It's not always the biggest model that is the best.

### 3. Checklist when bringing CV to the edge

Before deploying, you should ask:

- What is the required FPS?
- How many ms is allowed to process each frame?
- Is batching needed or inferring frame by frame?
- Does the input image need resizing/cropping?
- Does the model run stably when lighting changes?
- Do error images need to be saved for review?
- When the model is uncertain, what does the system do?

For example, with a QC camera, a false negative can let a defective product pass. Then the threshold, review workflow, and logging are just as important as the model.

### 4. A simple edge CV flow

```text
Industrial Camera
→ Frame Capture
→ Crop/Normalize
→ Edge Model Inference
→ Decision Rule
→ UI Alert / PLC Signal
→ Store Result for Audit
```

The good thing is this flow is not too complex, but it forces you to think from beginning to end.

### 5. Conclusion

Edge AI isn't just "running models locally". It is a product problem: latency, privacy, hardware, reliability, monitoring, and fallback.

If you're doing computer vision for production, this is a much-needed mindset: the model is just one block in a larger system.

## References

- Meta Engineering — Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN: https://arxiv.org/abs/1703.06870

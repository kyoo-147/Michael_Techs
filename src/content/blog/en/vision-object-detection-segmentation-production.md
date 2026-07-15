---
title: >-
  Vision, object detection and segmentation: understand correctly before putting
  into production
description: >-
  Short notes on object detection, segmentation, and why real computer vision
  problems often need more than a bounding box.
pubDatetime: '2023-03-02T00:00:00.000Z'
locale: en
author: Michael
tags:
  - Computer Vision
  - Object Detection
  - Segmentation
  - Mask R-CNN
  - AI Research
categories:
  - Technical
  - AI
draft: false
---

## Introduction

Many people start learning computer vision with a very familiar demo: feed an image into a model, and the model draws a bounding box around a person, car, water bottle, or some object.

That demo is nice, but if brought into a real product, it's still missing quite a lot.

A vision system in production usually needs to know not only **what object is there**, but also **exactly where the object is**, **what its boundaries are**, **how it affects the next decision**, and **what margin of error is acceptable**.

This post briefly notes the difference between object detection and segmentation, based on Mask R-CNN and related articles/research.

### 1. What questions does object detection answer?

Object detection usually answers three questions:

- What objects are in the image?
- What class does that object belong to?
- Which bounding box is the object in?

For example, in a product inspection camera, the model might return:

```json
{
  "class": "defect",
  "confidence": 0.91,
  "box": [120, 80, 260, 190]
}
```

This is enough for many problems: counting objects, detecting clear defects, warning when someone enters a danger zone.

But a bounding box is still a rectangle. It doesn't accurately describe the true shape of the object. If the object is curved, distorted, occluded, or has a very small defect area, a bounding box might be too coarse.

### 2. Segmentation goes one step further

Segmentation doesn't just draw boxes. It attempts to classify every pixel belonging to the object.

There are three common types:

- **Semantic segmentation:** what class each pixel belongs to, e.g., road, sky, person.
- **Instance segmentation:** distinguishing each individual object, e.g., person 1, person 2.
- **Panoptic segmentation:** combining semantic and instance.

Mask R-CNN is a famous framework because it both detects objects and generates a segmentation mask for each object instance. The Mask R-CNN paper presents how to extend Faster R-CNN by adding a branch to predict masks in parallel with the classification and bounding box branch.

The notable point is: object detection gives us "this object is here", while instance segmentation gives us "this object occupies exactly this region".

### 3. Why is this important in real products?

In industrial manufacturing, segmentation can be useful when defects do not fit neatly into a beautiful rectangle.

For example:

- blister packs with misaligned edges;
- deformed pills;
- a label with a small torn area;
- a thin scratch on the surface;
- overlapping objects.

If looking only at a bounding box, the system knows "there is a defect". But if it needs to measure the defect area, defect location, extent of spread, or compare with QC standards, segmentation provides better data.

In autonomous vehicles, segmentation is also important because the vehicle doesn't just need to know "there is a person ahead", but also needs to understand the road area, lanes, sidewalks, obstacles, drivable areas, and non-drivable areas.

### 4. A practical way of thinking

When choosing detection or segmentation, I wouldn't ask "which model is better", but rather ask:

- What is the final decision of the system?
- Is a bounding box enough to make a decision?
- Do we need to know the exact shape of the object?
- Does pixel-level error affect safety or quality?
- Does the latency allow running segmentation?

For example, for a dashboard counting defective products, detection might be enough. But for a QC machine needing to classify the severity of surface defects, segmentation is more worth considering.

### 5. Conclusion

Object detection is a good starting point. But when the product goes into a real environment, the question will shift from "can the model detect?" to "is the result good enough for the system to make a decision?".

This is also the difference between an AI demo and an AI product.

## References

- Mask R-CNN: https://arxiv.org/abs/1703.06870
- Meta Research — Mask R-CNN: https://research.facebook.com/publications/mask-r-cnn/
- Meta Engineering — Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/

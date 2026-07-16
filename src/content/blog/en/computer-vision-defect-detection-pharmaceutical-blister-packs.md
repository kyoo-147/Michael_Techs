---
title: "Computer vision defect detection for pharmaceutical blister packs"
description: "A case study on building a computer vision defect detection project for pharmaceutical blister packs, including inspection flow, dataset thinking, validation, and production constraints."
pubDatetime: "2026-07-15T08:00:00.000Z"
locale: en
author: Michael
featured: true
tags:
  - Computer Vision Defect Detection Project
  - Pharmaceutical QC
  - Machine Vision
  - Applied AI
  - Case Study
categories:
  - AI
  - Technical
  - Product
---

Pharmaceutical blister pack inspection is a good example of why computer vision projects need more than a model.

The problem sounds simple: detect defects on a blister pack. In practice, the system has to deal with lighting, reflection, packaging variation, camera position, tolerance rules, and the cost of false decisions.

This case study is about how I approached a **computer vision defect detection project** for pharmaceutical quality control.

## The inspection problem

The machine needs to identify defects such as missing tablets, damaged seals, wrong placement, surface contamination, broken pills, or unusual packaging states.

The important part is not only detection. The system must support a production inspection flow:

```txt
Capture image
    -> normalize lighting and region of interest
    -> inspect blister cells
    -> classify defect type
    -> show evidence frame
    -> route pass/fail decision
    -> save trace for review
```

In regulated environments, a result without evidence is weak. Operators need to understand why the system rejected a pack.

## Dataset thinking

The dataset is usually the hardest part.

A model trained only on clean examples will look impressive in a demo and fail in a factory. A practical dataset needs:

- normal packs across many lighting conditions;
- borderline samples that operators disagree on;
- examples from different packaging batches;
- defect samples with labels tied to inspection rules;
- images captured from the real camera setup, not only a lab setup.

The goal is not to maximize a single benchmark. The goal is to make the system stable under production variation.

## System design

I prefer a layered approach:

1. Use deterministic image processing for alignment, cropping, and obvious region detection.
2. Use ML/CV models for defect classification and anomaly detection.
3. Keep a review UI for uncertain cases.
4. Log every result with image evidence and inspection metadata.

This reduces risk. Not every part needs deep learning. Traditional image processing is often more predictable for alignment and simple geometry. The AI layer should focus on the uncertain visual judgment.

## Measuring success

The useful metrics are close to production:

- false reject rate;
- false accept rate;
- inspection latency per pack;
- operator override rate;
- defect recall by category;
- stability across lighting and batch changes.

Accuracy alone is not enough. A model that rejects too many good packs can slow production. A model that accepts bad packs creates quality risk.

## What I learned

Computer vision in manufacturing is an engineering system, not just a notebook.

The camera, lighting, UI, operator workflow, evidence trail, and maintenance plan matter as much as the model. A good defect detection system should be explainable enough for operators, measurable enough for engineers, and stable enough for production.

Related project: [Pharmaceutical QC Defect Detection Machine](/work/computer-vision-qc-system).


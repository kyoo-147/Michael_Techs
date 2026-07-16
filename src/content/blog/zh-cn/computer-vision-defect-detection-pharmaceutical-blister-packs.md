---
title: "用于药品 blister packs 的 computer vision defect detection"
description: "一个关于 pharmaceutical blister packs 缺陷检测的 computer vision case study，覆盖 inspection flow、dataset、validation 和生产约束。"
pubDatetime: "2026-07-15T08:00:00.000Z"
locale: zh-cn
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

药品 blister pack 检测说明了一个事实：computer vision 项目需要的不只是模型。

问题听起来简单：检测 blister pack 上的缺陷。但实际系统要处理光照、反光、包装差异、相机位置、容忍规则，以及错误判断的成本。

这是我设计 **computer vision defect detection project** 时采用的思路。

## 检测问题

机器需要识别缺片、seal 损坏、药片位置错误、表面污染、碎片或异常包装状态。

关键不只是 detect，而是进入生产 inspection flow：

```txt
Capture image
    -> normalize lighting and ROI
    -> inspect blister cells
    -> classify defect type
    -> show evidence frame
    -> route pass/fail decision
    -> save trace for review
```

在质量控制环境里，没有证据的结果很弱。operator 需要看到系统为什么 reject 一个 pack。

## Dataset 思维

dataset 往往是最难的部分。

只用干净样本训练的模型可能 demo 很好，但在工厂失败。实际 dataset 需要：

- 多种光照下的正常 pack；
- 人类也会犹豫的 borderline sample；
- 来自不同 packaging batch 的数据；
- 和 inspection rule 对齐的缺陷样本；
- 来自真实 camera setup 的图像。

目标不是优化一个 benchmark，而是在生产变化下保持稳定。

## 系统设计

我倾向于分层设计：

1. 用 deterministic image processing 做 alignment、crop 和明显区域检测。
2. 用 ML/CV model 做缺陷分类和 anomaly detection。
3. 对不确定样本保留 review UI。
4. 每个结果都保存 evidence image 和 inspection metadata。

不是每个部分都需要 deep learning。传统图像处理在 alignment 和简单几何上经常更稳定。AI 层应该处理真正困难的视觉判断。

## 如何衡量

有用的指标应接近生产：

- false reject rate；
- false accept rate；
- 每个 pack 的 inspection latency；
- operator override rate；
- 各类别 defect recall；
- 光照和 batch 变化下的稳定性。

Accuracy 不够。reject 太多好产品会拖慢产线，accept 坏产品会带来质量风险。

## 我学到的东西

制造业里的 computer vision 是工程系统，不是 notebook。

相机、光照、UI、operator workflow、evidence trail 和维护计划，与模型同样重要。好的 defect detection system 应该让 operator 能理解，让 engineer 能度量，并且在 production 中足够稳定。

相关项目：[Pharmaceutical QC Defect Detection Machine](/zh-cn/work/computer-vision-qc-system).


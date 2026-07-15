---
title: >-
  Tesla 纯视觉感知 (camera-only perception) vs 传感器融合 (sensor fusion)：真正的权衡
  (trade-off) 是什么？
description: 关于自动驾驶 (autonomous driving) 中纯视觉感知、占用网络感知 (occupancy perception) 和传感器融合的谨慎笔记。
pubDatetime: '2022-10-11T00:00:00.000Z'
locale: zh-cn
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

## 简介

在自动驾驶领域，“纯视觉还是传感器融合”的争论通常被说得非常极端。

一方说摄像头就够了，因为人类也是用眼睛开车的。另一方说自动驾驶汽车应该使用 LiDAR/雷达 (radar)/摄像头来提高安全性。但如果仔细观察，问题不仅仅是选择哪种传感器。问题在于感知系统 (perception system) 是否足够了解周围环境，从而做出安全的决策。

这篇文章并不试图绝对断言哪个方向是正确的。我只是从公开来源和调查研究中记录下这些权衡 (trade-off)。

### 1. Tesla 官方来源是怎么说的？

Tesla AI 页面表示，他们将深度神经网络 (deep neural networks) 应用于从感知到控制的问题。Tesla 还提到每个摄像头的网络 (per-camera networks) 分析原始图像 (raw images)，以执行语义分割 (semantic segmentation)、对象检测 (object detection) 和单目深度估计 (monocular depth estimation)。

Tesla FSD Support 页面也提到 FSD (Supervised) 使用具有 360 度视野的板载摄像头 (onboard cameras)，但强烈强调：FSD (Supervised) 需要主动的驾驶员监督 (active driver supervision)，并不会使车辆实现完全自动驾驶 (autonomous)。

这是写作时非常重要的一点：不要将 FSD Supervised 称为完全自动驾驶。

### 2. 什么是传感器融合 (Sensor fusion)？

传感器融合结合了多个数据源，例如摄像头、雷达和 LiDAR。

每种传感器都有其优缺点：

- 摄像头拥有丰富的语义信息，可以读取标志、颜色、车道线。
- 雷达在测量速度/距离方面很强，在某些天气条件下表现更好。
- LiDAR 提供更准确的 3D 几何结构，但价格昂贵且有其自身的权衡。

关于多模态融合 (multi-modal fusion) 的调查强调，由于数据嘈杂 (noisy data)、传感器之间的未对齐 (misalignment)、时间同步差异 (timing) 以及计算成本 (computational cost)，融合是一个难题。

### 3. 纯视觉 (Camera-only) 有什么好处？

纯视觉有一些优势：

- 硬件更简单；
- 成本更低；
- 具有丰富语义的图像数据；
- 如果扩大车队规模 (scale fleet)，可以收集大量的视频数据。

但摄像头也面临挑战：

- 单目图像 (monocular image) 的深度估计 (depth estimation) 很困难；
- 光线、雨、雾和眩光 (glare) 会对其产生影响；
- 奇怪的或被遮挡的物体可能会导致错误；
- 需要非常严格的验证 (validation)。

### 4. 传感器融合有什么好处？

传感器融合可以提高鲁棒性 (robustness)，因为传感器可以互相补偿。例如，当摄像头难以看清或需要速度/距离信息时，雷达-摄像头融合 (radar-camera fusion) 可以协助对象检测。

但融合也会使系统变得更加复杂：

- 同步时间戳 (timestamp)；
- 校准 (calibrate) 传感器；
- 处理传感器故障 (sensor failure)；
- 硬件成本；
- 感知管道 (perception pipeline) 更难调试 (debug)。

### 5. 结论

真正的权衡不是“摄像头还是 LiDAR 谁赢了”。权衡的是：

```text
成本 (Cost) vs 鲁棒性 (Robustness)
简单性 (Simplicity) vs 冗余性 (Redundancy)
规模化数据 (Scale data) vs 传感器多样性 (Sensor diversity)
端到端学习 (End-to-end learning) vs 可调试性 (Debuggability)
产品野心 (Product ambition) vs 安全验证 (Safety validation)
```

对于像 BFMC 这样的小型项目，实际的教训是：清楚地说明你使用了哪些传感器、限制是什么、边缘情况 (edge cases) 是什么，以及后备系统 (fallback system) 是怎样的。能够说明系统的局限性，有时比炫耀模型检测得有多好更重要。

## 参考资料

- Tesla AI & Robotics: https://www.tesla.com/AI
- Tesla Full Self-Driving (Supervised) Support: https://www.tesla.com/support/fsd
- Multi-modal Sensor Fusion for Auto Driving Perception: https://arxiv.org/html/2202.02703v3
- Radar-Camera Fusion for Object Detection and Semantic Segmentation in Autonomous Driving: https://arxiv.org/abs/2304.10410
- A Survey on Occupancy Perception for Autonomous Driving: https://arxiv.org/html/2405.05173v2

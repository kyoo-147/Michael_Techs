---
title: >-
  从 Mask R-CNN 到 Mask R-CNN2Go：当计算机视觉研究 (computer vision research) 走向生产环境
  (production)
description: 关于一个来自研究领域的计算机视觉想法，是如何被优化以在真实设备上运行的笔记。
pubDatetime: '2023-02-09T00:00:00.000Z'
locale: zh-cn
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

## 简介

一篇好论文不会自动变成一个好产品。

在计算机视觉中，研究与生产之间的差距通常在于一些非常平凡的事情：模型运行得够不够快，能否在真实设备上运行，消耗多少内存，在光线变化时是否稳定，以及是否容易集成到现有的管道 (pipeline) 中？

Meta 的 Mask R-CNN2Go 是一个值得学习的案例，因为它不仅仅讨论算法，还讨论了将计算机视觉引入移动/嵌入式设备 (mobile/embedded devices) 的方向。

### 1. 从 Mask R-CNN 开始

Mask R-CNN 是一个用于实例分割 (instance segmentation) 的强大框架。它能检测对象 (object detection)，并同时为每个对象实例生成一个掩码 (mask)。

在研究方面，它非常重要，因为它将几个问题组合在了一起：

- 对象检测 (object detection)；
- 实例分割 (instance segmentation)；
- 关键点检测 (keypoint detection)；
- 在比边界框 (bounding box) 更详细的层面上分析对象。

但是，研究模型通常不会直接针对资源受限的环境进行优化。

### 2. 走向 Mask R-CNN2Go

Meta 宣布 Mask R-CNN2Go 作为一个针对嵌入式和移动设备优化的计算机视觉模型。根据 Meta Engineering 的文章，该模型服务于设备端 (on-device) 的用例，例如：

- 对象检测；
- 分类 (classification)；
- 人物分割 (person segmentation)；
- 人体姿态估计 (body pose estimation)；
- 实时推理 (real-time inference)。

这里值得学习的一点是：问题不再是“在基准测试 (benchmark) 上获得最高准确率”，而是“准确率足够好，延迟 (latency) 足够低，能够在真实设备上运行”。

### 3. 生产环境改变了技术问题

当投入生产时，问题通常会变成：

- 模型可以实时 (real-time) 运行吗？
- 我们需要将图像发送到服务器，还是在本地 (local) 运行？
- 设备有足够的 RAM/CPU/GPU 吗？
- 如果模型出错，用户/系统会有什么反应？
- 模型需要频繁更新吗？
- 我们可以记录错误日志来改进数据集吗？

对于工厂里的 QC（质量控制）摄像头，问题也是类似的。一个能很好地检测缺陷但推理太慢的模型，仍然会成为生产线的瓶颈。一个在实验室中很准确但在光线变化时失效的模型是不够好用的。

### 4. 一个小例子：QC 摄像头

假设一个系统要检查泡罩包装 (blister packs)：

```text
摄像头 (Camera) → 预处理 (Preprocess) → 模型推理 (Model inference) → 分类 (Classification) → QC 决策 (QC decision) → 报告 (Report)
```

如果在边缘设备 (edge device) 上运行，我们需要关心：

- 输入图像是否有固定的尺寸；
- 是否需要在推理前裁剪 (crop) 感兴趣的区域；
- 模型能否在每个产品的时间限制内运行；
- 假阴性 (false negative) 是否比假阳性 (false positive) 更危险；
- 结果是否需要保存以供审计 (auditing)。

在这里，边缘 AI (edge AI) 不仅仅是“部署一个更小的模型”。它是设计整个处理流程以适应真实环境。

### 5. 经验教训

我喜欢 Mask R-CNN2Go 这个案例，因为它提醒了我们一件非常重要的事情：研究是起点，生产才是技术接受考验的地方。

一个计算机视觉产品需要的不仅仅是一个模型。它需要摄像头、数据、预处理、推理、用户界面 (UI)、日志记录 (logging)、后备方案 (fallback) 和操作流程 (operational procedures)。

## 参考资料

- Meta Engineering — Facebook joins MLPerf, open-sources Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN paper: https://arxiv.org/abs/1703.06870
- FAIR at 5: https://engineering.fb.com/2018/12/05/ai-research/fair-fifth-anniversary/

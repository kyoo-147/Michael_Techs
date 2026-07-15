---
title: 边缘设备上的计算机视觉 (Computer vision on edge devices)：向 Meta Mask R-CNN2Go 学习
description: 一篇关于边缘 AI (edge AI)、延迟 (latency) 以及将计算机视觉应用于实际设备之前需要回答的问题的短文。
pubDatetime: '2023-01-17T00:00:00.000Z'
locale: zh-cn
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

## 简介

边缘 AI (Edge AI) 听起来非常吸引人：模型直接在设备上运行，无需将数据发送到服务器，延迟更低，也更私密。

但边缘 AI 也是让事情变得更加现实的地方。设备有局限性。CPU/GPU 有局限性。内存有局限性。运行环境不如 notebook 干净。

Meta Mask R-CNN2Go 是一个很好的案例，可以从生产环境的角度来看待边缘 AI。

### 1. 为什么设备端 (on-device) 计算机视觉很重要？

有些问题不应该或不能不断地将图像/视频发送到云端：

- 工业相机需要快速响应；
- 移动应用需要实时 AR；
- 图像数据很敏感；
- 网络不稳定；
- 云端上传/推理成本太高。

在这些情况下，在靠近数据源的地方运行模型是合乎逻辑的选择。

### 2. Meta Mask R-CNN2Go 展示了什么？

Meta 表示，Mask R-CNN2Go 是一种针对嵌入式/移动设备优化的计算机视觉模型，支持对象检测 (object detection)、人物分割 (person segmentation) 和人体姿态估计 (body pose estimation) 等需要实时推理 (real-time inference) 的用例。

这显示了一个重要方向：要将模型投入产品，必须针对实际运行条件进行优化。

并非最大的模型就是最好的。

### 3. 将 CV 引入边缘时的检查清单 (Checklist)

在部署之前，你应该问：

- 要求的 FPS 是多少？
- 允许处理每帧多少毫秒 (ms)？
- 是否需要批处理 (batching)，还是逐帧推理？
- 输入图像需要调整大小 (resizing)/裁剪 (cropping) 吗？
- 当光线变化时，模型运行稳定吗？
- 是否需要保存错误图像以供查看 (review)？
- 当模型不确定时，系统会怎么做？

例如，对于 QC 摄像头，假阴性 (false negative) 会让有缺陷的产品通过。这时，阈值 (threshold)、审查工作流 (review workflow) 和日志记录 (logging) 与模型一样重要。

### 4. 一个简单的边缘 CV 流程

```text
工业相机 (Industrial Camera)
→ 帧捕获 (Frame Capture)
→ 裁剪/标准化 (Crop/Normalize)
→ 边缘模型推理 (Edge Model Inference)
→ 决策规则 (Decision Rule)
→ UI 警报 / PLC 信号 (UI Alert / PLC Signal)
→ 存储结果以供审计 (Store Result for Audit)
```

好的一点是这个流程并不太复杂，但它迫使你从头到尾进行思考。

### 5. 结论

边缘 AI 不仅仅是“在本地运行模型”。它是一个产品问题：延迟、隐私、硬件、可靠性、监控和回退机制 (fallback)。

如果你正在为生产环境做计算机视觉，这是一种非常需要的心态：模型只是更大系统中的一个模块。

## 参考资料

- Meta Engineering — Mask R-CNN2Go: https://engineering.fb.com/2018/12/12/ml-applications/mask-r-cnn2go/
- Mask R-CNN: https://arxiv.org/abs/1703.06870

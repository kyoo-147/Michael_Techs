---
title: "我是如何构建面向多语言运营的 edge AI translation system"
description: "一个关于 MoYi 的案例研究：为工厂、物流和多语言运营团队设计 edge AI translation system，重点处理术语、上下文和安全信息。"
pubDatetime: "2026-07-16T08:00:00.000Z"
locale: zh-cn
author: Michael
featured: true
tags:
  - Edge AI Translation System
  - MoYi
  - Applied AI
  - AI Engineering
  - Case Study
categories:
  - AI
  - Technical
  - Product
---

大多数翻译产品解决的是一个简单场景：输入一句话，然后得到一句翻译。

MoYi 的起点不同。在工厂、物流和远程运营团队里，翻译是 workflow 的一部分。一句话里可能包含机器名称、安全警告、内部流程或公司内部缩写。如果翻译丢失这些细节，问题不只是表达不自然，团队还可能损失时间、培训质量，甚至产生安全风险。

所以我把 MoYi 设计成一个 **edge AI translation system**，而不是一个套在翻译 API 外面的聊天界面。

## 产品问题

实际需求很清晰：翻译系统需要靠近用户运行，保留运营上下文，并减少对 cloud 的依赖。

系统需要支持：

- 产品名、机器名和内部术语的 glossary control；
- 对安全警告、操作指令和高优先级消息做单独处理；
- 在合适的情况下支持 local 或 edge execution；
- runtime 不绑定单一 backend；
- 为 desktop、Python tooling 和 mobile app 留出集成路径。

因此，架构比一开始选择哪个模型更重要。

## 架构

核心思路是把 workflow 和 inference backend 分离。

```txt
输入消息
    -> 语言和上下文标准化
    -> glossary lookup
    -> safety phrase detection
    -> translation request plan
    -> model/backend adapter
    -> validation and repair
    -> 最终结果
```

runtime 之后可以接 ONNX Runtime、llama.cpp、mobile runtime 或硬件加速。产品价值不依赖某一个 provider，而是依赖稳定的 pipeline。

这个 pipeline 也让测试更清楚。我可以分别评估 latency、glossary accuracy、safety phrase recall 和 memory usage，而不是只看一句输出是否“听起来不错”。

## 为什么 edge-first 重要

对于普通消费应用，把文本发到 cloud 可能可以接受。但对于企业内部运营，这不一定合适。

local-first 翻译层可以让组织更好地控制：

- 私有运营消息；
- 不应该泄露的内部术语；
- 会议或现场工作的延迟；
- 弱网或离线环境；
- 不同设备上的 model/runtime 选择。

这对 desktop、Android、embedded Linux，以及 Qualcomm/Intel edge 硬件都很有意义。

## 我学到的东西

翻译质量不只是模型问题，而是系统问题。

如果缺少 glossary，输出可能流畅但错误。如果没有识别安全警告，系统可能弱化紧急程度。如果 latency 太高，团队会停止使用。如果 runtime 被锁在一个 provider 上，产品会变脆弱。

MoYi 还在演进，但方向很明确：为多语言运营构建一个实用的翻译 runtime，把产品 workflow 和安全约束当作系统的一等公民。

相关项目：[MoYi Edge Translation](/zh-cn/work/moyi-edge-translation).


---
locale: zh-cn
title: "Rabbit SignLink"
summary: "使用 computer vision、local LLM processing 和 voice feedback 的 real-time sign language assistant。"
description: "Rabbit SignLink 是一个 archived AI sign language assistant。它使用 PyQt5、OpenCV、TensorFlow/Keras、SIFT/FLANN feature matching、CNN ASL model、local Ollama processing、Edge TTS 和 audio playback 来识别 hand gestures、组装句子并返回语音反馈。"
overview: "Rabbit SignLink 专注于通过 real-time gesture recognition 实现 assistive interaction。它结合 desktop GUI、tutorial flows、hybrid recognition、local language processing 和 voice synthesis。"
problem: "Sign language learning 与 communication tools 需要 real-time feedback、accessible UI，以及对 static signs 和 custom gestures 都足够稳健的 recognition。一个有用的 prototype 必须在处理 video、model inference 和 audio 时保持 UI responsive。"
approach: "项目结合 HSV hand ROI extraction、面向 ASL alphabet signs 的 CNN classification、面向 custom gestures 的 SIFT + FLANN matching、asynchronous PyQt threading、Ollama text processing 和 Edge TTS playback。"
role: "Founder / Computer Vision Engineer / AI Developer"
period: "2023"
featured: true
order: 10
heroImage: "/work/rabbit-signlink/demo.png"
video:
  src: "/work/rabbit-signlink/demo-small.mp4"
  label: "Rabbit SignLink demo"
  description: "Short walkthrough of the sign-language learning and recognition prototype."
gallery:
  - label: "Rabbit SignLink demo UI"
    src: "/work/rabbit-signlink/demo.png"
  - label: "Rabbit SignLink video demo"
    src: "/work/rabbit-signlink/demo-small.mp4"
showBody: false
metrics:
  - value: "CNN + SIFT"
    label: "hybrid sign recognition pipeline"
  - value: "PyQt5"
    label: "desktop learning and recognition flows"
  - value: "Assistive AI"
    label: "LLM and speech feedback for recognized signs"
outcomes:
  - "构建 hybrid sign recognition pipeline，结合 CNN classification 与 SIFT/FLANN matching。"
  - "实现 PyQt5 desktop flows，用于 sign learning、recognition 和 responsive video processing。"
  - "把 recognized text 接入 local LLM processing 与 speech synthesis，形成 assistive feedback。"
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/Rabbit-SignLink"
    note: "面向学术与研究社区：该项目最初是一个 open-source research initiative，用于探索面向聋人和听障社区的 accessibility solution。归档状态：项目已正式归档，不再活跃开发；核心依赖如旧版 Keras/TensorFlow 可能已经过时。归档目的：当前所有更新和配置仅用于归档、历史保存和学术参考。"
---

## Context

Rabbit SignLink 是 archived assistive AI project，用于 gesture recognition 与 voice feedback。

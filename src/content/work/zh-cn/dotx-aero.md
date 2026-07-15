---
locale: zh-cn
title: "DotX Aero"
summary: "本地 smart home voice assistant 与 IoT control system。"
description: "DotX Aero 是一个 archived smart home voice assistant 与 IoT control system。项目结合本地 wake-word detection、越南语 speech recognition、WebSocket communication、通过 Ollama 进行 local LLM inference、MQTT device commands、ESP32 firmware、weather queries、TTS 和可选 web chatbot 功能。"
overview: "DotX Aero 被设计为 privacy-oriented local assistant，用于 smart home control。它把 voice acquisition、AI reasoning 和 hardware execution 分成 client、server 与 device 三层。"
problem: "Voice-controlled smart home system 往往高度依赖 cloud services 和脆弱 integration。该项目探索一种本地架构，能够理解越南语命令、控制物理 relays，并在消费级硬件上保持低 latency。"
approach: "系统使用 edge client 处理 wake word、STT、WebSocket messaging 与 TTS；使用 Python server 处理 Ollama reasoning、weather queries、MQTT actions 与 music playback；并使用 ESP32 firmware 执行 MQTT-over-WebSocket hardware control。"
role: "Founder / AI Engineer / IoT Developer"
period: "2024"
featured: true
order: 7
heroImage: "/work/dotx/system.png"
highlights:
  - title: "System architecture"
    description: "Local voice assistant, AI server, MQTT and ESP32 device execution layers."
    src: "/work/dotx/system.png"
video:
  src: "/work/dotx/demo.mp4"
  label: "DotX Aero demo"
  description: "Demo of local AI voice control for smart-home devices."
gallery:
  - label: "DotX Aero system architecture"
    src: "/work/dotx/system.png"
  - label: "DotX Aero video demo"
    src: "/work/dotx/demo.mp4"
showBody: false
metrics:
  - value: "Local AI"
    label: "Ollama reasoning for smart-home control"
  - value: "ESP32"
    label: "MQTT device execution layer"
  - value: "Voice UX"
    label: "Vietnamese wake word, STT, and TTS flows"
outcomes:
  - "设计 voice client、AI server 与 ESP32 device firmware 的三层架构。"
  - "把 local LLM reasoning 连接到 MQTT-based smart home control。"
  - "构建越南语语音交互流程，包含 wake word detection、STT 与 TTS feedback。"
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/DotX_Aero"
    note: "归档说明：该项目约 2 年前开发，目前已停止活跃维护。当前更新仅用于归档目的。项目所使用的技术可能已经过时，该 repository 仅建议作为参考资料使用。"
---

## Context

DotX Aero 是 archived local voice assistant，用于 smart home 与 IoT control。

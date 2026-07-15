---
title: 为 AI Agent 设计远程终端/WebSocket 仪表板
description: 有关如何设计实时仪表板，以通过 WebSocket 监控和控制在终端中运行的 AI Agent 的技术笔记。
pubDatetime: '2023-12-07T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Technical Notes
  - WebSocket
  - AI Agents
  - Dashboard
  - Remote Terminal
  - Developer Tools
  - Realtime System
categories:
  - Technical
  - AI
---

## 引言

在使用像 Claude Code、ChatGPT CLI 或基于终端的 AI 编码代理 (AI coding agents) 时，问题不再仅仅是“代理会写代码吗？”。一个更实际的问题是：**我怎么知道代理在做什么、它在运行什么任务、它是否卡住了，以及我是否需要干预？**

我重新梳理了 browser-based terminal control 的一些设计模式，觉得这个方向非常实用：将浏览器变成一个终端界面，用于监控和控制运行中的代理。这类系统通常结合 browser terminal、类似 Xterm.js 的渲染方式，以及 process bridge，让用户可以查看正在运行的会话，而不必搭建完整的 SSH 工作流。

本文并不是克隆某个现有工具的教程。我想记录一个更小型的设计：**用于 AI Agent 的远程终端/WebSocket 仪表板**，适用于个人项目或小型团队。

## 1. 问题所在

并行运行多个 AI 代理时，我们经常遇到以下问题：

- 每个代理在不同的终端中运行。
- 我们不知道哪个代理正在分析代码，哪个正在运行测试，哪个出现了错误。
- 如果我们让代理运行很长时间，我们必须回到主机器上进行检查。
- 没有一个集中的状态可以查看整个工作会话。
- 如果代理编辑代码或运行危险的命令，我们需要一种机制来观察和控制它。

对于产品或工程人员来说，这是一个**针对开发者工作流的可观察性 (observability for developer workflow)** 问题。

我们需要的不仅仅是一个终端。我们需要一个能快速回答以下问题的仪表板：

```text
哪个代理正在运行？
它在做什么任务？
最新的输出是什么？
有错误吗？
可以暂停/停止/重新启动它吗？
有日志可以查看吗？
```

## 2. 系统构思

最简单的设计包含 4 个部分：

```text
浏览器仪表板 (Browser Dashboard)
      ↓ WebSocket
后端网关 (Backend Gateway)
      ↓ 进程/会话管理器 (process/session manager)
终端 / 代理会话 (Terminal / Agent Sessions)
      ↓ 日志/事件 (logs/events)
存储 / 日志历史 (Storage / Log History)
```

其中：

- **浏览器仪表板**：用于查看代理会话列表、终端输出、状态和当前任务的界面。
- **WebSocket 网关**：保持浏览器和后端之间的实时连接。
- **会话管理器**：管理代理进程、终端会话和命令输入/输出。
- **日志存储**：保存重要事件和输出以供将来调试。

WebSocket 很合适，因为浏览器和服务器需要持续的双向通信：服务器在生成新输出时将其推送到浏览器，浏览器向服务器发送命令/暂停/停止请求。

## 3. 为什么使用 WebSocket？

如果使用 HTTP 轮询 (polling)，前端必须不断询问服务器：

```text
有新日志了吗？
有新日志了吗？
有新日志了吗？
```

这种方法很简单，但浪费请求且并非真正的实时。

WebSocket 在浏览器和服务器之间打开了一个双向连接。连接打开后，服务器可以在终端生成新日志时立即将输出推送到浏览器。浏览器也可以将命令发送回服务器，而无需创建新的请求。

对于 AI Agent 仪表板，WebSocket 非常适合以下流程：

- 流式传输终端输出
- 更新代理状态
- 从浏览器发送命令
- 实时监控进度
- 报告错误或警告

## 4. 最小数据模型

会话不应该只是文本输出。它应该有清晰的元数据。

```ts
export type AgentSession = {
  id: string;
  name: string;
  projectPath: string;
  status: "idle" | "running" | "error" | "stopped";
  currentTask?: string;
  branch?: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentEvent = {
  id: string;
  sessionId: string;
  type: "stdout" | "stderr" | "status" | "command" | "system";
  message: string;
  createdAt: string;
};
```

重要的一点是将**会话状态 (session state)**和**事件流 (event stream)**分开。会话状态用于快速渲染列表。事件流用于查看详细日志。

## 5. WebSocket 消息契约 (Message contract)

不要让 WebSocket 随便发送文本。要有明确的契约。

```ts
type ClientMessage =
  | { type: "subscribe"; sessionId: string }
  | { type: "send_command"; sessionId: string; command: string }
  | { type: "stop_session"; sessionId: string }
  | { type: "set_title"; sessionId: string; title: string };

type ServerMessage =
  | { type: "session_snapshot"; session: AgentSession }
  | { type: "session_event"; event: AgentEvent }
  | { type: "session_status"; sessionId: string; status: AgentSession["status"] }
  | { type: "error"; message: string };
```

我喜欢这种方法，因为以后前端、后端和代理运行器 (agent runner) 可以更独立地进行开发。

## 6. UI 仪表板应该有什么？

一个简单的仪表板可以分为 3 列：

```text
左侧：代理会话 (Agent Sessions)
中间：终端输出 (Terminal Output)
右侧：会话信息/操作 (Session Info / Actions)
```

### 左侧 — 会话列表

显示：

- 会话名称
- 项目名称
- 当前任务
- 运行中/错误/空闲 徽章
- 最后活跃时间

### 中间 — 终端输出

显示：

- stdout/stderr 流
- 如有必要，提供轻量级的语法高亮
- 自动滚动切换 (auto-scroll toggle)
- 搜索日志
- 复制输出

### 右侧 — 控制面板

显示：

- 项目路径
- 当前分支
- 当前任务
- 按钮：暂停、停止、重新启动
- 允许远程控制时的命令输入框

## 7. 需要注意的事项

远程终端是非常敏感的。如果处理不当，它们可能成为进入你的机器或服务器的后门。

一些最低限度的规则：

- 未经身份验证，请勿公开访问。
- 没有白名单，不允许自由执行命令。
- 记录从仪表板发送的每个命令。
- 区分只读模式和控制模式。
- 不要将机密信息 (secrets) 流式传输到前端。
- 提供关闭会话 (kill session) 的按钮。
- 为长时间不活动的会话设置超时。

对于第一个版本，我会先将仪表板构建为**只读 (read-only)**：只查看会话、状态和输出。系统稳定后再添加命令输入功能。

## 8. 示例工作流

```text
1. 用户打开仪表板。
2. 前端调用 API 获取会话列表。
3. 用户选择一个会话。
4. 前端打开 WebSocket 并订阅该会话。
5. 后端发送当前快照 (snapshot)。
6. 每次终端有新输出时，后端发送 session_event。
7. 如果代理失败，后端发送 session_status = error。
8. 如果用户有权限，可以停止或重启会话。
```

前端伪代码示例：

```ts
const socket = new WebSocket("ws://localhost:3001/ws");

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: "subscribe",
    sessionId: selectedSessionId,
  }));
};

socket.onmessage = event => {
  const message = JSON.parse(event.data);

  if (message.type === "session_event") {
    appendTerminalLine(message.event);
  }

  if (message.type === "session_status") {
    updateSessionStatus(message.sessionId, message.status);
  }
};
```

## 9. 我会在哪里应用它？

对于 AI 工作流项目，我可以使用此仪表板来监控：

- 正在阅读 OneClick CRM 代码库的代理
- 正在为 API 编写测试的代理
- 正在对提示词管道进行评估的代理
- 正在迁移数据或生成文档的代理
- 正在运行计算机视觉训练脚本的代理

重要的是，仪表板不仅仅是为了好看。当 AI 开始参与软件开发过程时，它可以帮助我更好地控制工作流。

## 10. 结论

为 AI Agent 构建远程终端/WebSocket 仪表板并非遥不可及的想法。它是现代开发者工作流的观察和控制层。

我的主要经验教训：

- WebSocket 非常适合实时终端输出。
- 会话元数据与终端日志一样重要。
- 应该从只读仪表板开始。
- 必须从一开始就考虑安全性。
- AI Agent 运行得越自动化，人类就越需要仪表板来进行观察。

## 参考资源

- MDN WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- MDN WebSocket object: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

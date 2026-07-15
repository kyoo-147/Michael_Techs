---
title: Designing a Remote Terminal/WebSocket Dashboard for AI Agents
description: >-
  Technical notes on designing a real-time dashboard to monitor and control AI
  agents running in the terminal via WebSocket.
pubDatetime: '2023-12-07T00:00:00.000Z'
locale: en
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

## Introduction

When working with AI coding agents like Claude Code, ChatGPT CLI, or terminal-based agents, the issue is no longer just "can the agent code?". A more practical issue is: **how do I know what the agent is doing, what task it's running, if it's hanging, and if I need to intervene?**

I looked at browser-based terminal control patterns and found the idea practical: turning the browser into a terminal interface to monitor and control running agents. Tools in this space often combine a browser terminal, Xterm.js-style rendering, and a process bridge so the user can inspect a running session without setting up a full SSH workflow.

This post is not a tutorial for cloning an existing tool. I want to note down a smaller design: a **remote terminal/WebSocket dashboard for AI agents**, applicable for a personal project or a small team.

## 1. The Problem

When running multiple AI agents in parallel, we often encounter these problems:

- Each agent runs in a different terminal.
- We don't know which agent is analyzing code, which is running tests, or which has failed.
- If we leave the agent running for a long time, we have to return to the main machine to check.
- There is no centralized state to see the entire working session.
- If the agent edits code or runs dangerous commands, we need a mechanism to observe and control it.

For a product or engineering person, this is an **observability for developer workflow** problem.

We don't just need a terminal. We need a dashboard that quickly answers:

```text
Which agent is running?
What task is it doing?
What is the latest output?
Are there any errors?
Can it be paused/stopped/restarted?
Are there logs to review?
```

## 2. System Idea

The simplest design consists of 4 parts:

```text
Browser Dashboard
      ↓ WebSocket
Backend Gateway
      ↓ process/session manager
Terminal / Agent Sessions
      ↓ logs/events
Storage / Log History
```

Where:

- **Browser Dashboard**: interface to view the list of agent sessions, terminal output, status, and current task.
- **WebSocket Gateway**: maintains a real-time connection between the browser and the backend.
- **Session Manager**: manages agent processes, terminal sessions, and command input/output.
- **Log Storage**: saves important events and output for future debugging.

WebSocket is suitable because the browser and server need continuous two-way communication: the server pushes new output to the browser, and the browser sends command/pause/stop requests to the server.

## 3. Why use WebSocket?

If using HTTP polling, the frontend has to continuously ask the server:

```text
Is there a new log?
Is there a new log?
Is there a new log?
```

This method is simple but wastes requests and is not truly real-time.

WebSocket opens a two-way connection between the browser and the server. Once the connection is opened, the server can push output to the browser as soon as the terminal generates a new log. The browser can also send commands back to the server without creating a new request.

For an AI agents dashboard, WebSocket is perfect for flows like:

- streaming terminal output
- updating agent status
- sending commands from the browser
- monitoring progress in real-time
- reporting errors or warnings

## 4. Minimal data model

A session shouldn't just be text output. It should have clear metadata.

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

The important point is to separate the **session state** and **event stream**. The session state is used for fast list rendering. The event stream is used for viewing detailed logs.

## 5. WebSocket message contract

Don't let WebSocket send random text. Have a clear contract.

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

I like this approach because later the frontend, backend, and agent runner can be developed more independently.

## 6. What should the UI dashboard have?

A simple dashboard can be divided into 3 columns:

```text
Left: Agent Sessions
Center: Terminal Output
Right: Session Info / Actions
```

### Left — Session list

Display:

- session name
- project name
- current task
- running/error/idle badge
- last active time

### Center — Terminal output

Display:

- stdout/stderr stream
- light syntax highlight if needed
- auto-scroll toggle
- search log
- copy output

### Right — Control panel

Display:

- project path
- current branch
- current task
- buttons: pause, stop, restart
- command input if remote control is allowed

## 7. Things to be careful about

Remote terminals are quite sensitive. If not handled carefully, they can become an open door into your machine or server.

Some minimum rules:

- Do not make it public without authentication.
- Do not allow free command execution without an allowlist.
- Log every command sent from the dashboard.
- Separate read-only and control modes.
- Do not stream secrets to the frontend.
- Have a button to kill the session.
- Have a timeout for sessions inactive for too long.

For the first version, I would build the dashboard as **read-only** first: only view sessions, status, and output. Add command input when the system is stable.

## 8. Example workflow

```text
1. User opens the dashboard.
2. Frontend calls API to get the list of sessions.
3. User selects a session.
4. Frontend opens WebSocket and subscribes to that session.
5. Backend sends the current snapshot.
6. Every time the terminal has new output, backend sends session_event.
7. If agent fails, backend sends session_status = error.
8. User can stop or restart the session if they have permission.
```

Example pseudo-code on the frontend:

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

## 9. Where will I apply this?

For AI workflow projects, I can use this dashboard to monitor:

- an agent reading the OneClick CRM codebase
- an agent writing tests for an API
- an agent running evaluation for a prompt pipeline
- an agent migrating data or generating docs
- an agent running a computer vision training script

The important thing is that the dashboard is not just for looks. It helps me better control the workflow when AI starts participating in the software development process.

## 10. Conclusion

A remote terminal/WebSocket dashboard for AI agents is not a far-fetched idea. It is an observation and control layer for modern developer workflows.

My main lessons:

- WebSocket is great for real-time terminal output.
- Session metadata is as important as terminal logs.
- Start with a read-only dashboard first.
- Security must be considered from the start.
- The more automatically AI agents run, the more humans need a dashboard to observe.

## References

- MDN WebSocket API: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
- MDN WebSocket object: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

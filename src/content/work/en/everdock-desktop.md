---
locale: en
title: "EverDock Desktop"
summary: "A desktop-first AI developer workstation for operating coding agents across local machines, SSH servers, and managed runners."
description: "EverDock Desktop is an AI agent control plane for developers and teams that run coding agents such as Codex, Claude Code, OpenCode, Agy, Antigravity, and other agent CLIs across local machines, VPS instances, SSH targets, and managed servers. It turns agent work into observable sessions, task runs, terminal panes, approval requests, diffs, artifacts, and audit events."
overview: "EverDock is built around the idea that AI coding agents are becoming software workers, not just chat interfaces. A single agent in a single terminal can be managed manually, but multiple agents working across repositories and servers need orchestration, visibility, approval enforcement, durable sessions, event replay, and cost controls. The product is currently being tested inside real developer workflows to improve how engineers assign tasks, monitor long-running agent sessions, review diffs and test evidence, approve risky actions, and continue work from different devices."
problem: "Modern coding agents can read codebases, edit files, run shell commands, install dependencies, create diffs, run tests, and deploy software. That power creates a new operations problem: developers need to know which agent is doing what, where it is running, what files changed, which commands were executed, whether a session is stuck, how much compute or token budget is being consumed, and which actions require human approval. Terminal tools, SSH clients, and remote desktops solve access, but they do not provide a control plane for AI workers."
approach: "EverDock uses a Tauri/React desktop workstation with a Rust core, local state, terminal/process abstractions, and a planned Runner layer that executes work on local machines, SSH servers, or managed servers. The product model centers on Account, Space, Workspace, ExecutionTarget, WorkspaceBinding, Runner, Session, Pane, TaskRun, AgentSession, ActionIntent, Approval, Policy, Artifact, FileChange, Diff, and Event. Risky actions are meant to be enforced at the Runner executor rather than only in the UI, so approvals, budgets, command policy, secret access, and audit trails remain part of the execution boundary."
role: "Founder / Product Builder / Desktop Application Engineer"
period: "2026 - present"
featured: true
order: 4
heroImage: "/work/everdock/work.png"
showBody: false
metrics:
  - value: "AI Workstation"
    label: "desktop control plane for coding agents"
  - value: "Runner Model"
    label: "local, SSH, and managed execution targets"
  - value: "Approval"
    label: "risk-based gates for commands and changes"
outcomes:
  - "Developed EverDock into a functional desktop-first AI workstation prototype for managing workspaces, sessions, terminals, tasks, agents, approvals, and server/runner operations in one workspace."
  - "Being tested by a group of developers in real software development workflows, including local workstation use, remote server control, long-running agent tasks, and human terminal takeover when needed."
  - "Consolidates scattered terminals, SSH clients, dashboards, workspaces, and agent sessions into a unified workstation to reduce context switching and improve operational visibility."
  - "Structures agent work as task runs linked to a workspace, repository, execution target, terminal session, file changes, test results, approval requests, artifacts, and completion/failure state."
  - "Shaped a risk-based approval model for command execution, sensitive file edits, dependency installation, secret access, git push, database migration, deployment, and production operations."
  - "Validated a human-in-the-loop workflow where agents handle long-running or repetitive work while developers focus on diff review, test evidence, approve/reject decisions, and exception handling."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/EverDock_Desktop"
    note: "The repository currently represents a functional desktop prototype and architecture exploration. Runner, managed server, sync, and enterprise governance layers are part of the commercial product direction and may not be fully public yet."
highlights:
  - title: "Screen Fleet"
    description: "Monitor local machines, SSH targets, remote terminals, preview sessions, server health, and intervention points from one operator surface."
    src: "/work/everdock/screen-fleet.png"
  - title: "Agent Fleet"
    description: "Track coding agents, runtime profiles, capabilities, connection state, permissions, and assigned work across multiple development environments."
    src: "/work/everdock/agent.png"
  - title: "Session Management"
    description: "Inspect durable sessions, terminal panes, task context, event timelines, file changes, test evidence, and human takeover points."
    src: "/work/everdock/session.png"
  - title: "Agent Routing"
    description: "Route work across Codex, Claude Code, OpenCode, Agy, Antigravity, local agents, and other CLI runtimes by task, risk, cost, and environment."
    src: "/work/everdock/routing.png"
timeline:
  - date: "01.2026"
    label: "AI developer workstation and agent control plane positioning"
  - date: "02.2026"
    label: "Desktop-first product surface with Tauri, React, TypeScript, and operational screens"
  - date: "03.2026"
    label: "Core ontology for workspace, session, pane, task run, agent session, approval, and event"
  - date: "04.2026"
    label: "Runner, Server Dock, durable session, and approval enforcement architecture"
  - date: "05.2026"
    label: "Agent routing, policy, budget guardrails, audit replay, and multi-device control direction"
  - date: "Present"
    label: "Testing in developer workflows and refining the commercial AI developer operations platform"
storyBlocks:
  - title: "Beyond an AI chat terminal"
    body: "EverDock starts from a simple observation: AI coding agents are no longer only answering questions. They can run commands, edit files, create diffs, run tests, and request approval. Once that work happens across servers and repositories, the product needs to manage the whole execution lifecycle, not just a chat box."
  - title: "Agents as software workers"
    body: "A task becomes a task run, a task run creates an agent session, and the session produces panes, commands, logs, file changes, diffs, approvals, test results, artifacts, and events. This model gives the operator a way to inspect and resume work instead of guessing what happened inside a terminal."
  - title: "Risk is part of the workflow"
    body: "EverDock treats risky actions as product events. Reading files, editing code, installing packages, pushing branches, deploying, touching secrets, or running migrations should not all have the same permission model. Approval enforcement belongs near the Runner executor so safety is not only a UI promise."
  - title: "From workstation to business platform"
    body: "The commercial direction is an AI developer operations platform: desktop control plane, local and remote runners, managed servers, team workspaces, API access, mobile/Telegram control, policy, audit, usage limits, and paid plans based on seats, runners, compute, storage, and managed infrastructure."
gallery:
  - label: "Product workflow / operator journey"
    src: "/work/everdock/product-workflow.png"
  - label: "System architecture overview"
    src: "/work/everdock/system-architecture-overview.png"
  - label: "Runner and Server Dock architecture"
    src: "/work/everdock/runner-server-dock-architecture.png"
  - label: "Multi-device control plane"
    src: "/work/everdock/multi-device-control-plane.png"
  - label: "Policy, secrets, and budget guardrails"
    src: "/work/everdock/policy-secrets-budget-guardrails.png"
---

## Context

EverDock Desktop is a desktop-first AI developer workstation for operating coding agents as observable, reviewable, and policy-controlled software workers across local and remote execution environments.

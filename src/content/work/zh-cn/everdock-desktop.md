---
locale: zh-cn
title: "EverDock Desktop"
summary: "一个 desktop-first AI developer workstation，用于在本地机器、SSH server 和 managed runner 上运行 coding agents。"
description: "EverDock Desktop 是面向开发者和团队的 AI agent control plane，用于在 local machine、VPS、SSH target 和 managed server 上运行 Codex、Claude Code、OpenCode、Agy、Antigravity 以及其他 agent CLI。它把 agent 的工作转化为可观察、可审批、可审计的 session、task run、terminal pane、approval request、diff、artifact 和 event。"
overview: "EverDock 的出发点是：AI coding agent 正在成为 software worker，而不只是聊天界面。一个 agent 在一个 terminal 中可以手动管理，但多个 agent 跨 repository 和 server 工作时，就需要 orchestration、visibility、approval enforcement、durable session、event replay 和 cost control。产品目前正在真实 developer workflow 中试验，用于优化任务分配、长时间 agent session 监控、diff/test evidence review、风险操作审批，以及从不同设备继续工作。"
problem: "现代 coding agent 可以读取 codebase、修改文件、运行 shell command、安装依赖、生成 diff、运行测试并部署软件。这种能力带来了新的运营问题：开发者需要知道哪个 agent 在做什么、运行在哪里、哪些文件被修改、执行了哪些命令、session 是否卡住、token/compute 消耗多少，以及哪些动作需要 human approval。Terminal、SSH client 和 remote desktop 解决的是机器访问问题，但还不是 AI worker 的 control plane。"
approach: "EverDock 使用 Tauri/React desktop workstation，结合 Rust core、local state、terminal/process abstraction，并规划 Runner layer 在 local machine、SSH server 或 managed server 上执行工作。产品模型围绕 Account、Space、Workspace、ExecutionTarget、WorkspaceBinding、Runner、Session、Pane、TaskRun、AgentSession、ActionIntent、Approval、Policy、Artifact、FileChange、Diff 和 Event。高风险动作应在 Runner executor 层被 enforce，而不只是 UI 中的提示，这样 approval、budget、command policy、secret access 和 audit trail 才能成为 execution boundary 的一部分。"
role: "Founder / Product Builder / Desktop Application Engineer"
period: "2026 - 至今"
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
  - "将 EverDock 发展为 functional desktop-first AI workstation prototype，用于在一个 workspace 中管理 workspace、session、terminal、task、agent、approval 和 server/runner operations。"
  - "正在由一组开发者在真实软件开发 workflow 中试用，覆盖本地 workstation、remote server control、长时间 agent task，以及必要时由人类接管 terminal。"
  - "把分散的 terminal、SSH client、dashboard、workspace 和 agent session 汇聚到统一 workstation 中，减少上下文切换并提升运营可见性。"
  - "将 agent 工作结构化为 task run，并关联 workspace、repository、execution target、terminal session、file changes、test results、approval requests、artifacts 和 completion/failure state。"
  - "形成 risk-based approval model，用于 command execution、重要文件修改、dependency installation、secret access、git push、database migration、deployment 和 production operations。"
  - "验证 human-in-the-loop workflow：agent 处理长时间或重复性工作，developer 聚焦 diff review、test evidence、approve/reject decision 和异常处理。"
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/EverDock_Desktop"
    note: "当前 repository 主要体现 functional desktop prototype 和 architecture exploration。Runner、managed server、sync 与 enterprise governance 属于商业产品方向，可能尚未完整公开。"
highlights:
  - title: "Screen Fleet"
    description: "从一个运营界面监控 local machines、SSH targets、remote terminals、preview sessions、server health 和需要人工介入的位置。"
    src: "/work/everdock/screen-fleet.png"
  - title: "Agent Fleet"
    description: "管理 coding agents、runtime profiles、capabilities、connection state、permissions，以及它们在不同开发环境中的任务分配。"
    src: "/work/everdock/agent.png"
  - title: "Session Management"
    description: "检查 durable sessions、terminal panes、task context、event timelines、file changes、test evidence 和 human takeover points。"
    src: "/work/everdock/session.png"
  - title: "Agent Routing"
    description: "根据 task、risk、cost 和 environment，在 Codex、Claude Code、OpenCode、Agy、Antigravity、local agents 和其他 CLI runtimes 之间路由工作。"
    src: "/work/everdock/routing.png"
timeline:
  - date: "01.2026"
    label: "AI developer workstation 与 agent control plane 定位"
  - date: "02.2026"
    label: "基于 Tauri、React、TypeScript 和运营界面的 desktop-first product surface"
  - date: "03.2026"
    label: "Workspace、session、pane、task run、agent session、approval 与 event 的 core ontology"
  - date: "04.2026"
    label: "Runner、Server Dock、durable session 与 approval enforcement architecture"
  - date: "05.2026"
    label: "Agent routing、policy、budget guardrails、audit replay 与 multi-device control direction"
  - date: "至今"
    label: "在 developer workflows 中试验，并完善商业化 AI developer operations platform"
storyBlocks:
  - title: "不只是 AI chat terminal"
    body: "EverDock 的起点很简单：AI coding agent 已经不只是回答问题。Agent 可以运行命令、修改文件、生成 diff、运行测试并请求 approval。当这些工作发生在多个 server 和 repository 上时，产品需要管理完整 execution lifecycle，而不只是一个聊天框。"
  - title: "把 agent 当作 software worker"
    body: "一个 task 会变成 task run，task run 创建 agent session，而 session 产生 pane、command、log、file change、diff、approval、test result、artifact 和 event。这个模型让 operator 可以 inspect 和 resume 工作，而不是猜 terminal 里发生了什么。"
  - title: "Risk 是 workflow 的一部分"
    body: "EverDock 把风险动作视为 product event。读取文件、修改代码、安装 package、push branch、deploy、访问 secret 或执行 migration 不应共享同一种 permission model。Approval enforcement 需要靠近 Runner executor，安全才不只是 UI 承诺。"
  - title: "从 workstation 到 business platform"
    body: "商业方向是 AI developer operations platform：desktop control plane、local/remote runner、managed server、team workspace、API access、mobile/Telegram control、policy、audit、usage limit，以及按 seat、runner、compute、storage 和 managed infrastructure 计费的 paid plans。"
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

EverDock Desktop 是一个 desktop-first AI developer workstation，用于把 coding agents 作为可观察、可 review、可通过 policy 控制的软件 worker 运行在本地和远程执行环境中。

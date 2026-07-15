---
locale: zh-cn
title: "Together Working"
summary: "面向本地 AI worker teams 的 CLI-first AI Department Operating System，用于 task orchestration、review、verification 与 integration。"
description: "Together Working 是本地 AI worker control plane，目前已经演进为运行在开发者机器上的 CLI/TUI。它通过 task contracts、worker routing、daemon-owned state、review/approval flows、verification gates 与 operator reports 协调 Codex、Claude、Gemini、Amp、OpenCode 和其他 agent CLI。"
overview: "Together Working 不把整个项目交给一个不断膨胀 context 的 agent，而是把工作拆成小范围 task，route 给合适 worker，通过 CLI 跟踪状态，并让 Codex 保持最终 coordinator/integrator 角色。项目目前正在积极开发，并在开发者工作会话中测试，用于改进 workflow 和测量 performance。"
problem: "大型 AI coding session 容易变得昂贵、失去 scope control、难以追踪哪个 worker 修改了哪个文件，也难以验证输出并安全集成多 agent 结果。当 provider 失败、未登录或输出质量较弱时，如果没有 readiness、fallback、review 与 verification，整个 workflow 容易停滞。"
approach: "Together Working 使用 Rust CLI、本地 daemon、task monitor、task views、settings、skill bridge、worker registry、readiness checks、scoped task contracts、approval/review commands、verification artifacts 与 reporting。Daemon 负责 control/state；CLI/TUI 是 thin client，开发者用它 monitor work、submit tasks、review results、approve 或 block integration。"
role: "Founder / Product Builder / AI Systems Engineer"
period: "2026 - 现在"
featured: true
order: 2
heroImage: "/work/together-working/main.png"
showBody: false
metrics:
  - value: "CLI/TUI"
    label: "terminal-first control plane for AI workers"
  - value: "Task Contracts"
    label: "scope, files, deliverables, and success criteria"
  - value: "Verification"
    label: "evidence, diffs, tests, and approval before integration"
outcomes:
  - "将 Together Working 升级为 command-line 与 terminal UI 体验，用于 AI coding workflow 中的 task management、monitoring、worker state、settings、review 与 approval。"
  - "设计本地 control-plane 模型：daemon 拥有 state，CLI/TUI 作为 client，Codex 保持 coordinator、verifier 与 integrator 角色。"
  - "围绕 task contracts 构建，约束 scope、allowed files、denied files、deliverables、success criteria、reviewers 与 verification requirements。"
  - "根据 readiness、capability fit、fallback、degraded state 与 cooldown 设计 worker routing，避免把 task 分配给不可用 worker。"
  - "形成 review/verification flow，使 agent output 在 integration 前必须提供 evidence、diffs、test results 与 approval。"
  - "项目正在积极开发，并在开发者会话中测试，用于提升 workflow quality、测量 performance、评估 cost/token behavior 与 verification quality。"
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/together_working"
    note: "项目迭代很快；public repository 可能不包含最新 CLI/TUI、daemon、packaging 与 workflow testing 细节。"
highlights:
  - title: "Task Monitor"
    description: "跟踪 task progress、worker state、events、pending reviews、blocked work 与 developer intervention points。"
    src: "/work/together-working/task-monitor.png"
  - title: "Task Queue"
    description: "按 status、owner、worker、priority、scope 与 verification requirements 管理 tasks。"
    src: "/work/together-working/tasks.png"
  - title: "Task Detail"
    description: "检查 task contracts、allowed files、diff evidence、logs、review status、verification results 与 integration decisions。"
    src: "/work/together-working/task.png"
  - title: "Settings"
    description: "配置 providers、routing policy、daemon/client behavior、approval defaults、local artifacts 与 workflow preferences。"
    src: "/work/together-working/settings.png"
timeline:
  - date: "01.2026"
    label: "面向本地 AI worker teams 的 AI Department OS 定位"
  - date: "02.2026"
    label: "Worker registry、provider discovery、readiness checks 与 routing model"
  - date: "03.2026"
    label: "Task contracts、file-scope policy、verification artifacts 与 benchmark harness"
  - date: "04.2026"
    label: "Rust CLI、本地 daemon、client protocol、status/settings/review commands"
  - date: "05.2026"
    label: "Terminal UI、task monitor、approval/review flow 与 Windows packaging"
  - date: "现在"
    label: "在开发者 workflow 中测试 performance、reliability 与 verification quality"
storyBlocks:
  - title: "AI departments, not AI chats"
    body: "Together Working 把 AI coding agents 视为拥有角色、能力、状态和权限边界的 workers。Codex 不需要携带整个 context；它负责协调、验证并集成 specialized workers 的输出。"
  - title: "CLI-first operating layer"
    body: "产品已经转向 CLI/TUI，因为这更贴近开发者真实工作环境。开发者可以在 terminal 中查看 daemon status、浏览 tasks、观察 monitor、request review、approve results 并调整 settings。"
  - title: "用 task contracts 替代开放式 prompts"
    body: "每个 task 都带有 scope、allowed files、denied files、deliverables、success criteria、reviewers 与 verification requirements。这减少了 out-of-scope edits，也让 output 在 integration 前可以被 review。"
  - title: "通过真实 workflow 测量 performance"
    body: "Together Working 正在开发者工作会话中测试 context size、task latency、fallback rate、verification pass rate、diff quality 与 human review effort。这些指标会成为 routing intelligence 与可信 benchmark 的基础。"
gallery:
  - label: "System analysis 1"
    src: "/work/together-working/system-analysis-1.png"
  - label: "System analysis 2"
    src: "/work/together-working/system-analysis-2.png"
  - label: "System analysis 3"
    src: "/work/together-working/system-analysis-3.png"
  - label: "System analysis 4"
    src: "/work/together-working/system-analysis-4.png"
  - label: "System analysis 5"
    src: "/work/together-working/system-analysis-5.png"
  - label: "System analysis 6"
    src: "/work/together-working/system-analysis-6.png"
  - label: "System analysis 7"
    src: "/work/together-working/system-analysis-7.png"
  - label: "System analysis 8"
    src: "/work/together-working/system-analysis-8.png"
---

## Context

Together Working 是 CLI-first AI Department Operating System，面向本地 AI worker teams，强调小 task、specialized workers、explicit state、mandatory review/verification 与 controlled integration。

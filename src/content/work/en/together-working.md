---
locale: en
title: "Together Working"
summary: "A CLI-first AI Department Operating System for local AI worker teams, task orchestration, review, verification, and integration."
description: "Together Working is a local AI worker control plane that has evolved into a CLI/TUI for developer machines. It coordinates AI coding agents such as Codex, Claude, Gemini, Amp, OpenCode, and other agent CLIs through task contracts, worker routing, daemon-owned state, review/approval flows, verification gates, and operator reports."
overview: "Instead of handing an entire project to one agent with an ever-growing context, Together Working breaks work into small scoped tasks, routes each task to the right worker, tracks state through the CLI, and keeps Codex in the final coordinator/integrator role. The project is actively being developed and tested inside developer work sessions to improve workflows and measure performance."
problem: "Large AI coding sessions can grow expensive, lose scope control, obscure which worker changed which file, produce outputs that are hard to verify, and make multi-agent integration risky. When a provider fails, is not logged in, or returns weak output, the whole workflow can stall unless readiness, fallback, review, and verification are explicit."
approach: "Together Working uses a Rust CLI, local daemon, task monitor, task views, settings, skill bridge, worker registry, readiness checks, scoped task contracts, approval/review commands, verification artifacts, and reporting. The daemon owns control and state; the CLI/TUI acts as a thin client where developers monitor work, submit tasks, review results, approve or block integration."
role: "Founder / Product Builder / AI Systems Engineer"
period: "2026 - present"
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
  - "Upgraded Together Working into a command-line and terminal UI experience for task management, monitoring, worker state, settings, review, and approval in AI coding workflows."
  - "Designed a local control-plane model where the daemon owns state, the CLI/TUI acts as the client, and Codex remains the coordinator, verifier, and integrator."
  - "Built around task contracts that constrain scope, allowed files, denied files, deliverables, success criteria, reviewers, and verification requirements."
  - "Developed worker routing concepts based on readiness, capability fit, fallback, degraded state, and cooldown so tasks are not assigned to unavailable workers."
  - "Shaped a review and verification flow where agent output needs evidence, diffs, test results, and approval before integration."
  - "Currently under active development and tested inside developer sessions to improve workflow quality, measure performance, evaluate cost/token behavior, and track verification quality."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/together_working"
    note: "The project is moving quickly; the public repository may not reflect every latest CLI/TUI, daemon, packaging, and workflow-testing detail."
highlights:
  - title: "Task Monitor"
    description: "Track task progress, worker state, events, pending reviews, blocked work, and developer intervention points."
    src: "/work/together-working/task-monitor.png"
  - title: "Task Queue"
    description: "Manage tasks by status, owner, worker, priority, scope, and verification requirements."
    src: "/work/together-working/tasks.png"
  - title: "Task Detail"
    description: "Inspect task contracts, allowed files, diff evidence, logs, review status, verification results, and integration decisions."
    src: "/work/together-working/task.png"
  - title: "Settings"
    description: "Configure providers, routing policy, daemon/client behavior, approval defaults, local artifacts, and workflow preferences."
    src: "/work/together-working/settings.png"
timeline:
  - date: "01.2026"
    label: "AI Department OS positioning for local AI worker teams"
  - date: "02.2026"
    label: "Worker registry, provider discovery, readiness checks, and routing model"
  - date: "03.2026"
    label: "Task contracts, file-scope policy, verification artifacts, and benchmark harness"
  - date: "04.2026"
    label: "Rust CLI, local daemon, client protocol, status/settings/review commands"
  - date: "05.2026"
    label: "Terminal UI, task monitor, approval/review flow, and Windows packaging"
  - date: "Present"
    label: "Testing in developer workflows to measure performance, reliability, and verification quality"
storyBlocks:
  - title: "AI departments, not AI chats"
    body: "Together Working treats AI coding agents as workers with roles, capabilities, state, and permission boundaries. Codex does not need to carry the entire context; it coordinates, verifies, and integrates the output of specialized workers."
  - title: "CLI-first operating layer"
    body: "The product has moved into a CLI/TUI surface because that matches where developers already work. Developers can inspect daemon status, browse tasks, watch the monitor, request review, approve results, and adjust settings from the terminal."
  - title: "Task contracts instead of open-ended prompts"
    body: "Each task carries scope, allowed files, denied files, deliverables, success criteria, reviewers, and verification requirements. This reduces out-of-scope edits and makes the output reviewable before integration."
  - title: "Measuring performance through real workflows"
    body: "Together Working is being tested inside developer work sessions to observe context size, task latency, fallback rate, verification pass rate, diff quality, and human review effort. Those metrics become the foundation for routing intelligence and credible benchmarks."
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

Together Working is a CLI-first AI Department Operating System for local AI worker teams, focused on small tasks, specialized workers, explicit state, mandatory review/verification, and controlled integration.

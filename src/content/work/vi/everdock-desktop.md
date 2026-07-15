---
locale: vi
title: "EverDock Desktop"
summary: "AI developer workstation desktop-first để vận hành coding agent trên máy local, SSH server và managed runner."
description: "EverDock Desktop là AI agent control plane dành cho developer và team chạy các coding agent như Codex, Claude Code, OpenCode, Agy, Antigravity hoặc các agent CLI khác trên máy local, VPS, SSH target và managed server. Sản phẩm biến công việc của agent thành session, task run, terminal pane, approval request, diff, artifact và audit event có thể quan sát và kiểm soát."
overview: "EverDock được xây dựng từ nhận định rằng AI coding agent đang trở thành software worker, không chỉ là giao diện chat. Một agent trong một terminal có thể quản lý thủ công, nhưng nhiều agent chạy trên nhiều repository và server cần orchestration, visibility, approval enforcement, durable session, event replay và cost control. Sản phẩm hiện đang được thử nghiệm trong workflow làm việc thật của developer để tối ưu cách giao task, theo dõi agent chạy dài, review diff và test evidence, approve hành động rủi ro và tiếp tục công việc từ nhiều thiết bị."
problem: "Coding agent hiện đại có thể đọc codebase, sửa file, chạy shell command, cài dependency, tạo diff, chạy test và triển khai phần mềm. Năng lực đó tạo ra một bài toán vận hành mới: developer cần biết agent nào đang làm gì, chạy ở đâu, file nào đã đổi, lệnh nào đã chạy, session có bị treo không, token/compute đang tiêu tốn bao nhiêu và hành động nào cần approval. Terminal, SSH client và remote desktop chỉ giải quyết truy cập máy, nhưng chưa tạo ra control plane cho AI worker."
approach: "EverDock dùng workstation desktop Tauri/React với Rust core, local state, terminal/process abstraction và định hướng Runner layer để thực thi công việc trên máy local, SSH server hoặc managed server. Mô hình sản phẩm xoay quanh Account, Space, Workspace, ExecutionTarget, WorkspaceBinding, Runner, Session, Pane, TaskRun, AgentSession, ActionIntent, Approval, Policy, Artifact, FileChange, Diff và Event. Các hành động rủi ro cần được enforce ở Runner executor thay vì chỉ nằm ở UI, để approval, budget, command policy, secret access và audit trail trở thành một phần của execution boundary."
role: "Founder / Product Builder / Desktop Application Engineer"
period: "2026 - hiện tại"
featured: true
order: 4
heroImage: "/work/everdock/work.png"
showBody: false
metrics:
  - value: "AI Workstation"
    label: "control plane desktop cho coding agents"
  - value: "Runner Model"
    label: "local, SSH và managed execution targets"
  - value: "Approval"
    label: "gate rủi ro cho lệnh và thay đổi"
outcomes:
  - "Phát triển EverDock thành functional desktop-first AI workstation prototype để developer quản lý workspace, session, terminal, task, agent, approval và server/runner trong một không gian làm việc thống nhất."
  - "Đang được một nhóm developer thử nghiệm trong workflow phát triển phần mềm thực tế, bao gồm làm việc trên máy cá nhân, điều khiển remote server, giao task dài cho agent và tiếp quản terminal khi cần."
  - "Giúp gom các terminal, SSH client, dashboard, workspace và agent session rời rạc thành một workstation chung để giảm chuyển đổi công cụ và tăng khả năng quan sát hệ thống."
  - "Cấu trúc hóa task của agent thành task run có workspace, repository, execution target, terminal session, file change, test result, approval request, artifact và trạng thái hoàn tất/thất bại."
  - "Định hình risk-based approval cho các hành động như chạy command, sửa file quan trọng, cài dependency, truy cập secret, git push, database migration, deployment và production operation."
  - "Kiểm chứng workflow human-in-the-loop nơi agent xử lý phần việc dài/lặp lại, còn developer tập trung vào review diff, kiểm tra test evidence, approve/reject action và xử lý ngoại lệ."
links:
  - label: "GitHub"
    href: "https://github.com/kyoo-147/EverDock_Desktop"
    note: "Repository hiện thể hiện functional desktop prototype và architecture exploration. Runner, managed server, sync và enterprise governance là một phần của định hướng sản phẩm thương mại và có thể chưa được công khai đầy đủ."
highlights:
  - title: "Screen Fleet"
    description: "Theo dõi máy local, SSH target, remote terminal, preview session, server health và điểm cần can thiệp từ một màn hình vận hành."
    src: "/work/everdock/screen-fleet.png"
  - title: "Agent Fleet"
    description: "Quản lý coding agent, runtime profile, năng lực, trạng thái kết nối, quyền thực thi và task được giao trên nhiều môi trường."
    src: "/work/everdock/agent.png"
  - title: "Session Management"
    description: "Kiểm tra durable session, terminal pane, task context, event timeline, file change, test evidence và điểm con người có thể tiếp quản."
    src: "/work/everdock/session.png"
  - title: "Agent Routing"
    description: "Điều phối task giữa Codex, Claude Code, OpenCode, Agy, Antigravity, local agent và CLI runtime khác theo task, risk, cost và environment."
    src: "/work/everdock/routing.png"
timeline:
  - date: "01.2026"
    label: "Định vị AI developer workstation và agent control plane"
  - date: "02.2026"
    label: "Desktop-first product surface với Tauri, React, TypeScript và các màn hình vận hành"
  - date: "03.2026"
    label: "Core ontology cho workspace, session, pane, task run, agent session, approval và event"
  - date: "04.2026"
    label: "Runner, Server Dock, durable session và approval enforcement architecture"
  - date: "05.2026"
    label: "Agent routing, policy, budget guardrail, audit replay và multi-device control direction"
  - date: "Hiện tại"
    label: "Thử nghiệm trong developer workflows và tinh chỉnh nền tảng AI developer operations thương mại"
storyBlocks:
  - title: "Không chỉ là AI chat terminal"
    body: "EverDock bắt đầu từ một nhận định đơn giản: AI coding agent không còn chỉ trả lời câu hỏi. Agent có thể chạy lệnh, sửa file, tạo diff, chạy test và yêu cầu approval. Khi công việc đó diễn ra trên nhiều server và repository, sản phẩm phải quản lý toàn bộ execution lifecycle, không chỉ một ô chat."
  - title: "Agent như software worker"
    body: "Một task trở thành task run, task run tạo agent session, và session sinh ra pane, command, log, file change, diff, approval, test result, artifact và event. Mô hình này cho operator cách inspect và resume công việc thay vì đoán chuyện gì đã xảy ra trong terminal."
  - title: "Risk là một phần của workflow"
    body: "EverDock xem hành động rủi ro như product event. Đọc file, sửa code, cài package, push branch, deploy, truy cập secret hoặc chạy migration không nên dùng cùng một permission model. Approval enforcement cần nằm gần Runner executor để safety không chỉ là lời hứa ở UI."
  - title: "Từ workstation đến business platform"
    body: "Định hướng thương mại là AI developer operations platform: desktop control plane, local và remote runner, managed server, team workspace, API access, mobile/Telegram control, policy, audit, usage limit và paid plan theo seat, runner, compute, storage và managed infrastructure."
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

EverDock Desktop là AI developer workstation desktop-first để vận hành coding agent như software worker có thể quan sát, review và kiểm soát bằng policy trên môi trường local và remote.

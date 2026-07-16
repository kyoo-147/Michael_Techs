---
title: "Agentic document intelligence: OCR, routing, review 和 repair loops"
description: "一个关于 agentic document intelligence 的案例研究，组合 OCR、provider routing、review workflow、validation 和 repair loops。"
pubDatetime: "2026-07-13T08:00:00.000Z"
locale: zh-cn
author: Michael
featured: true
tags:
  - Agentic Document Intelligence
  - OCR
  - Document AI
  - Workflow Automation
  - Case Study
categories:
  - AI
  - Technical
  - Product
---

Document automation 经常失败，是因为它把 extraction 当成整个产品。

实际用户不只需要 OCR。他们需要文件被 routing、review、correction、validation，并最终变成可靠的 workflow data。

这就是 Dossier 背后的想法：一个 **agentic document intelligence** 系统，其中 OCR 只是更大运营循环的一步。

## Workflow

一个实用的 document system 要处理混乱输入：

```txt
Upload document
    -> detect document type
    -> choose OCR/provider route
    -> extract fields
    -> validate against rules
    -> flag risks and missing data
    -> human review when needed
    -> repair failed fields
    -> export structured result
```

agentic 不等于“让 AI 做所有事情”。它指的是系统能规划下一步、选择合适 provider、在 extraction 失败时 retry，并在 confidence 不够时请求 human review。

## 为什么 routing 重要

不同文档需要不同策略。

干净 invoice、扫描合同、手写表单和文档照片，不一定应该走同一条 OCR path。有些 provider 擅长 table，有些擅长 layout，有些更便宜，有些更快。

provider routing 让系统基于 document type、confidence、cost 和 latency 做选择。

## Review 和 repair loops

最重要的功能往往不是 extraction，而是 repair。

如果 field 缺失或可疑，系统不应该静默输出坏数据。它应该：

- 显示 evidence region；
- 解释 confidence 为什么低；
- 请求 human review；
- 保存 correction；
- 重新运行 validation；
- 改善之后的 routing decision。

这把 Document AI 从 black box 变成可控 workflow。

## 如何衡量价值

有用指标包括：

- 不需要 manual review 就完成的文档比例；
- 平均 review time；
- 按 field 统计的 extraction accuracy；
- repair success rate；
- 每份文档 provider cost；
- export 前捕获的 high-risk field 数量。

这些指标把 AI quality 和业务运营连接起来。

## 我学到的东西

agentic document intelligence 不只是一个强模型，而是 orchestration。

OCR 给出 text。产品需要做决定：哪个 provider、哪些 field、哪些 risk、哪条 repair path，以及什么时候人类应该介入。这才是系统变得有用的地方。

相关项目：[Dossier](/zh-cn/work/dossier).


---
title: "如何为 AI companions 设计 safe memory"
description: "一个关于 AI companion safe memory 的案例研究，关注 child-safe experience、parent control、consent、retention 和可审查 memory。"
pubDatetime: "2026-07-14T08:00:00.000Z"
locale: zh-cn
author: Michael
featured: true
tags:
  - Safe Memory For AI Companions
  - AI Companion
  - AI Safety
  - Product Design
  - Case Study
categories:
  - AI
  - Product
---

memory 会让 AI companion 变得更个人化。它可以记住名字、routine、偏好、过去的对话和情绪上下文。

但 memory 也会带来风险，尤其是面向儿童或脆弱用户的产品。一个安全的 AI companion 不应该把 memory 当成一个永久保存一切的隐形数据库。

在 Snow AI Companion 中，我把 memory 看成一个需要 consent、scope、review 和 deletion 的产品界面。

## Memory 问题

AI companion 可能想记住：

- 孩子的名字和年龄范围；
- 日常 routine；
- 学习偏好；
- 喜欢的故事或活动；
- 家长认可的目标；
- 安全边界和限制主题。

但系统不应该自由保存敏感信息、情绪操纵信号、家庭隐私，或家长无法 review 的内容。

设计问题是：

> companion 应该记住什么，谁能检查它，什么时候它应该忘记？

## 更安全的 memory model

我倾向于把 memory 分层：

```txt
Session memory
    当前对话的短期上下文

Approved profile memory
    家长可见的事实和偏好

Routine memory
    日程和习惯支持

Safety memory
    blocked topics、escalation rules、guardian preferences

Audit trail
    可审查的变化和重要事件
```

这样可以避免一个不受控制的 memory bucket。

## Human control

对于 child-safe 产品，parent control 不是可选项。

家长应该可以：

- 查看 AI 记住了什么；
- approve 新的 long-term memory；
- 删除 memory；
- 对敏感领域关闭 memory；
- 设置 topic boundary；
- review 重要互动。

AI 可以建议一条 memory，但不应该自动保存所有细节。

## Retention 和 forgetting

遗忘是一项功能。

有些 memory 应该过期。一个 routine 可能一个月有用。一次暂时的恐惧、挫败或冲突，不应该变成永久身份标签。系统需要区分稳定偏好和临时上下文。

这正是 product design 和 engineering 交汇的地方。database schema、moderation policy、UI 和 prompt 都必须对 memory 的含义达成一致。

## 我学到的东西

safe memory 不只是过滤坏输出。它是用户和 guardian 对系统所知内容的控制权。

companion 应该保持一致，但不能侵入。它应该支持孩子，而不是悄悄建立永久档案。最好的 memory 是有用、可审查、有明确范围并且容易删除的。

相关项目：[Snow AI Companion](/zh-cn/work/snow-ai-companion).


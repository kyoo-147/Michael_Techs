---
title: 设计安全的 AI 伴侣 (AI companion)：拥有记忆 (memory) 但仍可控
description: 拥有记忆的 AI 伴侣不仅仅意味着尽可能多地保存。为了安全起见，我们需要清楚地设计保存什么记忆、谁可以查看、何时删除，以及何时必须将人类纳入控制循环。
pubDatetime: 2026-06-23T00:00:00.000Z
locale: zh-cn
author: Michael
tags:
  - Safe & Human-centered AI
  - AI Companion
  - Memory
  - Safety
  - Parental Control
  - Human-centered AI
categories:
  - AI
  - Product
---

一个拥有记忆的 AI 伴侣听起来非常吸引人。

它记得你的名字。记得你喜欢什么。记得你上次因为什么而难过。记得你的习惯、你的说话方式、你的学习目标，以及你经常回避的事情。

但记忆也是让我觉得最需要小心对待的部分。

因为如果设计得不好，“为了支持而记住”很容易变成“记住太多，不清楚谁在控制，不清楚如何删除”。

特别是如果产品面向儿童、家庭或需要支持的人群，记忆不能仅仅是一个很酷的功能。它必须是一个负责任设计的部分。

## 1. 记忆不是一个可以把所有东西都塞进去的仓库

在谈论拥有记忆的 AI 时，很容易简单地想象：

```txt
用户说什么 → 全部保存 → 下次使用
```

但真实的产品不应该是这样的。

更合理的设计应该将记忆分为多个层级：

| 记忆类型 | 示例 | 应该长期保存吗？ |
|---|---|---|
| 会话记忆 (Session memory) | 当前对话的内容 | 是的，但仅在会话期间 |
| 用户偏好 (User preference) | 喜欢温柔的声音，喜欢通过图像学习 | 如果用户/家长同意，可以保存 |
| 学习进度 (Learning progress) | 已完成哪些课程 | 可以保存 |
| 敏感记忆 (Sensitive memory) | 健康、私人情绪、家庭信息 | 非常谨慎 |
| 安全提示 (Safety notes) | 需要成年人注意的迹象 | 需要单独的机制，不与普通记忆混合 |

好的记忆不是记住很多。好的记忆是在正确的时间、为了正确的目的，记住正确的事情。

## 2. 记忆需要明确的控制权

联合国儿童基金会 (UNICEF) 关于 AI 和儿童的指南强调了以下要求：确保儿童的安全、数据保护和隐私、透明度、可解释性、问责制，并将儿童的最大利益置于中心。

将这些原则转化为产品设计，我会想到非常具体的控制措施：

- 父母可以看到 AI 正在保存什么，
- 有一个删除记忆的按钮，
- 可以关闭长期记忆，
- 可以限制 AI 允许记住的主题，
- 当 AI 使用保存的信息时，必须明确说明，
- 敏感数据绝不能像普通记忆一样自动保存。

不应该强迫用户盲目信任 AI。他们需要看到并能够调整它。

## 3. 一个更安全的记忆架构

我不会用一个保存所有内容的 `memories` 表来设计 AI 伴侣。

一个更安全的流程：

```txt
用户消息
    ↓
安全过滤器 (Safety filter)
    ↓
对话响应
    ↓
记忆候选提取器 (Memory candidate extractor)
    ↓
策略检查 (Policy check)
    ↓
如果需要，家长/用户批准
    ↓
记忆存储 (Memory store)
```

重点是：并非每一句话都会被保存。

例如：

```json
{
  "memory_type": "preference",
  "content": "用户喜欢简短温柔的解释",
  "source": "conversation",
  "sensitivity": "low",
  "retention": "long_term",
  "visible_to_parent": true,
  "requires_approval": false
}
```

对于更敏感的信息：

```json
{
  "memory_type": "safety_note",
  "content": "用户在会话期间表达了强烈的痛苦",
  "sensitivity": "high",
  "retention": "review_required",
  "visible_to_parent": true,
  "requires_approval": true
}
```

我并不是说这是一个完美的模式 (schema)。但这种思维方式有助于你避免将记忆视为一团通用的数据。

## 4. 区分“个性化”和“情感依赖”

AI 伴侣越像朋友，就越容易产生亲切感。

这有其好的一面：用户可能会觉得更容易交谈，感觉压力更小，学习更自然。

但也有风险的一面：用户，尤其是儿童，可能会过度依赖 AI，或者将机器的响应与真实的关系混淆。

因此，我认为 AI 伴侣应该有一些原则：

- 不要声称取代父母、老师、医生或真正的朋友，
- 当用户遇到重要问题时，鼓励他们与成年人交谈，
- 不要不惜一切代价延长对话，
- 不要使用记忆来操纵情绪，
- 不要让孩子觉得“AI 是唯一理解我的人”。

一个好的 AI 伴侣应该支持人类，而不是取代人类世界。

## 5. 人类循环 (Human-in-the-loop) 不是一个次要细节

对于安全的产品，人类不仅仅是一个“在发生错误时进行审查”的人。

人类必须从一开始就参与设计。

例如，对于儿童 AI 伴侣：

```txt
孩子与 AI 交谈
    ↓
AI 温柔地回应
    ↓
系统检测到风险 / 敏感话题
    ↓
升级至家长仪表板
    ↓
家长查看上下文
    ↓
家长决定下一步行动
```

并非所有事情都需要警报。如果警报太多，父母就会忽略它们。但高风险情况需要有明确的机制。

## 6. 记忆设计清单

在向 AI 伴侣添加记忆之前，我会问自己：

- 这个记忆对用户有什么帮助？
- 它需要长期保存吗？
- 用户/家长知道它正在被保存吗？
- 它可以被查看、编辑、删除吗？
- 如果记忆错了会发生什么？
- 记忆会使 AI 的响应产生偏见或过于亲密吗？
- 敏感数据有单独的规则吗？
- 有用于审计的日志吗？

如果你无法回答这些问题，最好暂时不要开启长期记忆。

## 7. 结论

记忆是使 AI 伴侣变得更有用的部分之一。但它也是在设计时最需要保持谦卑的部分。

对我来说，原则应该是：

> AI 只应该记住那些有助于用户改善的事情，并且这些记忆必须在用户或监护人可以理解、控制和删除的限制范围内。

一个安全的伴侣不是一个记住所有事情的伴侣。它是一个知道自己界限的伴侣。

## 参考资料

- UNICEF — Guidance on AI and Children: https://www.unicef.org/innocenti/reports/policy-guidance-ai-children
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf
- AI Risk Repository paper: https://arxiv.org/abs/2408.12622

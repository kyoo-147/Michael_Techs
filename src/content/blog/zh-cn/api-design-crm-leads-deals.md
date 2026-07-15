---
title: CRM 的 API 设计：线索、联系人、交易和报价
description: >-
  有关为小型 CRM 设计 REST API 的笔记，重点关注线索 (leads)、联系人 (contacts)、交易 (deals)、报价 (quotes)
  以及现实世界中的销售工作流。
pubDatetime: '2023-09-14T00:00:00.000Z'
locale: zh-cn
author: Michael
tags:
  - Technical Notes
  - API Design
  - CRM
  - REST API
  - Database Design
  - Backend
  - Product Engineering
categories:
  - Technical
  - Product
---

## 引言

从表面上看，CRM 似乎只是几个数据表：线索 (leads)、联系人 (contacts)、交易 (deals)、报价 (quotes)。但在设计真正的 API 时，问题就开始出现了：

```text
线索 (lead) 与联系人 (contact) 有何不同？
线索什么时候变成交易 (deal)？
报价 (quote) 是属于交易还是属于客户？
跟进活动 (follow-up activity) 存放在哪里？
API 应该以操作还是以资源命名？
```

本文记录了我如何为一个小型 CRM 设计 API，注重实用且易于扩展。我依赖 REST API 的设计原则，例如面向资源的设计 (resource-oriented design)、使用名词作为资源名称、使用 HTTP 方法表示操作，并为关键操作添加了分页、过滤和幂等性 (idempotency) 等必备功能。

## 1. 设计原则

在编写端点 (endpoints) 之前，我想坚持几个原则：

### 1. 资源第一，操作第二

与其使用：

```text
POST /create-lead
POST /update-deal-status
```

不如使用：

```text
POST /leads
PATCH /deals/{dealId}
```

HTTP 方法已经描述了操作。URL 应该描述资源。

### 2. API 必须反映真实的工作流

CRM 不仅仅是 CRUD (增删改查)。它是一个流程：

```text
线索 → 联系人/客户 → 交易 → 报价 → 跟进 → 关单
```

如果 API 不能反映这个流程，以后构建自动化将会非常困难。

### 3. 避免过度工程

第一个版本不需要微服务。一个清晰的后端模块加上良好的数据库架构就足够了。

## 2. 核心资源

我将从 6 个资源开始：

```text
/leads
/contacts
/customers
/deals
/quotes
/activities
```

简要说明：

- **Lead (线索)**：有可能购买的个人或公司，但还不足以明确成为客户。
- **Contact (联系人)**：具体的联系人。
- **Customer (客户)**：已确认为客户或账户的组织/个人。
- **Deal (交易)**：销售机会。
- **Quote (报价)**：与交易或客户相关的报价单。
- **Activity (活动)**：通话、电子邮件、消息、笔记、跟进的记录。

## 3. 线索 (Leads) API

```text
GET    /leads
POST   /leads
GET    /leads/{leadId}
PATCH  /leads/{leadId}
DELETE /leads/{leadId}
```

创建线索示例：

```json
POST /leads
{
  "name": "Nguyen Van A",
  "email": "a@example.com",
  "phone": "+84900000000",
  "source": "website_form",
  "companyName": "ABC Manufacturing",
  "note": "Interested in CRM automation"
}
```

响应：

```json
{
  "id": "lead_123",
  "name": "Nguyen Van A",
  "status": "new",
  "source": "website_form",
  "createdAt": "2026-06-24T00:00:00Z"
}
```

线索状态可以是：

```text
new (新建)
contacted (已联系)
qualified (合格)
unqualified (不合格)
converted (已转化)
```

## 4. 将线索转化为客户/交易

这是一个特殊的操作。我们可以使用一个操作端点 (action endpoint)，因为它代表的是一个工作流，而不仅仅是一个字段更新。

```text
POST /leads/{leadId}:convert
```

有效载荷 (Payload)：

```json
{
  "createCustomer": true,
  "createDeal": true,
  "dealTitle": "CRM automation package",
  "estimatedValue": 2500
}
```

结果：

```json
{
  "leadId": "lead_123",
  "customerId": "cus_456",
  "contactId": "con_789",
  "dealId": "deal_001"
}
```

对于此类操作，你应该考虑使用**幂等键 (idempotency key)**。如果请求超时且客户端重试，系统不应创建 2 个重复的客户或交易。

## 5. 联系人 (Contacts) 和客户 (Customers) API

```text
GET    /contacts
POST   /contacts
GET    /contacts/{contactId}
PATCH  /contacts/{contactId}

GET    /customers
POST   /customers
GET    /customers/{customerId}
PATCH  /customers/{customerId}
```

如果客户是公司，联系人是公司里的人：

```text
GET  /customers/{customerId}/contacts
POST /customers/{customerId}/contacts
```

客户示例：

```json
{
  "id": "cus_456",
  "name": "ABC Manufacturing",
  "type": "company",
  "industry": "manufacturing",
  "ownerUserId": "user_001"
}
```

## 6. 交易 (Deals) API

交易是销售管道发生的地方。

```text
GET    /deals
POST   /deals
GET    /deals/{dealId}
PATCH  /deals/{dealId}
DELETE /deals/{dealId}
```

交易阶段：

```text
new (新建)
qualified (合格)
proposal (提案)
negotiation (谈判)
won (赢单)
lost (输单)
```

示例：

```json
POST /deals
{
  "customerId": "cus_456",
  "title": "CRM automation package",
  "stage": "qualified",
  "estimatedValue": 2500,
  "currency": "USD",
  "expectedCloseDate": "2026-07-15"
}
```

要更新阶段：

```json
PATCH /deals/deal_001
{
  "stage": "proposal"
}
```

你应该将阶段变更保存到 `activities` 或 `deal_stage_history` 中，因为销售管道需要审计跟踪 (audit trail)。

## 7. 报价 (Quotes) API

报价通常与交易相关联。

```text
GET    /deals/{dealId}/quotes
POST   /deals/{dealId}/quotes
GET    /quotes/{quoteId}
PATCH  /quotes/{quoteId}
POST   /quotes/{quoteId}:send
POST   /quotes/{quoteId}:accept
POST   /quotes/{quoteId}:reject
```

创建报价示例：

```json
POST /deals/deal_001/quotes
{
  "items": [
    {
      "name": "CRM setup",
      "quantity": 1,
      "unitPrice": 1500
    },
    {
      "name": "Workflow automation package",
      "quantity": 1,
      "unitPrice": 1000
    }
  ],
  "currency": "USD",
  "validUntil": "2026-07-30"
}
```

报价状态：

```text
draft (草稿)
sent (已发送)
accepted (已接受)
rejected (已拒绝)
expired (已过期)
```

对于 `send`, `accept`, `reject`，我使用了操作端点，因为这些是清晰的领域操作 (domain actions)，而不仅仅是字段编辑。

## 8. 活动 (Activities) API

活动赋予了 CRM 工作历史。

```text
GET  /activities?entityType=deal&entityId=deal_001
POST /activities
```

有效载荷 (Payload)：

```json
{
  "entityType": "deal",
  "entityId": "deal_001",
  "type": "follow_up",
  "content": "Send quote tomorrow morning",
  "dueAt": "2026-06-25T02:00:00Z"
}
```

实体类型可以是：

```text
lead
contact
customer
deal
quote
```

这有助于一个活动表用于多种对象类型。

## 9. 分页、过滤、排序

CRM 列表会不断增长。你不应该返回所有记录。

示例：

```text
GET /leads?status=qualified&source=website_form&limit=20&cursor=abc
GET /deals?stage=proposal&sort=-createdAt
```

响应：

```json
{
  "data": [],
  "nextCursor": "next_abc"
}
```

对于 CRM，如果数据不断变化，游标分页 (cursor pagination) 通常比偏移量分页 (offset) 更好。

## 10. 错误格式

应具有一致的错误格式：

```json
{
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found",
    "requestId": "req_123"
  }
}
```

`requestId` 在调试生产环境日志时非常有用。

## 11. 结论

CRM 的 API 设计不仅仅是 CRUD。重要的是要了解真实的工作流：

```text
线索捕获 (lead capture)
资格确认 (qualification)
转化 (conversion)
交易跟踪 (deal tracking)
报价管理 (quote management)
跟进历史 (follow-up history)
```

我的主要经验教训：

- URL 应该围绕资源，而不是围绕操作。
- 像转换/发送/接受这样的工作流操作可以是自定义端点。
- CRM 尽早需要活动日志。
- 从一开始就应该有分页/过滤。
- 重要的数据创建操作应考虑幂等性。

如果设计得当，API 将不仅服务于前端，还将在未来服务于自动化工作流和 AI 代理 (AI agents)。

## 参考资源

- Azure Architecture Center — RESTful web API design: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
- Google API Design Guide: https://docs.cloud.google.com/apis/design
- Google AIP-121 Resource-oriented design: https://google.aip.dev/121
- Microsoft Azure REST API Guidelines: https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md
- Stripe API — Idempotent requests: https://docs.stripe.com/api/idempotent_requests

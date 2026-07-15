---
title: 'API Design for CRM: Leads, Contacts, Deals, Quotes'
description: >-
  Notes on designing a REST API for a small CRM, focusing on leads, contacts,
  deals, quotes, and real-world sales workflows.
pubDatetime: '2023-09-14T00:00:00.000Z'
locale: en
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

## Introduction

On the outside, a CRM seems to just be a few data tables: leads, contacts, deals, quotes. But when designing the real API, problems start appearing:

```text
How is a lead different from a contact?
When does a lead become a deal?
Does a quote belong to a deal or a customer?
Where is follow-up activity stored?
Should the API be named after the action or the resource?
```

This article documents how I design an API for a small CRM, in a practical and easily extensible way. I rely on REST API design principles like resource-oriented design, using nouns for resource names, HTTP methods for actions, and adding must-haves like pagination, filtering, and idempotency for critical operations.

## 1. Design Principles

Before writing endpoints, I want to stick to a few principles:

### 1. Resource first, action second

Instead of:

```text
POST /create-lead
POST /update-deal-status
```

Use:

```text
POST /leads
PATCH /deals/{dealId}
```

The HTTP method already describes the action. The URL should describe the resource.

### 2. API must reflect the real workflow

A CRM is not just CRUD. It's a flow:

```text
Lead → Contact/Customer → Deal → Quote → Follow-up → Close
```

If the API doesn't reflect this flow, building automation later will be very hard.

### 3. Avoid over-engineering

The first version doesn't need microservices. A clear backend module with a good database schema is enough.

## 2. Core resources

I'll start with 6 resources:

```text
/leads
/contacts
/customers
/deals
/quotes
/activities
```

Brief explanation:

- **Lead**: a person or company capable of buying, but not clear enough to be a customer.
- **Contact**: a specific contact person.
- **Customer**: an organization/individual confirmed as a customer or account.
- **Deal**: a sales opportunity.
- **Quote**: a quotation linked to a deal or customer.
- **Activity**: history of calls, emails, messages, notes, follow-ups.

## 3. APIs for Leads

```text
GET    /leads
POST   /leads
GET    /leads/{leadId}
PATCH  /leads/{leadId}
DELETE /leads/{leadId}
```

Example for creating a lead:

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

Response:

```json
{
  "id": "lead_123",
  "name": "Nguyen Van A",
  "status": "new",
  "source": "website_form",
  "createdAt": "2026-06-24T00:00:00Z"
}
```

Lead status could be:

```text
new
contacted
qualified
unqualified
converted
```

## 4. Converting a lead to customer/deal

This is a special operation. We can use an action endpoint because it represents a workflow, not just a field update.

```text
POST /leads/{leadId}:convert
```

Payload:

```json
{
  "createCustomer": true,
  "createDeal": true,
  "dealTitle": "CRM automation package",
  "estimatedValue": 2500
}
```

Result:

```json
{
  "leadId": "lead_123",
  "customerId": "cus_456",
  "contactId": "con_789",
  "dealId": "deal_001"
}
```

For this type of operation, you should think about an **idempotency key**. If the request times out and the client retries, the system shouldn't create 2 duplicate customers or deals.

## 5. APIs for Contacts and Customers

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

If the customer is a company, the contact is a person in the company:

```text
GET  /customers/{customerId}/contacts
POST /customers/{customerId}/contacts
```

Example customer:

```json
{
  "id": "cus_456",
  "name": "ABC Manufacturing",
  "type": "company",
  "industry": "manufacturing",
  "ownerUserId": "user_001"
}
```

## 6. APIs for Deals

The deal is where the sales pipeline happens.

```text
GET    /deals
POST   /deals
GET    /deals/{dealId}
PATCH  /deals/{dealId}
DELETE /deals/{dealId}
```

Deal stages:

```text
new
qualified
proposal
negotiation
won
lost
```

Example:

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

To update stage:

```json
PATCH /deals/deal_001
{
  "stage": "proposal"
}
```

You should save stage changes to `activities` or `deal_stage_history`, because the sales pipeline needs an audit trail.

## 7. APIs for Quotes

A quote is usually linked to a deal.

```text
GET    /deals/{dealId}/quotes
POST   /deals/{dealId}/quotes
GET    /quotes/{quoteId}
PATCH  /quotes/{quoteId}
POST   /quotes/{quoteId}:send
POST   /quotes/{quoteId}:accept
POST   /quotes/{quoteId}:reject
```

Example creating quote:

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

Quote status:

```text
draft
sent
accepted
rejected
expired
```

With `send`, `accept`, `reject`, I use action endpoints because these are clear domain actions, not just field edits.

## 8. APIs for Activities

Activities give the CRM a working history.

```text
GET  /activities?entityType=deal&entityId=deal_001
POST /activities
```

Payload:

```json
{
  "entityType": "deal",
  "entityId": "deal_001",
  "type": "follow_up",
  "content": "Send quote tomorrow morning",
  "dueAt": "2026-06-25T02:00:00Z"
}
```

Entity types could be:

```text
lead
contact
customer
deal
quote
```

This helps one activity table be used for many object types.

## 9. Pagination, filtering, sorting

The CRM list will grow. You shouldn't return all records.

Example:

```text
GET /leads?status=qualified&source=website_form&limit=20&cursor=abc
GET /deals?stage=proposal&sort=-createdAt
```

Response:

```json
{
  "data": [],
  "nextCursor": "next_abc"
}
```

For a CRM, cursor pagination is usually better than offset if data changes constantly.

## 10. Error format

Should have a consistent error format:

```json
{
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found",
    "requestId": "req_123"
  }
}
```

`requestId` is very useful when debugging production logs.

## 11. Conclusion

API design for CRM is not just CRUD. The important thing is to understand the real workflow:

```text
lead capture
qualification
conversion
deal tracking
quote management
follow-up history
```

My main lessons:

- The URL should revolve around resources, not actions.
- Workflow actions like convert/send/accept can be custom endpoints.
- CRM needs an activity log early on.
- Pagination/filtering should be present from the start.
- Important data creation operations should consider idempotency.

If done correctly, the API will not only serve the frontend, but also automation workflows and AI agents later.

## References

- Azure Architecture Center — RESTful web API design: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
- Google API Design Guide: https://docs.cloud.google.com/apis/design
- Google AIP-121 Resource-oriented design: https://google.aip.dev/121
- Microsoft Azure REST API Guidelines: https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md
- Stripe API — Idempotent requests: https://docs.stripe.com/api/idempotent_requests

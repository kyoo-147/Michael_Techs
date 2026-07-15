---
title: 'Thiết kế API cho CRM: Leads, Contacts, Deals, Quotes'
description: >-
  Ghi chú thiết kế REST API cho một CRM nhỏ, tập trung vào leads, contacts,
  deals, quotes và workflow bán hàng thực tế.
pubDatetime: '2023-09-14T00:00:00.000Z'
locale: vi
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

## Mở bài

Một CRM nhìn bên ngoài có vẻ chỉ là vài bảng dữ liệu: leads, contacts, deals, quotes. Nhưng khi thiết kế API thật, vấn đề bắt đầu xuất hiện:

```text
Lead khác contact thế nào?
Khi nào lead chuyển thành deal?
Quote thuộc về deal hay customer?
Follow-up activity lưu ở đâu?
API nên đặt tên theo hành động hay tài nguyên?
```

Bài này ghi lại cách tôi sẽ thiết kế API cho một CRM nhỏ, theo hướng thực tế và dễ mở rộng. Tôi dựa trên các nguyên tắc REST API design như resource-oriented design, dùng nouns cho resource names, HTTP methods cho hành động, và thêm các điểm cần có như pagination, filtering, idempotency cho operation quan trọng.

## 1. Nguyên tắc thiết kế

Trước khi viết endpoint, tôi muốn giữ vài nguyên tắc:

### 1. Resource trước, action sau

Thay vì:

```text
POST /create-lead
POST /update-deal-status
```

Nên dùng:

```text
POST /leads
PATCH /deals/{dealId}
```

HTTP method đã nói hành động rồi. URL nên mô tả tài nguyên.

### 2. API phải phản ánh workflow thật

CRM không chỉ là CRUD. Nó là flow:

```text
Lead → Contact/Customer → Deal → Quote → Follow-up → Close
```

Nếu API không phản ánh flow này, sau này automation sẽ rất khó build.

### 3. Tránh over-engineering

Bản đầu tiên không cần microservices. Một backend module rõ ràng với database schema tốt là đủ.

## 2. Các tài nguyên chính

Tôi sẽ bắt đầu với 6 resources:

```text
/leads
/contacts
/customers
/deals
/quotes
/activities
```

Giải thích ngắn:

- **Lead**: người hoặc công ty có khả năng mua, nhưng chưa đủ rõ để thành customer.
- **Contact**: người liên hệ cụ thể.
- **Customer**: tổ chức/cá nhân đã được xác nhận là khách hàng hoặc account.
- **Deal**: cơ hội bán hàng.
- **Quote**: báo giá gắn với deal hoặc customer.
- **Activity**: lịch sử gọi điện, email, message, note, follow-up.

## 3. API cho Leads

```text
GET    /leads
POST   /leads
GET    /leads/{leadId}
PATCH  /leads/{leadId}
DELETE /leads/{leadId}
```

Ví dụ tạo lead:

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

Lead status có thể là:

```text
new
contacted
qualified
unqualified
converted
```

## 4. Convert lead thành customer/deal

Đây là operation đặc biệt. Có thể dùng action endpoint vì nó biểu diễn workflow chứ không chỉ update field.

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

Kết quả:

```json
{
  "leadId": "lead_123",
  "customerId": "cus_456",
  "contactId": "con_789",
  "dealId": "deal_001"
}
```

Với operation kiểu này, nên nghĩ đến **idempotency key**. Nếu request bị timeout và client gửi lại, hệ thống không nên tạo 2 customer hoặc 2 deal trùng nhau.

## 5. API cho Contacts và Customers

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

Nếu customer là công ty, contact là người trong công ty:

```text
GET  /customers/{customerId}/contacts
POST /customers/{customerId}/contacts
```

Ví dụ customer:

```json
{
  "id": "cus_456",
  "name": "ABC Manufacturing",
  "type": "company",
  "industry": "manufacturing",
  "ownerUserId": "user_001"
}
```

## 6. API cho Deals

Deal là nơi pipeline bán hàng diễn ra.

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

Ví dụ:

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

Để cập nhật stage:

```json
PATCH /deals/deal_001
{
  "stage": "proposal"
}
```

Nên lưu stage change vào `activities` hoặc `deal_stage_history`, vì sales pipeline cần audit trail.

## 7. API cho Quotes

Quote thường gắn với deal.

```text
GET    /deals/{dealId}/quotes
POST   /deals/{dealId}/quotes
GET    /quotes/{quoteId}
PATCH  /quotes/{quoteId}
POST   /quotes/{quoteId}:send
POST   /quotes/{quoteId}:accept
POST   /quotes/{quoteId}:reject
```

Ví dụ tạo quote:

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

Với `send`, `accept`, `reject`, tôi dùng action endpoint vì đây là domain action rõ ràng, không chỉ sửa field.

## 8. API cho Activities

Activity giúp CRM có lịch sử làm việc.

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

Entity type có thể là:

```text
lead
contact
customer
deal
quote
```

Cách này giúp một bảng activity dùng được cho nhiều loại object.

## 9. Pagination, filtering, sorting

Danh sách CRM sẽ lớn dần. Không nên trả tất cả records.

Ví dụ:

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

Với CRM, cursor pagination thường ổn hơn offset nếu dữ liệu thay đổi liên tục.

## 10. Error format

Nên có format lỗi nhất quán:

```json
{
  "error": {
    "code": "LEAD_NOT_FOUND",
    "message": "Lead not found",
    "requestId": "req_123"
  }
}
```

`requestId` rất hữu ích khi debug log production.

## 11. Kết luận

Thiết kế API cho CRM không chỉ là CRUD. Điều quan trọng là hiểu workflow thật:

```text
lead capture
qualification
conversion
deal tracking
quote management
follow-up history
```

Bài học chính của tôi:

- URL nên xoay quanh resource, không xoay quanh action.
- Workflow action như convert/send/accept có thể là endpoint riêng.
- CRM cần activity log từ sớm.
- Pagination/filtering nên có ngay từ đầu.
- Các operation tạo dữ liệu quan trọng nên nghĩ đến idempotency.

Nếu làm đúng, API sẽ không chỉ phục vụ frontend, mà còn phục vụ automation workflow và AI agents sau này.

## Nguồn tham khảo

- Azure Architecture Center — RESTful web API design: https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design
- Google API Design Guide: https://docs.cloud.google.com/apis/design
- Google AIP-121 Resource-oriented design: https://google.aip.dev/121
- Microsoft Azure REST API Guidelines: https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md
- Stripe API — Idempotent requests: https://docs.stripe.com/api/idempotent_requests

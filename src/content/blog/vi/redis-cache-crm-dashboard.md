---
title: Dùng Redis cache cho dashboard CRM khi nào là hợp lý?
description: >-
  Ghi chú thực tế về việc dùng Redis cache để tối ưu dashboard CRM: khi nào nên
  dùng, cache gì, invalidation ra sao và tránh những lỗi phổ biến.
pubDatetime: '2023-08-03T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Technical Notes
  - Redis
  - Caching
  - CRM Dashboard
  - Performance
  - Backend
  - System Optimization
categories:
  - Technical
  - Product
---

## Mở bài

Khi dashboard CRM còn ít dữ liệu, mọi thứ thường chạy ổn. Query trực tiếp database, render bảng leads, deals, quotes là đủ.

Nhưng khi dữ liệu tăng lên, dashboard bắt đầu chậm:

```text
Tổng số leads theo trạng thái
Doanh thu pipeline theo tháng
Số deals đang ở stage proposal
Top nguồn lead tốt nhất
Activity gần nhất của từng sales rep
```

Mỗi lần user mở dashboard, backend phải query nhiều bảng, join nhiều dữ liệu, group by, aggregate. Lúc này nhiều người nghĩ ngay: “Thêm Redis cache vào là xong”.

Redis có thể giúp rất nhiều, nhưng không phải chỗ nào cũng nên cache. Bài này ghi lại cách tôi quyết định **khi nào dùng Redis cache cho dashboard CRM là hợp lý**.

## 1. Redis cache giải quyết vấn đề gì?

Redis thường được dùng để lưu dữ liệu truy cập nhanh trong memory. Với dashboard CRM, cache hữu ích khi:

- dữ liệu được đọc nhiều hơn ghi
- query aggregate tốn thời gian
- nhiều user xem cùng một dashboard giống nhau
- dữ liệu không cần chính xác từng giây
- response có thể chấp nhận stale trong vài giây hoặc vài phút

Ví dụ dashboard tổng quan:

```text
Total leads today
Open deals value
Conversion rate this month
Revenue by pipeline stage
```

Những dữ liệu này thường không cần realtime tuyệt đối. Chậm 30–60 giây vẫn chấp nhận được trong nhiều CRM nhỏ.

## 2. Khi nào chưa cần Redis?

Không nên thêm Redis quá sớm chỉ để “trông chuyên nghiệp”.

Chưa cần Redis nếu:

- database còn nhỏ
- query dưới 100–200ms
- dashboard ít người dùng
- chưa có index tốt
- chưa đo được bottleneck
- dữ liệu thay đổi liên tục và cần realtime chính xác

Trước khi cache, nên làm 3 việc:

```text
1. Đo query chậm ở đâu.
2. Thêm database index đúng chỗ.
3. Tối ưu query hoặc schema nếu cần.
```

Cache không nên che giấu database design tệ. Nó nên là lớp tối ưu sau khi đã hiểu bottleneck.

## 3. Những thứ nên cache trong CRM dashboard

Tôi sẽ ưu tiên cache các dữ liệu aggregate:

### Dashboard summary

```text
crm:dashboard:summary:org:{orgId}
```

Ví dụ value:

```json
{
  "totalLeads": 1240,
  "newLeadsToday": 32,
  "openDeals": 86,
  "pipelineValue": 45000,
  "updatedAt": "2026-06-25T00:00:00Z"
}
```

### Pipeline by stage

```text
crm:pipeline:by_stage:org:{orgId}
```

```json
[
  { "stage": "qualified", "count": 20, "value": 12000 },
  { "stage": "proposal", "count": 8, "value": 18000 }
]
```

### Lead source performance

```text
crm:lead_source:performance:org:{orgId}:month:{yyyyMM}
```

Dữ liệu này không cần update từng giây, nên rất hợp để cache.

## 4. Những thứ không nên cache vội

Tôi sẽ cẩn thận với:

- thông tin cá nhân nhạy cảm
- permission-specific response
- dữ liệu vừa ghi xong cần thấy ngay
- search/filter phức tạp theo từng user
- danh sách có pagination thay đổi liên tục

Ví dụ:

```text
GET /leads?search=nguyen&status=qualified&owner=user_123&page=3
```

Có thể cache, nhưng key sẽ rất nhiều và invalidation khó. Với bản đầu tiên, tôi sẽ ưu tiên cache summary/aggregate trước.

## 5. Cache-aside pattern

Pattern dễ bắt đầu nhất là cache-aside.

Flow đọc dữ liệu:

```text
1. Backend kiểm tra Redis.
2. Nếu có cache → trả về ngay.
3. Nếu không có cache → query database.
4. Lưu kết quả vào Redis với TTL.
5. Trả kết quả cho frontend.
```

Pseudo-code:

```ts
async function getDashboardSummary(orgId: string) {
  const key = `crm:dashboard:summary:org:${orgId}`;

  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const summary = await queryDashboardSummaryFromDb(orgId);

  await redis.set(key, JSON.stringify(summary), {
    EX: 60,
  });

  return summary;
}
```

TTL 60 giây nghĩa là dashboard có thể stale tối đa khoảng 1 phút. Với nhiều dashboard business, điều này chấp nhận được.

## 6. Invalidation: phần khó nhất của cache

Cache khó không phải ở `redis.get`. Cache khó ở câu hỏi: **khi nào xóa cache?**

Có 3 cách đơn giản:

### Cách 1: TTL-only

Đặt TTL ngắn, ví dụ 30–60 giây.

Ưu điểm:

- đơn giản
- ít bug invalidation
- hợp với dashboard overview

Nhược điểm:

- dữ liệu có thể stale trong thời gian TTL

### Cách 2: Invalidate khi ghi dữ liệu

Khi tạo lead/deal/quote mới, xóa các key liên quan.

```ts
await createLead(data);
await redis.del(`crm:dashboard:summary:org:${orgId}`);
await redis.del(`crm:lead_source:performance:org:${orgId}:month:${month}`);
```

Ưu điểm:

- dữ liệu mới hơn

Nhược điểm:

- dễ quên xóa key liên quan
- nhiều write có thể làm cache mất tác dụng

### Cách 3: Background refresh

Có job chạy định kỳ để tính lại dashboard summary và ghi vào Redis.

```text
Every 1 minute → compute dashboard summary → update Redis
```

Cách này hợp nếu dashboard được xem nhiều và query aggregate nặng.

## 7. Ví dụ áp dụng cho OneClick CRM

Với OneClick CRM, tôi sẽ cache theo thứ tự:

### Giai đoạn 1

Cache dashboard overview:

```text
total leads
open deals
pipeline value
quotes sent
activities due today
```

TTL: 30–60 giây.

### Giai đoạn 2

Cache analytics theo tháng:

```text
lead source conversion
deal stage distribution
quote acceptance rate
follow-up completion rate
```

TTL: 5–15 phút.

### Giai đoạn 3

Nếu có nhiều user và nhiều org, thêm background refresh và cache per organization.

```text
crm:dashboard:summary:org:{orgId}
crm:pipeline:by_stage:org:{orgId}
crm:quote:acceptance_rate:org:{orgId}:month:{yyyyMM}
```

## 8. Những metric cần đo

Nếu thêm Redis mà không đo, ta không biết nó có giúp không.

Tôi sẽ đo:

```text
cache hit rate
cache miss rate
average response time
p95 response time
query time before/after cache
Redis memory usage
stale data complaints
```

Ví dụ:

```text
Before cache: dashboard summary p95 = 1200ms
After cache:  dashboard summary p95 = 180ms
Cache hit rate: 82%
```

Nếu hit rate thấp, có thể key thiết kế chưa tốt hoặc dữ liệu quá dynamic.

## 9. Lỗi phổ biến

- Cache mọi thứ quá sớm.
- Không có TTL.
- Key đặt không có orgId/userId dẫn đến lộ dữ liệu giữa tenant.
- Cache response phụ thuộc permission nhưng key không chứa permission context.
- Không đo hit rate.
- Không có fallback khi Redis down.
- Dùng cache để che query/database design tệ.

Với CRM multi-tenant, key nên luôn nghĩ đến `orgId`.

```text
bad:  crm:dashboard:summary
good: crm:dashboard:summary:org:{orgId}
```

## 10. Kết luận

Redis cache rất hữu ích cho CRM dashboard, nhưng nên dùng đúng chỗ.

Tôi sẽ chỉ thêm Redis khi:

```text
query đã bắt đầu chậm
read nhiều hơn write
dữ liệu aggregate được xem lặp lại
stale vài giây/phút là chấp nhận được
đã có metric để đo hiệu quả
```

Bài học chính:

- Cache summary/aggregate trước, đừng cache mọi list phức tạp ngay.
- TTL ngắn thường đủ tốt cho dashboard nhỏ.
- Invalidation là phần cần thiết kế cẩn thận.
- Redis nên làm hệ thống nhanh hơn, không phải làm logic rối hơn.

## Nguồn tham khảo

- Redis Docs: https://redis.io/docs/latest/
- Redis — Query Caching for Microservices: https://redis.io/tutorials/howtos/solutions/microservices/caching/
- Azure Architecture Center — Cache-Aside pattern: https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside
- AWS Caching overview: https://aws.amazon.com/caching/

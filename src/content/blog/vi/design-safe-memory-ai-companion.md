---
title: "Thiết kế safe memory cho AI companion như thế nào"
description: "Case study về safe memory cho AI companion, tập trung vào trải nghiệm an toàn cho trẻ em, quyền kiểm soát của phụ huynh, consent, retention và memory có thể review."
pubDatetime: "2026-07-14T08:00:00.000Z"
locale: vi
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

Memory làm AI companion trở nên cá nhân hơn. Nó có thể nhớ tên, routine, sở thích, cuộc trò chuyện trước đó và ngữ cảnh cảm xúc.

Nhưng memory cũng tạo rủi ro, đặc biệt với sản phẩm dành cho trẻ em hoặc người dễ tổn thương. Một AI companion an toàn không nên xem memory là database vô hình giữ mọi thứ mãi mãi.

Với Snow AI Companion, tôi nghĩ memory là một bề mặt sản phẩm cần consent, scope, review và deletion.

## Bài toán memory

AI companion có thể muốn nhớ:

- tên và độ tuổi của trẻ;
- routine hằng ngày;
- sở thích học tập;
- câu chuyện hoặc hoạt động yêu thích;
- mục tiêu đã được phụ huynh chấp thuận;
- giới hạn an toàn và chủ đề bị hạn chế.

Nhưng hệ thống không nên tự do lưu thông tin nhạy cảm, tín hiệu thao túng cảm xúc, chi tiết riêng tư gia đình hoặc nội dung mà phụ huynh không thể review.

Câu hỏi thiết kế là:

> Companion nên nhớ gì, ai có thể kiểm tra, và khi nào nó phải quên?

## Mô hình memory an toàn hơn

Tôi tách memory thành nhiều lớp:

```txt
Session memory
    ngữ cảnh ngắn hạn của cuộc trò chuyện hiện tại

Approved profile memory
    thông tin và sở thích phụ huynh có thể xem

Routine memory
    lịch trình và thói quen

Safety memory
    chủ đề bị chặn, rule escalation, preference của guardian

Audit trail
    thay đổi và sự kiện quan trọng có thể review
```

Cách này tránh một "thùng nhớ" không kiểm soát.

## Quyền kiểm soát của con người

Với sản phẩm child-safe, parent control là bắt buộc.

Phụ huynh nên có thể:

- xem AI đang nhớ gì;
- duyệt memory dài hạn mới;
- xóa memory;
- tắt memory cho vùng nhạy cảm;
- đặt giới hạn chủ đề;
- review các tương tác quan trọng.

AI có thể đề xuất memory, nhưng không nên tự động lưu mọi chi tiết.

## Retention và forgetting

Quên là một tính năng.

Một số memory nên hết hạn. Routine có thể hữu ích trong một tháng. Một nỗi sợ tạm thời, sự bực bội hoặc xung đột không nên trở thành nhãn nhận dạng lâu dài. Hệ thống cần phân biệt sở thích ổn định với ngữ cảnh tạm thời.

Đây là nơi product design và engineering gặp nhau. Database schema, moderation policy, UI và prompt đều phải đồng ý với nhau về ý nghĩa của memory.

## Điều tôi rút ra

Safe memory không chỉ là lọc output xấu. Nó là quyền kiểm soát của người dùng và guardian với những gì hệ thống biết.

Companion nên nhất quán nhưng không xâm lấn. Nó nên hỗ trợ trẻ mà không âm thầm xây dựng hồ sơ vĩnh viễn. Memory tốt nhất là hữu ích, có thể review, có scope rõ và dễ xóa.

Dự án liên quan: [Snow AI Companion](/vi/work/snow-ai-companion).


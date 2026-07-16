---
title: "Agentic document intelligence: OCR, routing, review và repair loops"
description: "Case study về hệ thống agentic document intelligence kết hợp OCR, provider routing, review workflow, validation và repair loops."
pubDatetime: "2026-07-13T08:00:00.000Z"
locale: vi
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

Document automation thường thất bại vì xem extraction là toàn bộ sản phẩm.

Trong thực tế, người dùng không chỉ cần OCR. Họ cần tài liệu được định tuyến, review, sửa lỗi, validate và chuyển thành dữ liệu workflow đáng tin cậy.

Đó là ý tưởng phía sau Dossier: một hệ thống **agentic document intelligence** nơi OCR chỉ là một bước trong vòng vận hành lớn hơn.

## Workflow

Một hệ thống document thực tế phải xử lý input lộn xộn:

```txt
Upload document
    -> nhận diện loại tài liệu
    -> chọn OCR/provider route
    -> extract field
    -> validate theo rule
    -> flag rủi ro và dữ liệu thiếu
    -> human review khi cần
    -> repair field lỗi
    -> export structured result
```

Phần agentic không có nghĩa là "để AI làm hết". Nó là khả năng chọn bước tiếp theo, chọn provider phù hợp, retry khi extraction fail và yêu cầu review khi confidence không đủ.

## Vì sao routing quan trọng

Mỗi loại tài liệu cần chiến lược khác nhau.

Invoice sạch, hợp đồng scan, form viết tay và ảnh chụp tài liệu không nhất thiết dùng cùng một OCR path. Có provider mạnh về table. Có provider tốt về layout. Có provider rẻ hơn hoặc nhanh hơn.

Provider routing giúp hệ thống chọn theo loại tài liệu, confidence, chi phí và latency.

## Review và repair loops

Tính năng quan trọng thường không phải extraction. Đó là repair.

Nếu field bị thiếu hoặc đáng nghi, hệ thống không nên âm thầm xuất dữ liệu xấu. Nó nên:

- hiển thị vùng bằng chứng;
- giải thích vì sao confidence thấp;
- yêu cầu human review;
- lưu correction;
- chạy validation lại;
- cải thiện routing decision sau này.

Điều này biến Document AI thành workflow có kiểm soát thay vì black box.

## Đo giá trị

Metric hữu ích gồm:

- tỷ lệ tài liệu hoàn tất không cần manual review;
- thời gian review trung bình;
- độ đúng extraction theo từng field;
- repair success rate;
- chi phí provider mỗi tài liệu;
- số field rủi ro cao được bắt trước khi export.

Những metric này nối chất lượng AI với vận hành doanh nghiệp.

## Điều tôi rút ra

Agentic document intelligence không nằm ở một model thật mạnh, mà nằm ở orchestration.

OCR tạo ra text. Sản phẩm cần quyết định: provider nào, field nào, rủi ro nào, repair path nào và khi nào con người phải can thiệp. Đó là nơi hệ thống trở nên hữu ích.

Dự án liên quan: [Dossier](/vi/work/dossier).


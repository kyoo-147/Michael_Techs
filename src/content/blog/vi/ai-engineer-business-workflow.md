---
title: 'Vì sao AI Engineer cần hiểu business workflow, không chỉ model'
description: >-
  AI Engineer không chỉ cần biết prompt, RAG hay model. Muốn tạo giá trị thật,
  phải hiểu workflow, dữ liệu, người dùng và cách hệ thống đi vào vận hành.
pubDatetime: '2025-04-17T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - AI Product Thinking
  - AI Engineer
  - Business Workflow
  - Product Thinking
  - Applied AI
  - AI Product
categories:
  - AI
  - Product
---

Có một lỗi khá dễ gặp khi mới học AI: mình nghĩ rằng chỉ cần chọn đúng model, viết prompt tốt, thêm RAG vào là sẽ có một sản phẩm tốt.

Nhưng khi đem AI vào một công ty thật, vấn đề thường không nằm ở câu hỏi “model nào mạnh hơn?”. Vấn đề thật hơn là:

- dữ liệu đang nằm ở đâu?
- ai là người dùng cuối?
- họ đang làm việc theo quy trình nào?
- bước nào đang tốn thời gian nhất?
- bước nào cần con người duyệt lại?
- nếu AI trả lời sai thì ai chịu trách nhiệm?
- làm sao biết hệ thống này thật sự giúp doanh nghiệp tốt hơn?

Đó là lý do tôi nghĩ một AI Engineer tốt không nên chỉ hiểu model. Họ cần hiểu cả **business workflow**.

## 1. AI trong doanh nghiệp không sống một mình

Một chatbot demo có thể đứng một mình. Nhưng một AI system trong doanh nghiệp thì không.

Nó thường nằm giữa nhiều thứ:

```txt
Form / Website
    ↓
Database / CRM
    ↓
Business rules
    ↓
AI model / LLM / RAG
    ↓
Human approval
    ↓
Email / Zalo / Slack / Dashboard
```

Ví dụ với một workflow xử lý lead trong CRM:

1. khách điền form trên website,
2. hệ thống lưu lead vào database,
3. AI đọc thông tin và phân loại mức độ tiềm năng,
4. nếu lead tốt thì tạo deal,
5. nếu cần follow-up thì gợi ý nội dung nhắn,
6. nhân viên duyệt lại,
7. hệ thống cập nhật trạng thái trong CRM.

Ở đây, LLM chỉ là một phần nhỏ. Nếu API lỗi, dữ liệu thiếu, workflow không rõ, trạng thái lead bị rối, hoặc nhân viên không tin kết quả AI, thì model tốt cũng không cứu được sản phẩm.

## 2. Forward Deployed Engineer cho thấy một hướng rất rõ

Andrew Ng gần đây có viết về vai trò **AI Forward Deployed Engineer**: người kỹ sư được “đưa vào gần khách hàng” để tùy chỉnh giải pháp AI, hiểu bài toán thật và triển khai vào tổ chức. Trong trang Writing của ông, bài này được mô tả là một vai trò mới trong AI Engineering, nơi kỹ sư không chỉ build model mà còn giúp customize solution cho client organization.

Điểm tôi rút ra là: AI Engineer trong thực tế đang tiến gần hơn tới kiểu người vừa biết kỹ thuật, vừa hiểu quy trình vận hành.

Không phải kiểu “tôi biết dùng LangChain”.

Mà là:

> Tôi hiểu quy trình này đang tắc ở đâu, dữ liệu nào đáng tin, AI nên can thiệp ở bước nào, và bước nào vẫn phải để con người quyết định.

## 3. Business workflow giúp mình biết AI nên làm gì, và không nên làm gì

Một lỗi rất thường gặp là biến mọi thứ thành AI Agent.

Nhưng không phải bước nào cũng cần AI.

Ví dụ trong CRM:

| Bước | Có cần AI không? | Lý do |
|---|---|---|
| Lưu lead mới | Không nhất thiết | CRUD bình thường là đủ |
| Kiểm tra email/số điện thoại hợp lệ | Có thể dùng rule | Không cần LLM |
| Tóm tắt nhu cầu khách hàng | Có thể dùng LLM | Dữ liệu text tự nhiên, cần hiểu ngữ cảnh |
| Chấm điểm lead | Có thể dùng rule + ML | Cần metric rõ, không chỉ cảm tính |
| Gửi báo giá chính thức | Nên có người duyệt | Rủi ro business cao |
| Nhắc follow-up | Automation là đủ | Có thể dùng workflow scheduler |

Nếu không hiểu workflow, mình sẽ dễ dùng AI sai chỗ.

AI nên được đặt ở những điểm có **ngữ cảnh, dữ liệu không cấu trúc, hoặc quyết định cần hỗ trợ**. Còn những bước rõ ràng, lặp lại, có rule tốt thì automation thường đủ.

## 4. AI tạo giá trị khi nó giảm ma sát trong công việc thật

Một AI feature nghe rất hay trên landing page chưa chắc tạo giá trị.

Giá trị thật thường đến từ những thứ rất cụ thể:

- giảm thời gian xử lý lead,
- giảm số bước nhập liệu,
- giảm việc quên follow-up,
- giảm thời gian tìm thông tin khách hàng,
- giúp nhân viên mới hiểu lịch sử giao dịch nhanh hơn,
- giúp manager thấy pipeline rõ hơn.

Ví dụ, thay vì nói “AI CRM Assistant”, tôi sẽ thiết kế rõ hơn:

```txt
Lead mới vào hệ thống
    ↓
AI tóm tắt nhu cầu khách hàng
    ↓
AI gợi ý tag: hot lead / cần tư vấn / chưa rõ nhu cầu
    ↓
AI đề xuất next action
    ↓
Nhân viên duyệt hoặc chỉnh sửa
    ↓
CRM ghi lại activity log
```

Cái này nghe ít hào nhoáng hơn “AI Agent tự động bán hàng”, nhưng thực tế hơn nhiều.

## 5. Cần đo giá trị bằng metric gần với business

Một model có accuracy cao chưa chắc giúp doanh nghiệp tốt hơn.

Với AI workflow, tôi sẽ nhìn vào các metric như:

- lead response time giảm bao nhiêu,
- tỉ lệ follow-up đúng hạn tăng không,
- số lead bị bỏ sót giảm không,
- nhân viên có dùng gợi ý của AI không,
- thời gian tạo quote giảm không,
- khách hàng có phản hồi nhanh hơn không,
- lỗi nghiêm trọng có giảm hay tăng.

Đây là điểm nhiều bài về applied AI hay nhắc: model metric và business metric là hai chuyện khác nhau. Một hệ thống AI tốt cần nối được cả hai.

## 6. Ví dụ nhỏ: thiết kế AI cho quy trình báo giá

Giả sử doanh nghiệp có quy trình báo giá như sau:

```txt
Khách hỏi giá
    ↓
Sales đọc nhu cầu
    ↓
Tìm sản phẩm/dịch vụ phù hợp
    ↓
Tạo quote
    ↓
Gửi khách
    ↓
Follow-up
```

AI không nhất thiết phải tự động gửi quote ngay. Cách an toàn hơn:

- AI tóm tắt yêu cầu khách hàng,
- AI gợi ý sản phẩm/dịch vụ liên quan,
- AI tạo bản nháp quote,
- người phụ trách kiểm tra giá và điều khoản,
- hệ thống gửi sau khi được duyệt,
- CRM tự tạo reminder follow-up.

Ở đây AI giúp giảm thời gian chuẩn bị, nhưng vẫn giữ control ở bước quan trọng.

## 7. Kết luận

AI Engineer không nên chỉ hỏi: “Model nào tốt nhất?”

Câu hỏi đúng hơn là:

> Workflow nào đang đau nhất, AI nên đứng ở đâu trong workflow đó, và làm sao biết nó thật sự giúp người dùng làm việc tốt hơn?

Với tôi, đây là hướng rất thực tế cho AI Product Engineering. AI không phải là một lớp trang trí cho sản phẩm. Nó phải được cắm vào đúng quy trình, đúng dữ liệu, đúng người dùng, và đúng điểm tạo giá trị.

## Nguồn tham khảo

- Andrew Ng — Writing: Forward Deployed Engineers and the Future of AI Engineering: https://www.andrewng.org/writing
- IBM — What are Agentic Workflows?: https://www.ibm.com/think/topics/agentic-workflows
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI RMF 1.0 PDF: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf

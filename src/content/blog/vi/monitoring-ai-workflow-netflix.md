---
title: 'Monitoring cho AI workflow: học từ Netflix nhưng áp dụng ở scale nhỏ'
description: >-
  Thiết kế monitoring vừa đủ cho AI workflow nhỏ: logs, metrics, traces,
  evaluation và business signals.
pubDatetime: '2023-06-08T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - System Design Case Studies
  - Monitoring
  - AI Workflow
  - Netflix
  - Observability
  - Logs
  - Metrics
categories:
  - Technical
  - AI
---

Monitoring cho AI workflow không nên bắt đầu bằng một dashboard thật đẹp.

Nó nên bắt đầu bằng một câu hỏi đơn giản hơn: **khi workflow sai, tôi có biết sai ở đâu không?**

Tôi đọc các bài Netflix về observability và thấy một điểm rất rõ: hệ thống lớn cần nhiều “độ phóng đại” để debug. Nhưng với sản phẩm nhỏ, ta không cần bê nguyên Netflix về. Ta chỉ cần lấy tư duy đúng và làm một phiên bản vừa đủ.

## Nguồn tôi đọc

- Netflix Tech Blog — [A Microscope on Microservices](https://techblog.netflix.com/2015/02/a-microscope-on-microservices.html)
- Netflix Tech Blog — [Lessons from Building Observability Tools at Netflix](https://netflixtechblog.com/lessons-from-building-observability-tools-at-netflix-7cfafed6ab17)

## 1. AI workflow có nhiều điểm fail hơn ta tưởng

Ví dụ một workflow CRM:

```txt
Lead được tạo
  → kiểm tra dữ liệu
  → enrichment
  → gọi LLM phân loại
  → tạo follow-up message
  → lưu vào CRM
  → gửi notification
  → cập nhật dashboard
```

Khi workflow fail, nguyên nhân có thể là:

- dữ liệu lead thiếu;
- API enrichment timeout;
- LLM trả về format sai;
- prompt version mới làm output tệ;
- database lock/chậm;
- queue bị backlog;
- notification provider lỗi;
- frontend cache dữ liệu cũ.

Nếu không monitor từng bước, ta chỉ thấy một dòng: “workflow failed”.

Dòng đó gần như vô dụng.

## 2. Ba lớp monitoring nên có

### Lớp 1: Technical health

```txt
request_count
error_rate
latency_p95
latency_p99
queue_depth
retry_count
database_query_time
```

Nó trả lời: hệ thống có chạy ổn không?

### Lớp 2: AI behavior

```txt
model_name
prompt_version
output_parse_error_rate
evaluation_score
human_correction_rate
low_confidence_rate
```

Nó trả lời: AI có đang tạo output ổn không?

### Lớp 3: Product impact

```txt
lead_response_time
follow_up_created_count
follow_up_sent_count
quote_created_count
deal_stage_conversion
user_acceptance_rate
```

Nó trả lời: workflow có tạo giá trị không?

## 3. Log phải có context

Log kiểu này không đủ:

```txt
Error: LLM failed
```

Log nên có context:

```json
{
  "event": "workflow.step_failed",
  "workflow_id": "lead_follow_up_v1",
  "run_id": "run_789",
  "workspace_id": "ws_001",
  "lead_id": "lead_123",
  "step": "generate_follow_up_message",
  "model": "gpt-4.1-mini",
  "prompt_version": "followup_v3",
  "error_type": "json_parse_error",
  "latency_ms": 2840
}
```

Không cần log quá nhiều, nhưng log phải giúp người đọc biết chuyện gì đang xảy ra.

## 4. Trace một workflow như một câu chuyện

Một trace tốt giống như timeline:

```txt
run_789
  ├── validate_lead: 12ms
  ├── enrich_company: 430ms
  ├── classify_lead: 910ms
  ├── generate_follow_up: 2840ms
  ├── parse_output: failed
  └── fallback_to_draft_template: 18ms
```

Khi nhìn trace này, ta biết ngay vấn đề nằm ở bước parse output, không phải database hay frontend.

## 5. Alert ít nhưng đúng

Một hệ nhỏ không cần 50 alerts. Alert nhiều quá thì cuối cùng không ai đọc.

Tôi sẽ bắt đầu với vài alert:

```txt
Workflow failure rate > 5% trong 10 phút
Queue depth tăng liên tục trong 15 phút
LLM timeout rate > 10%
Output parse error tăng đột biến
Human correction rate tăng sau khi đổi prompt
```

Điểm cuối rất quan trọng: không chỉ alert kỹ thuật, mà alert cả chất lượng AI.

## Kết

Monitoring cho AI workflow không cần bắt đầu phức tạp. Nhưng phải bắt đầu đúng.

Đầu tiên, log có context.  
Sau đó, metrics cho từng step.  
Rồi trace để hiểu luồng chạy.  
Cuối cùng, evaluation và business metric để biết AI có thật sự hữu ích không.

Một AI workflow không quan sát được thì chỉ là một black box đẹp mắt. Chạy được hôm nay, nhưng ngày mai sai ở đâu thì không ai biết.

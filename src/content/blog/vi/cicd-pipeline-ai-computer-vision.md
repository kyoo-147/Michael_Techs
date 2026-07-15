---
title: Tự dựng CI/CD pipeline cho AI/Computer Vision project nhỏ
description: >-
  Một pipeline thực tế cho project AI hoặc Computer Vision nhỏ: test, build
  Docker image, chạy eval cơ bản và deploy an toàn hơn.
pubDatetime: '2023-03-23T00:00:00.000Z'
locale: vi
author: Michael
tags:
  - Technical Notes
  - CI/CD
  - GitHub Actions
  - Docker
  - Computer Vision
  - Deployment
  - MLOps
categories:
  - Technical
  - AI
---

## Mở bài

Nhiều project AI/Computer Vision ban đầu thường bắt đầu bằng notebook hoặc một script Python chạy được trên máy cá nhân. Điều đó ổn ở giai đoạn thử nghiệm. Nhưng nếu muốn đưa vào portfolio hoặc production nhỏ, project cần nhiều hơn một file `main.py`.

Một hệ thống tốt hơn cần trả lời được:

```text
Code có chạy lại được không?
Model service có build được không?
API có test không?
Docker image có tạo được không?
Có thể deploy lại khi push code không?
Nếu thay model thì có phát hiện lỗi cơ bản không?
```

Bài này ghi lại một CI/CD pipeline tối thiểu cho project AI/Computer Vision nhỏ, ví dụ như defect detection, object detection hoặc image classification API.

## 1. Mục tiêu pipeline

Với một project nhỏ, tôi không cần Kubernetes hay hệ thống MLOps quá nặng ngay từ đầu. Tôi cần một pipeline đủ rõ:

```text
Push / Pull Request
      ↓
Lint & Unit Test
      ↓
Model/API Smoke Test
      ↓
Build Docker Image
      ↓
Push Image / Deploy
      ↓
Basic Monitoring
```

Pipeline này giúp project từ “demo chạy trên máy tôi” thành “service có thể build, test và deploy lại”.

## 2. Cấu trúc project đề xuất

```text
cv-defect-api/
  app/
    main.py
    inference.py
    schemas.py
  models/
    model.onnx
  tests/
    test_api.py
    test_inference.py
  sample_data/
    normal.jpg
    defect.jpg
  Dockerfile
  requirements.txt
  .github/
    workflows/
      ci.yml
  README.md
```

Nếu model lớn, không nên commit thẳng vào Git. Có thể lưu ở release artifact, S3, Google Drive nội bộ hoặc model registry. Nhưng với project portfolio nhỏ, có thể dùng một model nhẹ hoặc mock model để demo pipeline.

## 3. API service tối thiểu

Ví dụ dùng FastAPI:

```python
from fastapi import FastAPI, UploadFile

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile):
    image_bytes = await file.read()
    # result = run_inference(image_bytes)
    result = {"label": "normal", "confidence": 0.98}
    return result
```

Endpoint `/health` cực kỳ quan trọng. Nó giúp CI/CD và platform deploy biết service có sống hay không.

## 4. Test gì cho Computer Vision?

Computer Vision project không chỉ test code. Nhưng bản đầu tiên vẫn nên có test đơn giản.

### Unit test

Test hàm preprocessing:

```python
def test_preprocess_returns_expected_shape():
    image = load_sample_image("sample_data/normal.jpg")
    tensor = preprocess(image)
    assert tensor.shape == (1, 3, 224, 224)
```

### API smoke test

Test endpoint chạy được:

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

### Inference sanity test

Không cần kỳ vọng model hoàn hảo. Nhưng nên kiểm tra output có đúng format:

```python
def test_prediction_schema():
    result = run_inference("sample_data/normal.jpg")
    assert "label" in result
    assert "confidence" in result
    assert 0 <= result["confidence"] <= 1
```

## 5. Dockerfile tối thiểu

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Docker giúp môi trường chạy nhất quán hơn. Nếu service chạy được trong container, khả năng deploy sang Render, Railway, AWS hoặc server riêng sẽ dễ hơn.

## 6. GitHub Actions pipeline

Một workflow đơn giản:

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Run tests
        run: pytest

      - name: Build Docker image
        run: docker build -t cv-defect-api:latest .
```

Bản này chưa push image. Nhưng nó đã đảm bảo: pull request nào cũng phải install dependencies, chạy test và build Docker image được.

## 7. Build và push Docker image

Khi ổn hơn, có thể push image lên registry. GitHub có hướng dẫn chính thức cho việc publish Docker image bằng GitHub Actions.

Ví dụ high-level:

```yaml
- name: Login to Docker Hub
  uses: docker/login-action@v3
  with:
    username: ${{ secrets.DOCKERHUB_USERNAME }}
    password: ${{ secrets.DOCKERHUB_TOKEN }}

- name: Build and push
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: username/cv-defect-api:latest
```

Không nên hard-code token trong repo. Dùng GitHub Secrets.

## 8. Deploy thế nào cho project nhỏ?

Với project portfolio, tôi sẽ chọn theo mức độ đơn giản:

```text
Vercel → frontend/demo page
Render/Railway → backend FastAPI
Supabase/PostgreSQL → database nếu cần
Docker Hub/GHCR → image registry
```

Nếu dùng AWS thì có thể dùng EC2 hoặc ECS, nhưng không nên làm AWS quá phức tạp nếu mục tiêu chỉ là demo kỹ thuật rõ ràng.

## 9. Monitoring tối thiểu

Không có monitoring thì deploy xong cũng không biết lỗi.

Tối thiểu nên log:

- request path
- latency
- status code
- prediction label
- confidence
- error traceback nếu inference fail

Ví dụ log đơn giản:

```python
import time

start = time.time()
result = run_inference(image)
latency_ms = int((time.time() - start) * 1000)

logger.info({
    "event": "prediction_completed",
    "latency_ms": latency_ms,
    "label": result["label"],
    "confidence": result["confidence"],
})
```

Với Computer Vision, nên theo dõi thêm:

```text
inference latency
failed prediction rate
image size distribution
confidence distribution
number of predictions per day
```

## 10. Những lỗi dễ gặp

- Test chỉ test API, không test inference format.
- Docker image build được nhưng model file thiếu.
- Model quá nặng khiến CI chậm.
- Secrets bị commit nhầm.
- Không có `/health` endpoint.
- Deploy xong không có log.
- Không ghi rõ trong README cách chạy local.

## 11. README nên có gì?

Một project portfolio tốt nên có README rõ:

```text
Problem
Architecture
Tech Stack
How to run locally
API endpoints
CI/CD pipeline
Demo video
Limitations
Next steps
```

## Kết luận

CI/CD cho AI/Computer Vision project nhỏ không cần bắt đầu bằng hệ thống enterprise. Chỉ cần:

```text
pytest
Dockerfile
GitHub Actions
health check
basic inference test
deployment target
README tốt
```

Bài học chính của tôi:

- Project AI cũng cần software engineering discipline.
- Model chỉ là một phần của hệ thống.
- Docker giúp giảm vấn đề “chạy được trên máy tôi”.
- CI/CD giúp phát hiện lỗi trước khi deploy.
- Monitoring tối thiểu giúp project giống production hơn.

## Nguồn tham khảo

- GitHub Actions overview: https://docs.github.com/articles/getting-started-with-github-actions
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Docker Build with GitHub Actions: https://docs.docker.com/build/ci/github-actions/
- GitHub Docs — Publishing Docker images: https://docs.github.com/actions/guides/publishing-docker-images
- FastAPI documentation: https://fastapi.tiangolo.com/

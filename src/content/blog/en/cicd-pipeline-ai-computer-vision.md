---
title: Building a CI/CD Pipeline for Small AI/Computer Vision Projects
description: >-
  A practical pipeline for a small AI or Computer Vision project: test, build
  Docker image, run basic eval, and deploy more securely.
pubDatetime: '2023-03-23T00:00:00.000Z'
locale: en
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

## Introduction

Many AI/Computer Vision projects initially start with a Jupyter notebook or a Python script that runs locally on a personal machine. That is fine in the experimental phase. But to put it into a portfolio or a small production environment, the project needs more than just a `main.py` file.

A better system needs to answer:

```text
Is the code reproducible?
Can the model service be built?
Are there tests for the API?
Can a Docker image be created?
Can it be redeployed upon a code push?
If the model changes, are basic errors detected?
```

This post documents a minimal CI/CD pipeline for a small AI/Computer Vision project, such as a defect detection, object detection, or image classification API.

## 1. Pipeline goals

For a small project, I don't need Kubernetes or a heavy MLOps system from the start. I need a clear pipeline:

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

This pipeline helps the project transition from a "demo running on my machine" to a "service that can be built, tested, and redeployed".

## 2. Proposed project structure

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

If the model is large, it shouldn't be committed directly to Git. It can be stored in release artifacts, S3, an internal Google Drive, or a model registry. But for a small portfolio project, a lightweight model or a mock model can be used to demo the pipeline.

## 3. Minimal API service

Example using FastAPI:

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

The `/health` endpoint is extremely important. It helps CI/CD and deployment platforms know if the service is alive or dead.

## 4. What to test for Computer Vision?

Computer Vision projects don't just test code. But the first version should still have simple tests.

### Unit test

Test the preprocessing function:

```python
def test_preprocess_returns_expected_shape():
    image = load_sample_image("sample_data/normal.jpg")
    tensor = preprocess(image)
    assert tensor.shape == (1, 3, 224, 224)
```

### API smoke test

Test that the endpoint runs:

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

No need to expect a perfect model. But you should check if the output format is correct:

```python
def test_prediction_schema():
    result = run_inference("sample_data/normal.jpg")
    assert "label" in result
    assert "confidence" in result
    assert 0 <= result["confidence"] <= 1
```

## 5. Minimal Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Docker helps make the runtime environment more consistent. If the service runs in a container, deploying to Render, Railway, AWS, or a private server will be easier.

## 6. GitHub Actions pipeline

A simple workflow:

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

This version doesn't push the image yet. But it ensures: every pull request must install dependencies, run tests, and successfully build the Docker image.

## 7. Build and push Docker image

When more stable, you can push the image to a registry. GitHub has an official guide for publishing Docker images using GitHub Actions.

High-level example:

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

Don't hard-code tokens in the repo. Use GitHub Secrets.

## 8. How to deploy a small project?

For a portfolio project, I'd choose based on simplicity:

```text
Vercel → frontend/demo page
Render/Railway → backend FastAPI
Supabase/PostgreSQL → database if needed
Docker Hub/GHCR → image registry
```

If using AWS, you could use EC2 or ECS, but don't overcomplicate AWS if the goal is just a clear technical demo.

## 9. Minimal monitoring

Without monitoring, you won't know about errors after deployment.

At a minimum, log:

- request path
- latency
- status code
- prediction label
- confidence
- error traceback if inference fails

Example simple log:

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

For Computer Vision, also monitor:

```text
inference latency
failed prediction rate
image size distribution
confidence distribution
number of predictions per day
```

## 10. Common pitfalls

- Tests only cover the API, not the inference format.
- Docker image builds successfully but model file is missing.
- Model is too heavy, making CI extremely slow.
- Secrets accidentally committed.
- No `/health` endpoint.
- No logs after deployment.
- README doesn't clearly explain how to run locally.

## 11. What should be in the README?

A good portfolio project should have a clear README:

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

## Conclusion

CI/CD for a small AI/Computer Vision project doesn't need to start with an enterprise system. You just need:

```text
pytest
Dockerfile
GitHub Actions
health check
basic inference test
deployment target
a good README
```

My main lessons:

- AI projects also need software engineering discipline.
- The model is only one part of the system.
- Docker helps reduce "it works on my machine" issues.
- CI/CD helps detect bugs before deployment.
- Minimal monitoring makes the project feel more like production.

## References

- GitHub Actions overview: https://docs.github.com/articles/getting-started-with-github-actions
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Docker Build with GitHub Actions: https://docs.docker.com/build/ci/github-actions/
- GitHub Docs — Publishing Docker images: https://docs.github.com/actions/guides/publishing-docker-images
- FastAPI documentation: https://fastapi.tiangolo.com/

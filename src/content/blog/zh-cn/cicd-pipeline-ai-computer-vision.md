---
title: 为小型 AI/计算机视觉项目构建 CI/CD 管道
description: 一个适用于小型 AI 或计算机视觉项目的实用管道：测试、构建 Docker 镜像、运行基本评估，并更安全地进行部署。
pubDatetime: '2023-03-23T00:00:00.000Z'
locale: zh-cn
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

## 引言

许多 AI/计算机视觉项目最初都是从在个人机器上运行的 Jupyter notebook 或 Python 脚本开始的。在实验阶段这样做很好。但是如果想把它放进作品集或小型的生产环境中，项目需要的不仅仅是一个 `main.py` 文件。

一个更好的系统需要回答：

```text
代码可复现吗？
模型服务可以构建吗？
API 有测试吗？
可以创建 Docker 镜像吗？
推送代码时可以重新部署吗？
如果模型更改，能检测到基本错误吗？
```

本文记录了一个适用于小型 AI/计算机视觉项目的最小 CI/CD 管道，例如缺陷检测、对象检测或图像分类 API。

## 1. 管道目标

对于一个小型项目，我一开始不需要 Kubernetes 或沉重的 MLOps 系统。我需要一个清晰的管道：

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

此管道有助于项目从“在我的机器上运行的演示”转变为“可以构建、测试并重新部署的服务”。

## 2. 建议的项目结构

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

如果模型很大，不应将其直接提交到 Git 中。它可以存储在发布工件 (release artifacts)、S3、内部 Google Drive 或模型注册表中。但是对于小型的作品集项目，可以使用轻量级模型或模拟模型 (mock model) 来演示管道。

## 3. 最小的 API 服务

使用 FastAPI 的示例：

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

`/health` 端点极其重要。它帮助 CI/CD 和部署平台知道服务是死是活。

## 4. 计算机视觉测试什么？

计算机视觉项目不仅仅测试代码。但第一个版本仍应具有简单的测试。

### 单元测试

测试预处理函数：

```python
def test_preprocess_returns_expected_shape():
    image = load_sample_image("sample_data/normal.jpg")
    tensor = preprocess(image)
    assert tensor.shape == (1, 3, 224, 224)
```

### API 冒烟测试

测试端点是否运行：

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

### 推理完整性测试 (Inference sanity test)

不需要期望一个完美的模型。但你应该检查输出格式是否正确：

```python
def test_prediction_schema():
    result = run_inference("sample_data/normal.jpg")
    assert "label" in result
    assert "confidence" in result
    assert 0 <= result["confidence"] <= 1
```

## 5. 最小的 Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Docker 有助于使运行环境更加一致。如果服务在容器中运行，部署到 Render、Railway、AWS 或私有服务器将会更容易。

## 6. GitHub Actions 管道

一个简单的工作流：

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

此版本尚未推送镜像。但它确保了：每个 pull request 必须安装依赖项，运行测试，并成功构建 Docker 镜像。

## 7. 构建和推送 Docker 镜像

当更稳定时，你可以将镜像推送到注册表。GitHub 有使用 GitHub Actions 发布 Docker 镜像的官方指南。

高层次的例子：

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

不要在 repo 中硬编码 token。使用 GitHub Secrets。

## 8. 如何部署一个小项目？

对于作品集项目，我将根据简单性进行选择：

```text
Vercel → 前端/演示页面
Render/Railway → 后端 FastAPI
Supabase/PostgreSQL → 数据库 (如果需要)
Docker Hub/GHCR → 镜像注册表
```

如果使用 AWS，你可以使用 EC2 或 ECS，但如果目标只是一个清晰的技术演示，不要把 AWS 搞得太复杂。

## 9. 最低限度的监控

没有监控，部署后你就不知道发生了什么错误。

至少记录：

- 请求路径 (request path)
- 延迟 (latency)
- 状态码 (status code)
- 预测标签 (prediction label)
- 置信度 (confidence)
- 错误追踪 (error traceback) 如果推理失败

简单的日志示例：

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

对于计算机视觉，还应监控：

```text
推理延迟 (inference latency)
预测失败率 (failed prediction rate)
图像大小分布 (image size distribution)
置信度分布 (confidence distribution)
每天的预测数量
```

## 10. 常见陷阱

- 测试仅覆盖了 API，而没有覆盖推理格式。
- Docker 镜像成功构建，但缺少模型文件。
- 模型太重，导致 CI 极慢。
- 机密信息 (secrets) 被意外提交。
- 没有 `/health` 端点。
- 部署后没有日志。
- README 没有清楚地解释如何在本地运行。

## 11. README 应该包含什么？

一个好的作品集项目应该有一个清晰的 README：

```text
Problem (问题)
Architecture (架构)
Tech Stack (技术栈)
How to run locally (如何在本地运行)
API endpoints (API 端点)
CI/CD pipeline (CI/CD 管道)
Demo video (演示视频)
Limitations (局限性)
Next steps (后续步骤)
```

## 结论

小型 AI/计算机视觉项目的 CI/CD 不需要从企业级系统开始。你只需要：

```text
pytest
Dockerfile
GitHub Actions
health check (健康检查)
basic inference test (基本推理测试)
deployment target (部署目标)
a good README (一个好的 README)
```

我的主要经验教训：

- AI 项目也需要软件工程纪律。
- 模型只是系统的一部分。
- Docker 有助于减少“在我的机器上能跑”的问题。
- CI/CD 有助于在部署前发现 bug。
- 最小限度的监控使项目感觉更像生产环境。

## 参考资源

- GitHub Actions overview: https://docs.github.com/articles/getting-started-with-github-actions
- GitHub Actions workflow syntax: https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions
- Docker Build with GitHub Actions: https://docs.docker.com/build/ci/github-actions/
- GitHub Docs — Publishing Docker images: https://docs.github.com/actions/guides/publishing-docker-images
- FastAPI documentation: https://fastapi.tiangolo.com/

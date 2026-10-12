# Python FastAPI AI service — Optimized CPU build for c7i.flex.large
FROM python:3.11-slim

WORKDIR /app

# System libs needed by opencv-headless
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
 && rm -rf /var/lib/apt/lists/*


FROM nvidia/cuda:12.6.1-runtime-ubuntu22.04
WORKDIR /app
RUN apt-get update && apt-get install -y curl python3 python3-pip && rm -rf /var/lib/apt/lists/*
COPY . .
EXPOSE 8082
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fsS http://localhost:8082/healthz || exit 1
CMD ["python3", "app.py"]

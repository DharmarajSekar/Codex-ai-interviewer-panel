# AI Interviewer Platform — Local MVP Execution & Runtime Validation Guide

> **Scope:** This runbook is designed to make a typical AI Interviewer MVP runnable **locally end-to-end** with backend + frontend + LLM + STT + TTS + Redis + PostgreSQL + WebSockets + avatar/realtime flows.
>
> **Note:** This repository currently contains no application source files, so this guide provides a complete, production-style **reference runbook and command templates** you can apply directly once code/services are added.

---

## 1) Repository Setup Instructions

## Prerequisites

- OS: macOS, Ubuntu, or WSL2/Linux
- Git
- Docker Desktop (or Docker Engine + Compose plugin)
- Node.js 20+
- Python 3.11+
- PostgreSQL client (`psql`)
- Redis CLI (`redis-cli`)
- `curl`, `jq`, `ffmpeg`

## Clone and initialize

```bash
git clone <your-repo-url> ai-interviewer-platform
cd ai-interviewer-platform

# Create expected folder layout if missing
mkdir -p backend frontend infra scripts logs
```

## Python and Node setup

```bash
# Backend venv
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip

# Install backend deps once requirements are present
# pip install -r backend/requirements.txt

# Install frontend deps once package.json exists
# cd frontend && npm install && cd ..
```

---

## 2) Backend Startup Process

## Expected backend responsibilities

- REST API (session creation, interview state, scoring)
- WebSocket gateway (bi-directional realtime events)
- ASR ingress + transcript aggregation
- LLM orchestration (Ollama)
- TTS pipeline (Coqui)
- Persistence (PostgreSQL + Redis)

## Typical startup (example)

```bash
source .venv/bin/activate
export PYTHONUNBUFFERED=1

# Example FastAPI/uvicorn command
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Health checks:

```bash
curl -sS http://localhost:8000/health | jq
curl -sS http://localhost:8000/ready | jq
```

---

## 3) Frontend Startup Process

## Typical startup (React/Vite/Next style)

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

Validate:

- App loads at `http://localhost:3000`
- Can create candidate session
- WebSocket connects (browser devtools → Network → WS)

---

## 4) Ollama Installation and Model Setup

## Install Ollama

macOS/Linux:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Start daemon:

```bash
ollama serve
```

Pull models (choose one primary + one fallback):

```bash
ollama pull llama3.1:8b
ollama pull qwen2.5:7b
```

Smoke test:

```bash
curl -s http://localhost:11434/api/generate \
  -d '{"model":"llama3.1:8b","prompt":"Say: ollama ready","stream":false}' | jq
```

---

## 5) Whisper Setup

Two common options:

## Option A: `faster-whisper` in backend process

```bash
pip install faster-whisper
```

Runtime expectation:

- Model loaded at backend startup (`small`/`medium` for MVP)
- Receives PCM chunks from client
- Emits partial + final transcript events

## Option B: OpenAI Whisper package

```bash
pip install openai-whisper
```

GPU systems should also have compatible CUDA/PyTorch builds.

---

## 6) Coqui TTS Setup

```bash
pip install TTS
```

Download and test a model:

```bash
python - <<'PY'
from TTS.api import TTS
tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False)
tts.tts_to_file(text="Hello, your AI interviewer is ready.", file_path="/tmp/tts_test.wav")
print("ok")
PY
```

Validate output audio:

```bash
ffprobe /tmp/tts_test.wav
```

---

## 7) Redis Setup

Local container:

```bash
docker run -d --name ai-redis -p 6379:6379 redis:7-alpine
```

Validation:

```bash
redis-cli -h 127.0.0.1 -p 6379 ping
# expected: PONG
```

Use cases:

- Session cache
- Realtime event queues
- Rate limits / ephemeral state

---

## 8) PostgreSQL Setup

Local container:

```bash
docker run -d --name ai-postgres \
  -e POSTGRES_USER=aiuser \
  -e POSTGRES_PASSWORD=aipass \
  -e POSTGRES_DB=ai_interviewer \
  -p 5432:5432 postgres:16
```

Validation:

```bash
psql "postgresql://aiuser:aipass@localhost:5432/ai_interviewer" -c 'select 1;'
```

Migration template:

```bash
# alembic upgrade head
```

---

## 9) Docker Compose Startup

Example orchestration command (once `docker-compose.yml` exists):

```bash
docker compose up -d --build
```

Expected services:

- `backend` (8000)
- `frontend` (3000)
- `postgres` (5432)
- `redis` (6379)
- optional `ollama` sidecar (11434)

Validation:

```bash
docker compose ps
docker compose logs -f backend
```

---

## 10) Environment Variable Configuration

Create `.env` in repo root:

```dotenv
# Core
APP_ENV=local
LOG_LEVEL=DEBUG

# Backend
BACKEND_PORT=8000
API_BASE_URL=http://localhost:8000
WS_BASE_URL=ws://localhost:8000

# Frontend
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:8000
VITE_WS_BASE_URL=ws://localhost:8000

# PostgreSQL
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=ai_interviewer
POSTGRES_USER=aiuser
POSTGRES_PASSWORD=aipass
DATABASE_URL=postgresql://aiuser:aipass@localhost:5432/ai_interviewer

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379/0

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Whisper
WHISPER_ENGINE=faster-whisper
WHISPER_MODEL=small

# TTS
TTS_ENGINE=coqui
TTS_MODEL=tts_models/en/ljspeech/tacotron2-DDC

# Realtime audio
AUDIO_SAMPLE_RATE=16000
AUDIO_FRAME_MS=20
```

---

## 11) GPU Setup Instructions

## NVIDIA (Linux/WSL2)

1. Install NVIDIA driver
2. Install CUDA toolkit (matching PyTorch build)
3. Install NVIDIA Container Toolkit for Docker GPU passthrough

Validate host GPU:

```bash
nvidia-smi
```

Validate Docker GPU:

```bash
docker run --rm --gpus all nvidia/cuda:12.3.2-base-ubuntu22.04 nvidia-smi
```

Backend runtime flags (example):

```dotenv
TORCH_DEVICE=cuda
WHISPER_DEVICE=cuda
TTS_DEVICE=cuda
```

---

## 12) CPU Fallback Instructions

When GPU unavailable:

```dotenv
TORCH_DEVICE=cpu
WHISPER_DEVICE=cpu
TTS_DEVICE=cpu
WHISPER_MODEL=base
OLLAMA_MODEL=qwen2.5:7b
```

Operational notes:

- Increase response/audio latency budgets
- Reduce concurrent sessions
- Prefer smaller models and shorter context windows

---

## 13) WebSocket Testing Workflow

## Manual browser validation

1. Open frontend and start interview session
2. Confirm WS handshake (`101 Switching Protocols`)
3. Observe events: `session.started`, `audio.partial`, `transcript.final`, `tts.ready`

## CLI validation with `wscat`

```bash
npm i -g wscat
wscat -c ws://localhost:8000/ws/interview/<session_id>
```

Send ping message:

```json
{"type":"ping","ts":1710000000}
```

Expected response:

```json
{"type":"pong"}
```

---

## 14) Avatar Testing Workflow

1. Enable avatar feature flag (`AVATAR_ENABLED=true`)
2. Start a mock interview question
3. Validate avatar state transitions:
   - `idle` → `listening` (candidate speaks)
   - `thinking` (LLM generating)
   - `speaking` (TTS playback)
4. Confirm lip-sync timing aligns with audio chunks/events

Debug checks:

- Browser console has no media/autoplay errors
- Avatar assets load with HTTP 200
- Animation frame rate remains stable

---

## 15) Realtime Audio Testing Workflow

1. Grant mic permissions in browser
2. Speak a known phrase: “My name is Alex and I have five years of backend experience.”
3. Validate pipeline:
   - mic capture chunked at configured frame size
   - backend receives binary/PCM frames
   - Whisper emits partial + final transcript
   - LLM response generated
   - Coqui returns WAV/PCM
   - frontend plays synthesized response

Metrics to watch:

- ASR partial latency (`<500ms` target)
- End-to-end turn latency (`<3–5s` MVP target CPU, better on GPU)

---

## 16) Recruiter Dashboard Testing

Test scenarios:

- List interviews and statuses
- Open candidate session timeline
- View transcript and scoring artifacts
- Filter by role/date/status
- Export report (if supported)

API checks:

```bash
curl -sS http://localhost:8000/api/recruiter/interviews | jq
curl -sS "http://localhost:8000/api/recruiter/interviews/<id>" | jq
```

---

## 17) End-to-End Interview Testing

Happy-path E2E:

1. Recruiter creates interview template
2. Candidate opens session link
3. Avatar asks intro question
4. Candidate answers via mic
5. Transcript appears realtime
6. Follow-up question generated contextually
7. Session ends and summary persisted
8. Recruiter views report/dashboard

Persistency checks:

- Interview row written in PostgreSQL
- Event cache/queue entries in Redis
- Transcript linked to interview session id

---

## 18) Transcript Validation

Validation dimensions:

- **Completeness:** all turns present
- **Ordering:** timestamps monotonic
- **Speaker attribution:** interviewer vs candidate
- **Confidence thresholds:** low-confidence spans flagged
- **Punctuation & segmentation:** sentence boundaries reasonable

Sample SQL checks:

```sql
SELECT interview_id, count(*) AS segment_count
FROM transcript_segments
GROUP BY interview_id
ORDER BY segment_count DESC;
```

```sql
SELECT * FROM transcript_segments
WHERE confidence < 0.65
ORDER BY created_at DESC
LIMIT 50;
```

---

## 19) Troubleshooting Guide

## Service won’t start

- Check port conflicts (`lsof -i :8000`, `:3000`, `:5432`, `:6379`, `:11434`)
- Verify `.env` loaded and not malformed
- Inspect logs (`docker compose logs -f <service>`)

## WebSocket disconnects

- Confirm reverse proxy/timeout settings
- Verify heartbeat ping/pong configured
- Check CORS/origin and auth token handling

## No transcription

- Validate audio sample rate and PCM encoding
- Confirm Whisper model loaded successfully
- Check mic permission + browser secure context settings

## TTS silent output

- Validate Coqui model path/name
- Check output format compatible with frontend player
- Confirm non-empty text input post-LLM

## High latency

- Switch to smaller LLM/Whisper models
- Use GPU where available
- Reduce chunk size, cap simultaneous sessions

## DB connection failures

- Verify `DATABASE_URL`
- Ensure PostgreSQL container healthy
- Re-run migrations

---

## 20) MVP Validation Checklist

Use this as release gate for local MVP:

- [ ] Frontend launches and loads interview UI
- [ ] Backend health/readiness endpoints pass
- [ ] Redis reachable (`PONG`)
- [ ] PostgreSQL reachable and migrations applied
- [ ] Ollama model responds to test prompt
- [ ] Whisper transcribes mic input
- [ ] Coqui synthesizes audible response
- [ ] WebSocket realtime events flow correctly
- [ ] Avatar state transitions and lip-sync work
- [ ] Recruiter dashboard lists and opens sessions
- [ ] Full interview completes end-to-end
- [ ] Transcript stored with valid ordering/speakers
- [ ] Basic latency within MVP threshold
- [ ] Logs contain no repeated critical errors

---

## Expected Runtime Architecture

```text
[Browser Frontend]
  ├─ UI + Avatar Renderer
  ├─ Mic Capture / Audio Playback
  └─ WS/HTTP Client
          |
          v
[Backend API + WS Gateway]
  ├─ Session Orchestrator
  ├─ Realtime Event Bus
  ├─ Whisper STT Adapter
  ├─ LLM Adapter (Ollama)
  ├─ Coqui TTS Adapter
  ├─ Redis Cache/Queue
  └─ PostgreSQL Persistence
```

---

## Startup Sequence Documentation (Recommended Order)

1. Start PostgreSQL
2. Start Redis
3. Start Ollama and pull model
4. Verify Whisper and Coqui dependencies load
5. Run DB migrations
6. Start backend
7. Start frontend
8. Run websocket/audio/avatar smoke tests
9. Run recruiter dashboard and E2E interview test

---

## Operational Notes

- Pin model versions and document model hashes for reproducibility.
- Keep a small default model profile for CPU-only demos.
- Log per-turn latency: capture, ASR, LLM, TTS, playback.
- Add structured correlation IDs per interview session.
- Persist raw event timeline for postmortem debugging.


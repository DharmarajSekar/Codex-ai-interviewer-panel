# AI Interviewer Platform (Infrastructure Skeleton)

Production-grade monorepo skeleton for an AI Interviewer platform using open-source technologies.

## Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+
- **Data**: PostgreSQL, Redis, ChromaDB
- **AI Integration**: LangChain with provider abstractions
- **Realtime**: WebSocket architecture
- **Infra**: Docker Compose, Nginx reverse proxy

## Repository Structure
```
.
├── frontend/                # Next.js app
├── backend/                 # FastAPI service
├── infra/                   # Docker and gateway config
├── docs/                    # Architecture docs
├── .env.example
└── docker-compose.yml
```

## Quick Start (Local)
1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Build and run services:
   ```bash
   docker compose up --build
   ```
3. Open:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
   - API docs: http://localhost:8000/docs

## Services
- `frontend`: Next.js UI
- `backend`: FastAPI API and websocket server
- `postgres`: primary relational database
- `redis`: low-latency state/session/cache
- `chromadb`: vector database API
- `nginx`: edge reverse proxy (optional entrypoint)

## Current Scope
This commit sets up **infrastructure and architecture only**:
- Scalable folder organization
- Provider interfaces (LLM/STT/TTS/Avatar)
- Interview orchestration engine skeleton
- Recruiter dashboard and candidate interview UI skeleton
- Docker and env baselines

No business logic implemented yet.

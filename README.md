# Recruiter Analytics and Evaluation Platform (Phase 7)

This module delivers a production-ready architecture for recruiter analytics, interview evaluation intelligence, and hiring decision support.

## Implemented Capabilities
- Recruiter analytics dashboard APIs and real-time updates via websocket hub.
- Candidate evaluation reports with competency scoring and recommendation rationale.
- AI-generated hiring recommendations and decision support logic.
- Competency scoring engine with transparent weighted aggregation.
- Technical skill radar panel scaffolding.
- Behavioral and communication report generation.
- Transcript timeline viewer and replay architecture blueprint.
- Candidate comparison dashboard logic.
- Downloadable evaluation report payload generation (JSON and PDF-ready buffer).

## Backend Modules
- `src/backend/services/competencyScoringEngine.ts`
- `src/backend/services/evaluationService.ts`
- `src/backend/services/candidateComparisonService.ts`
- `src/backend/api/recruiterDashboardApi.ts`
- `src/backend/reports/reportGenerationService.ts`
- `src/backend/realtime/dashboardSocket.ts`
- `src/backend/playback/interviewReplayArchitecture.md`

## Frontend Modules
- `src/frontend/components/RecruiterDashboard.tsx`
- `src/frontend/components/CompetencyRadarPanel.tsx`
- `src/frontend/components/TranscriptTimelineViewer.tsx`
- `src/frontend/pages/recruiterAnalyticsPage.tsx`
- `src/frontend/services/realtimeDashboardClient.ts`

## Notes
- UI chart placeholders are intentionally modular to connect to preferred enterprise charting libraries.
- PDF service currently emits a payload buffer ready to wire into a renderer.
This repository contains a modular, production-ready scaffold for:
- Recruiter analytics dashboards
- Candidate evaluation and comparison
- AI-generated hiring recommendations
- Realtime updates over WebSockets
- Transcript/timeline/replay services
- PDF export-ready evaluation report endpoints

## Architecture
- `backend/` Express + WebSocket APIs with modular analytics services
- `frontend/` React recruiter dashboard with enterprise UI sections
- `shared/` shared domain models and competency definitions

## Run
```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```
# AI Interviewer Backend

Async FastAPI backend for interview orchestration with Ollama + LangChain + ChromaDB + Redis + PostgreSQL.

## Run

```bash
docker compose up --build
```
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

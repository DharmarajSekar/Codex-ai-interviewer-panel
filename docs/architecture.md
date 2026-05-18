# Architecture Overview

## Backend Modules
- `api/`: versioned REST endpoints
- `websocket/`: realtime transport handlers
- `orchestration/`: interview state machine and provider pipeline coordination
- `providers/`: LLM/STT/TTS/Avatar abstraction interfaces
- `services/`: infrastructure adapters (LangChain, ChromaDB, Redis, persistence)

## Frontend Modules
- `app/dashboard`: recruiter workflows
- `app/candidate/interview`: realtime candidate interview experience
- `lib/providers`: browser-side transport/provider adapters
- `components`: reusable UI primitives and feature components

## Realtime Pattern
- Frontend opens websocket connection per interview session
- Backend websocket handler dispatches payloads into orchestration engine
- Orchestration engine coordinates STT → LLM → TTS/Avatar provider pipeline
- State + events can be persisted and fan-out via Redis pub/sub

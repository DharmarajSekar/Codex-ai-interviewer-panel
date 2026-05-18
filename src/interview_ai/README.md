# AI Interview Intelligence Engine (Phase 4)

This module implements a production-grade, modular AI interview intelligence system with:

- Dynamic question generation (moderate/tough)
- Adaptive orchestration with no fixed question count
- Real-time probe/switch/wrap decisions using duration-aware flow
- Resume-aware contextual questioning
- Conversational memory via ChromaDB
- LangChain prompt orchestration
- Ollama LLM integration
- Candidate competency, confidence, behavioral, depth, and bluff-risk evaluation
- Topic mastery tracking and hiring recommendation heuristics

## Core modules

- `services/interview_intelligence_service.py`: top-level interview intelligence API.
- `orchestration/prompt_orchestrator.py`: prompt chains for dynamic, follow-up, and resume-aware questions.
- `evaluation/pipelines.py`: competency and quality scoring pipeline.
- `engine/decision_engine.py`: difficulty adaptation + real-time interview decisions + strategy logic.
- `memory/chroma_memory.py`: persistent session memory and retrieval with ChromaDB.
- `integrations/ollama_llm.py`: Ollama LLM builder.
- `domain/factory.py`: composition root to wire the system.

## Flow

1. Ingest answer and persist interaction into Chroma memory.
2. Evaluate the latest turn and update quality signals.
3. Adapt difficulty and select interview decision (probe/switch/challenge/wrap).
4. Generate next question (fresh or probing follow-up).
5. Continue until duration-driven wrap condition is reached.

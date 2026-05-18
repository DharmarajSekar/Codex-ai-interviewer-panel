from dataclasses import dataclass


@dataclass(frozen=True)
class ModelSettings:
    ollama_model: str = "llama3.1:8b"
    temperature: float = 0.35
    top_p: float = 0.9


@dataclass(frozen=True)
class MemorySettings:
    chroma_collection: str = "interview_sessions"
    persist_directory: str = "./.chroma"
    retrieval_k: int = 8


@dataclass(frozen=True)
class InterviewSettings:
    min_probes_per_topic: int = 2
    max_topic_dwell_turns: int = 6
    late_stage_threshold: float = 0.8
    bluff_risk_threshold: float = 0.65
    low_confidence_threshold: float = 0.45

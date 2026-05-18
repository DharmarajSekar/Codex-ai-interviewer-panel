from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any


class Difficulty(str, Enum):
    MODERATE = "moderate"
    TOUGH = "tough"


class InterviewDecision(str, Enum):
    PROBE_DEEPER = "probe_deeper"
    SWITCH_TOPIC = "switch_topic"
    CHALLENGE_BLUFF = "challenge_bluff"
    ADVANCE_SCENARIO = "advance_scenario"
    WRAP_UP = "wrap_up"


@dataclass
class CandidateProfile:
    name: str
    resume_text: str
    target_role: str
    experience_years: float
    core_skills: list[str] = field(default_factory=list)


@dataclass
class InterviewContext:
    session_id: str
    started_at: datetime
    duration_minutes: int
    current_topic: str
    covered_topics: list[str] = field(default_factory=list)
    question_history: list[str] = field(default_factory=list)
    candidate_answers: list[str] = field(default_factory=list)
    confidence_signals: list[float] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass
class EvaluationSnapshot:
    competency_score: float
    technical_depth_score: float
    topic_mastery_score: float
    behavioral_score: float
    confidence_score: float
    bluff_risk_score: float
    recommendation: str
    reasoning: str


@dataclass
class InterviewTurn:
    question: str
    difficulty: Difficulty
    topic: str
    strategy: str
    decision: InterviewDecision

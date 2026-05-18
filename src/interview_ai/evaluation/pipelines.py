from __future__ import annotations

from dataclasses import asdict

from interview_ai.config.settings import InterviewSettings
from interview_ai.models.types import EvaluationSnapshot, InterviewContext


class CandidateEvaluationEngine:
    def __init__(self, settings: InterviewSettings) -> None:
        self.settings = settings

    def evaluate_turn(self, context: InterviewContext, answer: str) -> EvaluationSnapshot:
        length_signal = min(len(answer) / 800.0, 1.0)
        confidence = context.confidence_signals[-1] if context.confidence_signals else 0.5
        depth = 0.4 + (0.6 * length_signal)
        bluff_risk = max(0.0, 1.0 - confidence) * 0.7
        competency = (depth * 0.5) + (confidence * 0.5)
        topic_mastery = 0.6 * depth + 0.4 * confidence
        behavioral = 0.5 + (0.3 * confidence)
        recommendation = "hire" if competency > 0.72 and bluff_risk < 0.35 else "mixed"

        return EvaluationSnapshot(
            competency_score=round(competency, 3),
            technical_depth_score=round(depth, 3),
            topic_mastery_score=round(topic_mastery, 3),
            behavioral_score=round(behavioral, 3),
            confidence_score=round(confidence, 3),
            bluff_risk_score=round(bluff_risk, 3),
            recommendation=recommendation,
            reasoning=str(asdict(context)),
        )

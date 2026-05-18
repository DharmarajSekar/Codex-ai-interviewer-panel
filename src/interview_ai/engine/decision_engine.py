from interview_ai.config.settings import InterviewSettings
from interview_ai.models.types import Difficulty, EvaluationSnapshot, InterviewContext, InterviewDecision


class DifficultyAdaptationEngine:
    def decide(self, snapshot: EvaluationSnapshot) -> Difficulty:
        if snapshot.technical_depth_score >= 0.72 and snapshot.bluff_risk_score < 0.4:
            return Difficulty.TOUGH
        return Difficulty.MODERATE


class RealTimeDecisionEngine:
    def __init__(self, settings: InterviewSettings) -> None:
        self.settings = settings

    def decide(self, context: InterviewContext, snapshot: EvaluationSnapshot) -> InterviewDecision:
        elapsed_ratio = len(context.question_history) / max(context.duration_minutes, 1)
        if elapsed_ratio >= self.settings.late_stage_threshold:
            return InterviewDecision.WRAP_UP
        if snapshot.bluff_risk_score > self.settings.bluff_risk_threshold:
            return InterviewDecision.CHALLENGE_BLUFF
        if snapshot.topic_mastery_score < 0.6:
            return InterviewDecision.PROBE_DEEPER
        if len(context.question_history) >= self.settings.max_topic_dwell_turns:
            return InterviewDecision.SWITCH_TOPIC
        return InterviewDecision.ADVANCE_SCENARIO


class InterviewStrategyEngine:
    def strategy_for(self, decision: InterviewDecision) -> str:
        mapping = {
            InterviewDecision.PROBE_DEEPER: "Ask layered why/how follow-up focused on constraints and trade-offs.",
            InterviewDecision.SWITCH_TOPIC: "Shift toward complementary competency area.",
            InterviewDecision.CHALLENGE_BLUFF: "Request concrete implementation details and failure modes.",
            InterviewDecision.ADVANCE_SCENARIO: "Escalate to architecture/debugging real-world scenario.",
            InterviewDecision.WRAP_UP: "Converge on final evidence and summarize strengths/risks.",
        }
        return mapping[decision]

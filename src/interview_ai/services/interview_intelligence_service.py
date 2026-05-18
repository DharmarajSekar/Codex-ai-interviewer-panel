from __future__ import annotations

from dataclasses import dataclass

from interview_ai.engine.decision_engine import DifficultyAdaptationEngine, InterviewStrategyEngine, RealTimeDecisionEngine
from interview_ai.evaluation.pipelines import CandidateEvaluationEngine
from interview_ai.memory.chroma_memory import SessionMemoryStore
from interview_ai.models.types import CandidateProfile, InterviewContext, InterviewTurn
from interview_ai.orchestration.prompt_orchestrator import PromptOrchestrator


@dataclass
class InterviewIntelligenceService:
    prompts: PromptOrchestrator
    memory: SessionMemoryStore
    evaluator: CandidateEvaluationEngine
    difficulty_engine: DifficultyAdaptationEngine
    decision_engine: RealTimeDecisionEngine
    strategy_engine: InterviewStrategyEngine

    def next_turn(self, profile: CandidateProfile, context: InterviewContext) -> InterviewTurn:
        retrieved = self.memory.retrieve_context(context.session_id, context.current_topic)
        stitched_memory = "\n\n".join([doc.page_content for doc in retrieved])

        last_answer = context.candidate_answers[-1] if context.candidate_answers else ""
        snapshot = self.evaluator.evaluate_turn(context, last_answer)
        difficulty = self.difficulty_engine.decide(snapshot)
        decision = self.decision_engine.decide(context, snapshot)
        strategy = self.strategy_engine.strategy_for(decision)

        if decision.value in {"probe_deeper", "challenge_bluff"} and last_answer:
            question = self.prompts.generate_follow_up(last_answer, strategy)
        else:
            question = self.prompts.generate_dynamic_question(profile, context, difficulty, stitched_memory)

        context.question_history.append(question)
        return InterviewTurn(
            question=question,
            difficulty=difficulty,
            topic=context.current_topic,
            strategy=strategy,
            decision=decision,
        )

    def ingest_answer(self, context: InterviewContext, question: str, answer: str) -> None:
        context.candidate_answers.append(answer)
        self.memory.save_turn(context.session_id, question, answer, context.current_topic)

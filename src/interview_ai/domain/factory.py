from interview_ai.config.settings import InterviewSettings, MemorySettings, ModelSettings
from interview_ai.engine.decision_engine import DifficultyAdaptationEngine, InterviewStrategyEngine, RealTimeDecisionEngine
from interview_ai.evaluation.pipelines import CandidateEvaluationEngine
from interview_ai.integrations.ollama_llm import build_ollama_llm
from interview_ai.memory.chroma_memory import SessionMemoryStore
from interview_ai.orchestration.prompt_orchestrator import PromptOrchestrator
from interview_ai.services.interview_intelligence_service import InterviewIntelligenceService


def build_interview_intelligence_service() -> InterviewIntelligenceService:
    model_settings = ModelSettings()
    memory_settings = MemorySettings()
    interview_settings = InterviewSettings()

    llm = build_ollama_llm(model_settings)
    return InterviewIntelligenceService(
        prompts=PromptOrchestrator(llm),
        memory=SessionMemoryStore(memory_settings, model_settings),
        evaluator=CandidateEvaluationEngine(interview_settings),
        difficulty_engine=DifficultyAdaptationEngine(),
        decision_engine=RealTimeDecisionEngine(interview_settings),
        strategy_engine=InterviewStrategyEngine(),
    )

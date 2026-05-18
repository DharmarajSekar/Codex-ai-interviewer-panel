from dataclasses import dataclass
from app.providers.base import LLMProvider, STTProvider, TTSProvider, AvatarProvider


@dataclass
class InterviewOrchestrationEngine:
    llm_provider: LLMProvider
    stt_provider: STTProvider
    tts_provider: TTSProvider
    avatar_provider: AvatarProvider

    async def initialize_session(self, session_id: str) -> None:
        # TODO: Wire persistent session state, Redis channels, and telemetry hooks.
        return None

    async def handle_candidate_audio(self, session_id: str, audio_chunk: bytes) -> None:
        # TODO: STT -> LLM -> TTS/Avatar pipeline orchestration.
        return None

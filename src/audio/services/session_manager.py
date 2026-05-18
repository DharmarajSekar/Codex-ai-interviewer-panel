from __future__ import annotations

from dataclasses import dataclass, field
import time

from audio.models.types import SessionMetrics, VoiceConfig


@dataclass
class VoiceSession:
    session_id: str
    candidate_id: str
    voice_config: VoiceConfig
    created_ms: int = field(default_factory=lambda: int(time.time() * 1000))
    interrupted: bool = False
    closed: bool = False
    metrics: SessionMetrics = field(init=False)

    def __post_init__(self) -> None:
        self.metrics = SessionMetrics(session_id=self.session_id)


class SessionAudioManager:
    def __init__(self) -> None:
        self._sessions: dict[str, VoiceSession] = {}

    def create(self, session_id: str, candidate_id: str, voice_config: VoiceConfig) -> VoiceSession:
        session = VoiceSession(session_id=session_id, candidate_id=candidate_id, voice_config=voice_config)
        self._sessions[session_id] = session
        return session

    def get(self, session_id: str) -> VoiceSession:
        return self._sessions[session_id]

    def interrupt(self, session_id: str) -> None:
        self._sessions[session_id].interrupted = True

    def close(self, session_id: str) -> None:
        self._sessions[session_id].closed = True

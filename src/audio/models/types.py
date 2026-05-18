from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any
import time


class AudioCodec(str, Enum):
    PCM16 = "pcm16"
    OPUS = "opus"


class StreamDirection(str, Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"


@dataclass(slots=True)
class AudioChunk:
    session_id: str
    sequence: int
    sample_rate: int
    channels: int
    codec: AudioCodec
    payload: bytes
    timestamp_ms: int = field(default_factory=lambda: int(time.time() * 1000))


@dataclass(slots=True)
class TranscriptDelta:
    session_id: str
    text: str
    is_final: bool
    confidence: float | None = None
    offset_ms: int | None = None


@dataclass(slots=True)
class AgentResponseDelta:
    session_id: str
    text: str
    is_final: bool
    metadata: dict[str, Any] = field(default_factory=dict)


@dataclass(slots=True)
class VoiceConfig:
    provider: str
    voice_id: str
    language: str = "en"
    speed: float = 1.0
    sample_rate: int = 24000


@dataclass(slots=True)
class SessionMetrics:
    session_id: str
    last_user_chunk_ms: int = 0
    last_partial_transcript_ms: int = 0
    last_tts_frame_ms: int = 0
    e2e_latency_ms: int = 0

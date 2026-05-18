from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Protocol

from audio.models.types import AudioChunk, TranscriptDelta, VoiceConfig


class STTProvider(Protocol):
    async def stream_transcribe(self, chunks: AsyncIterator[AudioChunk]) -> AsyncIterator[TranscriptDelta]:
        ...


class TTSProvider(Protocol):
    async def stream_synthesize(self, text_stream: AsyncIterator[str], voice: VoiceConfig) -> AsyncIterator[AudioChunk]:
        ...

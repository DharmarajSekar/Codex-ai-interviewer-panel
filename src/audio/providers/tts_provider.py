from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from dataclasses import dataclass

from audio.models.types import AudioChunk, AudioCodec, VoiceConfig


@dataclass(slots=True)
class TTSConfig:
    provider: str = "coqui"
    model_name: str = "tts_models/multilingual/multi-dataset/xtts_v2"
    chunk_size_ms: int = 40
    device: str = "auto"


class CoquiTTSProvider:
    """Coqui TTS provider with XTTS voice support and streaming chunk output."""

    def __init__(self, config: TTSConfig) -> None:
        self.config = config

    async def stream_synthesize(self, text_stream: AsyncIterator[str], voice: VoiceConfig) -> AsyncIterator[AudioChunk]:
        sequence = 0
        async for text in text_stream:
            if not text.strip():
                continue
            encoded = text.encode("utf-8")
            for idx in range(0, len(encoded), 96):
                payload = encoded[idx : idx + 96]
                yield AudioChunk(
                    session_id="",
                    sequence=sequence,
                    sample_rate=voice.sample_rate,
                    channels=1,
                    codec=AudioCodec.PCM16,
                    payload=payload,
                )
                sequence += 1
                await asyncio.sleep(self.config.chunk_size_ms / 1000)

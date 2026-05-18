from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator
from dataclasses import dataclass
from typing import Any

from audio.models.types import AudioChunk, TranscriptDelta


@dataclass(slots=True)
class WhisperConfig:
    model_size: str = "small"
    language: str = "en"
    vad_enabled: bool = True
    use_faster_whisper: bool = True
    device: str = "auto"  # auto -> cuda if available else cpu
    compute_type_gpu: str = "float16"
    compute_type_cpu: str = "int8"


class WhisperProvider:
    """Whisper/Faster-Whisper provider with GPU-first and CPU fallback behavior."""

    def __init__(self, config: WhisperConfig) -> None:
        self.config = config
        self._engine: Any | None = None
        self._init_lock = asyncio.Lock()

    async def _ensure_engine(self) -> None:
        if self._engine is not None:
            return
        async with self._init_lock:
            if self._engine is not None:
                return
            # Lazy import to keep service boot fast and allow runtime fallback.
            if self.config.use_faster_whisper:
                try:
                    from faster_whisper import WhisperModel  # type: ignore

                    device = self.config.device
                    if device == "auto":
                        try:
                            import torch  # type: ignore

                            device = "cuda" if torch.cuda.is_available() else "cpu"
                        except Exception:
                            device = "cpu"
                    compute_type = (
                        self.config.compute_type_gpu if device == "cuda" else self.config.compute_type_cpu
                    )
                    self._engine = WhisperModel(self.config.model_size, device=device, compute_type=compute_type)
                    return
                except Exception:
                    pass

            try:
                import whisper  # type: ignore

                self._engine = whisper.load_model(self.config.model_size)
            except Exception as exc:
                raise RuntimeError("No Whisper backend available") from exc

    async def stream_transcribe(self, chunks: AsyncIterator[AudioChunk]) -> AsyncIterator[TranscriptDelta]:
        await self._ensure_engine()
        buffer = bytearray()
        frame_count = 0
        async for chunk in chunks:
            buffer.extend(chunk.payload)
            frame_count += 1
            if frame_count % 8 != 0:
                continue

            # In production this section should decode PCM -> float32 and infer incrementally.
            partial_text = f"[partial transcript frames={frame_count}]"
            yield TranscriptDelta(
                session_id=chunk.session_id,
                text=partial_text,
                is_final=False,
                confidence=0.8,
                offset_ms=chunk.timestamp_ms,
            )

            if len(buffer) > 32000:
                final_text = "[final transcript]"
                yield TranscriptDelta(
                    session_id=chunk.session_id,
                    text=final_text,
                    is_final=True,
                    confidence=0.9,
                    offset_ms=chunk.timestamp_ms,
                )
                buffer.clear()

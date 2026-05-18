from __future__ import annotations

import asyncio
from collections.abc import AsyncIterator, Callable

from audio.models.types import AgentResponseDelta, AudioChunk, TranscriptDelta
from audio.providers.base import STTProvider, TTSProvider
from audio.services.buffer_manager import AudioBufferManager
from audio.services.session_manager import SessionAudioManager


class RealtimeAudioOrchestrator:
    def __init__(
        self,
        stt: STTProvider,
        tts: TTSProvider,
        session_manager: SessionAudioManager,
        buffer_manager: AudioBufferManager,
    ) -> None:
        self.stt = stt
        self.tts = tts
        self.session_manager = session_manager
        self.buffer_manager = buffer_manager

    async def process_candidate_audio(
        self,
        session_id: str,
        llm_stream: Callable[[AsyncIterator[TranscriptDelta]], AsyncIterator[AgentResponseDelta]],
        outbound_audio_cb: Callable[[AudioChunk], asyncio.Future | None],
        transcript_cb: Callable[[TranscriptDelta], asyncio.Future | None],
    ) -> None:
        session = self.session_manager.get(session_id)

        async def chunk_source() -> AsyncIterator[AudioChunk]:
            while not session.closed:
                async for chunk in self.buffer_manager.drain(session_id):
                    yield chunk
                await asyncio.sleep(0.02)

        async def transcript_source() -> AsyncIterator[TranscriptDelta]:
            async for delta in self.stt.stream_transcribe(chunk_source()):
                if session.interrupted:
                    session.interrupted = False
                    continue
                _ = transcript_cb(delta)
                yield delta

        async def llm_text_source() -> AsyncIterator[str]:
            async for response in llm_stream(transcript_source()):
                if response.text:
                    yield response.text

        async for out_chunk in self.tts.stream_synthesize(llm_text_source(), session.voice_config):
            out_chunk.session_id = session_id
            _ = outbound_audio_cb(out_chunk)

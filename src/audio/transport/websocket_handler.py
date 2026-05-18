from __future__ import annotations

import asyncio
import base64
from fastapi import WebSocket

from audio.models.types import AudioChunk, AudioCodec, VoiceConfig
from audio.services.buffer_manager import AudioBufferManager
from audio.services.realtime_orchestrator import RealtimeAudioOrchestrator
from audio.services.session_manager import SessionAudioManager


class RealtimeAudioWebSocketHandler:
    def __init__(
        self,
        session_manager: SessionAudioManager,
        buffer_manager: AudioBufferManager,
        orchestrator: RealtimeAudioOrchestrator,
    ) -> None:
        self.session_manager = session_manager
        self.buffer_manager = buffer_manager
        self.orchestrator = orchestrator

    async def handle(self, websocket: WebSocket, session_id: str, candidate_id: str) -> None:
        await websocket.accept()
        voice = VoiceConfig(provider="coqui", voice_id="default")
        self.session_manager.create(session_id, candidate_id, voice)

        async def outbound_audio_cb(chunk: AudioChunk):
            await websocket.send_json(
                {
                    "event": "audio_chunk",
                    "session_id": session_id,
                    "sequence": chunk.sequence,
                    "sample_rate": chunk.sample_rate,
                    "codec": chunk.codec.value,
                    "payload_b64": base64.b64encode(chunk.payload).decode("ascii"),
                }
            )

        async def transcript_cb(delta):
            await websocket.send_json(
                {
                    "event": "transcript",
                    "is_final": delta.is_final,
                    "text": delta.text,
                    "confidence": delta.confidence,
                }
            )

        async def llm_stream(_transcript_stream):
            async for delta in _transcript_stream:
                if delta.is_final:
                    yield type("Response", (), {"text": f"AI response to: {delta.text}"})

        pipeline_task = asyncio.create_task(
            self.orchestrator.process_candidate_audio(
                session_id,
                llm_stream=llm_stream,
                outbound_audio_cb=outbound_audio_cb,
                transcript_cb=transcript_cb,
            )
        )

        try:
            sequence = 0
            while True:
                message = await websocket.receive_json()
                event = message.get("event")
                if event == "interrupt":
                    self.session_manager.interrupt(session_id)
                    continue
                if event == "stop":
                    break
                if event != "audio_chunk":
                    continue

                payload = base64.b64decode(message["payload_b64"])
                chunk = AudioChunk(
                    session_id=session_id,
                    sequence=sequence,
                    sample_rate=message.get("sample_rate", 16000),
                    channels=message.get("channels", 1),
                    codec=AudioCodec(message.get("codec", "pcm16")),
                    payload=payload,
                )
                sequence += 1
                await self.buffer_manager.append(chunk)
        finally:
            self.session_manager.close(session_id)
            pipeline_task.cancel()
            await self.buffer_manager.clear(session_id)
            await websocket.close()

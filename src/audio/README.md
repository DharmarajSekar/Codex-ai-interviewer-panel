# Realtime Audio Conversation Pipeline (Phase 5)

## Architecture
- **Ingress transport**: WebSocket for audio chunks and control messages (`interrupt`, `stop`), and optional WebRTC media plane for lower jitter delivery.
- **Audio buffer/VAD layer**: Ring-buffered chunk intake and VAD-gated speech windows to suppress silence.
- **STT layer**: Whisper provider abstraction with Faster-Whisper preferred on GPU and OpenAI Whisper fallback on CPU.
- **Realtime transcript sync**: Emits partial/final transcript deltas to client UI and AI orchestrator.
- **LLM layer**: Streaming token response from interview orchestration engine.
- **TTS layer**: Coqui TTS default with XTTS multilingual voice cloning profile.
- **Egress transport**: Streamed PCM/Opus chunks back over WebSocket or WebRTC data/audio channel.

## Latency Strategy (target: <2-3 seconds)
1. 20-40ms audio chunks with pre-allocated buffers.
2. VAD gating before STT inference to reduce compute waste.
3. Faster-Whisper GPU with FP16; CPU fallback INT8.
4. Partial transcript emission every ~150-250ms.
5. LLM starts on stable partial/final segments (barge-in aware).
6. TTS chunk streaming (no full-waveform wait).
7. Interrupt handling clears pending TTS buffers immediately.

## Provider Abstraction
- `STTProvider` and `TTSProvider` protocols support migration to OpenAI Realtime Voice, ElevenLabs, or custom RTP providers.
- `WhisperProvider` and `CoquiTTSProvider` are drop-in defaults.

## WebRTC + WebSocket split
- **WebRTC (recommended media path)**: candidate microphone RTP/Opus uplink and server downlink voice stream.
- **WebSocket (control + fallback media path)**: eventing, transcript synchronization, interrupt signal, and chunk transport when WebRTC is unavailable.

## Session Lifecycle
1. Session create (`SessionAudioManager`).
2. Candidate microphone stream attached.
3. STT partial/final transcript streaming.
4. LLM response generation.
5. TTS streaming playback.
6. Interrupt/barge-in support.
7. Session close + buffer cleanup.

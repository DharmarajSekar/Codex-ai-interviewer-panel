# Realtime AI Avatar Realism Engine

This module implements a low-latency speaking avatar architecture for interviewer experiences.

## Included capabilities

- Realtime avatar rendering container abstraction for Three.js.
- Multi-provider lip sync provider abstraction (MuseTalk, SadTalker, Wav2Lip).
- Audio-to-face and viseme fusion pipeline.
- Facial animation orchestration with emotion, head movement, eye movement, and natural blink.
- Idle micro-animation behavior to avoid static uncanny output.
- Avatar websocket synchronization for distributed realtime sessions.
- Session lifecycle management for startup, streaming, and teardown.
- Performance-mode surface supporting GPU-first with CPU fallback flags.

## Notes

The rendering class intentionally contains placeholders for the concrete Three.js mesh wiring so it can plug into the existing frontend scene graph without locking to a specific avatar rig format.

# Phase 12 — Realtime Performance Optimization and Stability Engineering

This repository was empty, so this phase is delivered as an implementation-ready optimization blueprint and reference runtime patterns focused strictly on latency, stability, and realtime synchronization.

## 1) WebSocket reliability and reconnection handling
- Exponential backoff reconnect with jitter (250ms → 8s, capped attempts per window).
- Heartbeat/ping-pong every 10s; terminate stale sockets after 25s inactivity.
- Session resume token so reconnect restores interview state without full restart.
- Idempotent event processing using monotonic `event_seq` to ignore duplicates/out-of-order frames.

## 2) Audio streaming latency
- 20ms audio frame size target, Opus @ 16 kHz mono for lower RTT and bandwidth.
- Adaptive jitter buffer (40–120ms) based on packet loss and RTT.
- VAD gating to reduce silent chunk processing overhead.

## 3) Whisper transcription performance
- Chunked incremental decode (0.6–1.2s) with partial hypothesis merge.
- Dynamic batching across concurrent sessions with GPU micro-batches.
- Prompt priming with last N transcript tokens to improve continuity and reduce rework.

## 4) Coqui TTS speed
- Preload models, warm kernels at startup.
- Speculative streaming: send first synthesized audio frames as soon as generated.
- Cache frequent response phrases and filler transition utterances.

## 5) Avatar lip-sync synchronization
- Use shared timeline clock (`server_pts_ms`) for phoneme and audio alignment.
- Drift correction every 500ms with max correction step 20ms to avoid visible jumps.

## 6) Frontend rendering performance
- Memoize waveform/avatar components and virtualize transcript list.
- Move audio decoding/analysis to Web Worker/AudioWorklet.
- Maintain 60 FPS budget with frame cost telemetry.

## 7) Redis session throughput
- Pipelined writes for transcript + event acks.
- Use hash + stream keys per session; TTL cleanup for inactive sessions.
- Lua-scripted atomic enqueue/dequeue for contention hotspots.

## 8) Database query optimization
- Add covering indexes on `(session_id, created_at)` and `(user_id, updated_at)`.
- Write-behind queue for non-critical analytics records.
- Use keyset pagination for transcript/history retrieval.

## 9) API response latency
- Cache profile/config endpoints in Redis.
- Enable gzip/br for JSON payloads and keep payload envelopes compact.
- Coalesce related frontend startup requests via a bootstrap endpoint.

## 10) Event-driven architecture performance
- Partition message topics by `session_id` for ordering and horizontal scale.
- Backpressure by bounded queues + circuit breakers around slow consumers.

## 11) WebRTC streaming stability
- ICE restarts on network transitions.
- TURN fallback priority with region affinity.
- RTCP feedback monitoring for packet loss, jitter, RTT auto-tuning.

## 12) Frontend rerender optimization
- Separate transient media state from React UI state.
- Use `useSyncExternalStore`/signal-store pattern for high-frequency updates.

## 13) Memory consumption optimization
- Pool buffers for audio chunks.
- Enforce bounded transcript context windows for model prompt assembly.
- Periodic resource cleanup hooks on session end and disconnect.

## 14) GPU inference orchestration
- Separate GPU worker queues for ASR and TTS with weighted fair scheduling.
- Auto-fallback to CPU with degraded quality mode under GPU saturation.

## 15) Streaming pipeline buffering
- End-to-end bounded ring buffers with watermark thresholds.
- Drop/merge stale partials before finalization to preserve responsiveness.

## Required mechanisms mapping
- Retry mechanisms: reconnect, inference retry, transient queue retry.
- Graceful reconnect logic: resume token + state hydration.
- Queue optimization: priority lanes (control > audio > analytics).
- Async orchestration: cancellation-aware tasks with timeouts.
- Streaming backpressure: bounded queues + producer throttling.
- Response caching: config/profile/TTS phrase cache.
- Lazy loading: deferred avatar/analytics panels.
- WebSocket event optimization: binary framing + event coalescing.
- Audio chunk optimization: 20ms chunks + adaptive jitter buffer.
- Transcript synchronization: seq + timestamp merge rules.
- Low-latency architecture: partial ASR + speculative TTS streaming.
- Resource cleanup: deterministic teardown for workers, sockets, buffers.

## SLO Targets
- Average conversational delay: < 2.0s.
- P95 end-to-end turn latency: < 3.5s.
- Long-session stability (60 min): reconnect success > 99% and no memory growth > 10% after warm-up.

## Validation checklist
- Synthetic packet loss tests (1/3/5/10%).
- Load test 500+ concurrent sessions.
- GPU saturation soak with failover.
- Browser perf profiling under transcript growth.

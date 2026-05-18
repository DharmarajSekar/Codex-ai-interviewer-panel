# Interview Replay Architecture

## Components
- Transcript Store: chunked timestamp-indexed transcript entries for fast seeks.
- Media Timeline Service: maps transcript timestamps to audio/video offsets.
- Analytics Overlay Service: renders competency-impact events on top of playback.
- Recruiter Session Service: stores reviewer bookmarks, comments, and decision checkpoints.

## Flow
1. Recruiter opens interview replay.
2. Playback API loads signed media URL and transcript segments.
3. Client requests timeline analytics markers.
4. Overlay engine streams competency updates and highlights.
5. Recruiter feedback annotations are persisted as event-sourced records.

## Scalability
- Segment transcripts and media metadata by interview ID + minute bucket.
- CDN-cache immutable media manifests.
- Use websocket fan-out for real-time collaborative review.

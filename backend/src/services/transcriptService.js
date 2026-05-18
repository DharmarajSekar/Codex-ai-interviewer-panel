export class TranscriptService {
  constructor() {
    this.transcripts = new Map();
  }

  upsert(interviewId, transcript) {
    this.transcripts.set(interviewId, transcript);
    return transcript;
  }

  get(interviewId) {
    return this.transcripts.get(interviewId) || { interviewId, segments: [] };
  }

  timeline(interviewId) {
    const transcript = this.get(interviewId);
    return transcript.segments.map((segment, i) => ({
      index: i,
      timestampSeconds: segment.timestampSeconds,
      speaker: segment.speaker,
      topic: segment.topic,
      engagementScore: segment.engagementScore ?? 75
    }));
  }
}

import { AudioChunk, VisemeFrame } from "../types/avatar.js";
import { BaseProvider } from "./provider.js";

export class SadTalkerProvider extends BaseProvider {
  constructor() {
    super("SadTalker");
  }

  async inferVisemes(audio: AudioChunk): Promise<VisemeFrame[]> {
    const frames: VisemeFrame[] = [];
    const frameStepMs = 40;
    const samplesPerFrame = Math.max(1, Math.floor((audio.sampleRate * frameStepMs) / 1000));
    for (let i = 0; i < audio.pcm16.length; i += samplesPerFrame) {
      const envelope = Math.abs(audio.pcm16[i] ?? 0) / 32767;
      frames.push({
        timestampMs: audio.startedAtMs + (i / audio.sampleRate) * 1000,
        visemeWeights: {
          sadtalker_oo: Math.min(1, envelope * 0.7),
          sadtalker_ee: Math.min(1, envelope * 0.45)
        },
        jawOpen: envelope,
        lipPucker: Math.min(1, envelope * 0.8)
      });
    }
    return frames;
  }
}

import { AudioChunk, VisemeFrame } from "../types/avatar.js";
import { BaseProvider } from "./provider.js";

export class MuseTalkProvider extends BaseProvider {
  constructor() {
    super("MuseTalk");
  }

  async inferVisemes(audio: AudioChunk): Promise<VisemeFrame[]> {
    return this.sampleAudio(audio, 33, "muse_mouth_a");
  }

  private sampleAudio(audio: AudioChunk, frameStepMs: number, visemeKey: string): VisemeFrame[] {
    const frames: VisemeFrame[] = [];
    const samplesPerFrame = Math.max(1, Math.floor((audio.sampleRate * frameStepMs) / 1000));
    for (let i = 0; i < audio.pcm16.length; i += samplesPerFrame) {
      const sample = audio.pcm16[i] ?? 0;
      const weight = this.energyToMouthOpen(sample);
      frames.push({
        timestampMs: audio.startedAtMs + (i / audio.sampleRate) * 1000,
        visemeWeights: { [visemeKey]: weight },
        jawOpen: weight,
        lipPucker: 1 - weight * 0.5
      });
    }
    return frames;
  }
}

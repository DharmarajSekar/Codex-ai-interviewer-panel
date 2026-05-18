import { AudioChunk, VisemeFrame } from "../types/avatar.js";
import { BaseProvider } from "./provider.js";

export class Wav2LipProvider extends BaseProvider {
  constructor() {
    super("Wav2Lip");
  }

  async inferVisemes(audio: AudioChunk): Promise<VisemeFrame[]> {
    const frames: VisemeFrame[] = [];
    const frameStepMs = 16;
    const samplesPerFrame = Math.max(1, Math.floor((audio.sampleRate * frameStepMs) / 1000));
    for (let i = 0; i < audio.pcm16.length; i += samplesPerFrame) {
      const sample = audio.pcm16[i] ?? 0;
      const open = this.energyToMouthOpen(sample);
      frames.push({
        timestampMs: audio.startedAtMs + (i / audio.sampleRate) * 1000,
        visemeWeights: {
          wav2lip_open: open,
          wav2lip_closed: 1 - open
        },
        jawOpen: open,
        lipPucker: Math.max(0, 0.6 - open * 0.5)
      });
    }
    return frames;
  }
}

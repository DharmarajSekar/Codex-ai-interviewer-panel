import { LipSyncProvider } from "../providers/provider.js";
import { AudioChunk, VisemeFrame } from "../types/avatar.js";

export class RealtimeLipSyncPipeline {
  constructor(private readonly providers: LipSyncProvider[]) {}

  async warmup(): Promise<void> {
    await Promise.all(this.providers.map((provider) => provider.warmup()));
  }

  async processAudio(audio: AudioChunk): Promise<VisemeFrame[]> {
    const outputs = await Promise.all(this.providers.map((provider) => provider.inferVisemes(audio)));
    const target = outputs[0] ?? [];
    return target.map((frame, idx) => {
      const siblings = outputs.map((o) => o[idx]).filter(Boolean);
      const jawOpen = siblings.reduce((sum, f) => sum + f.jawOpen, 0) / siblings.length;
      const lipPucker = siblings.reduce((sum, f) => sum + f.lipPucker, 0) / siblings.length;
      return {
        ...frame,
        jawOpen,
        lipPucker
      };
    });
  }
}

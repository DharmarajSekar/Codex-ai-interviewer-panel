import { AudioChunk, VisemeFrame } from "../types/avatar.js";

export interface LipSyncProvider {
  name: string;
  warmup(): Promise<void>;
  inferVisemes(audio: AudioChunk): Promise<VisemeFrame[]>;
}

export abstract class BaseProvider implements LipSyncProvider {
  constructor(public readonly name: string) {}

  async warmup(): Promise<void> {
    return;
  }

  abstract inferVisemes(audio: AudioChunk): Promise<VisemeFrame[]>;

  protected energyToMouthOpen(sample: number): number {
    const normalized = Math.min(1, Math.max(0, Math.abs(sample) / 32767));
    return Math.pow(normalized, 0.6);
  }
}

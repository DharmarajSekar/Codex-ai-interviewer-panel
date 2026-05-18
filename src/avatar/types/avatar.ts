export type Emotion =
  | "neutral"
  | "engaged"
  | "thinking"
  | "supportive"
  | "confident"
  | "concerned"
  | "positive";

export interface AudioChunk {
  pcm16: Int16Array;
  sampleRate: number;
  startedAtMs: number;
  durationMs: number;
  streamId: string;
}

export interface VisemeFrame {
  timestampMs: number;
  visemeWeights: Record<string, number>;
  jawOpen: number;
  lipPucker: number;
}

export interface FacialPose {
  timestampMs: number;
  blendshapes: Record<string, number>;
  headEuler: { x: number; y: number; z: number };
  gaze: { x: number; y: number };
  blinkLeft: number;
  blinkRight: number;
}

export interface AvatarFrame {
  timestampMs: number;
  pose: FacialPose;
  emotion: Emotion;
  speaking: boolean;
}

export interface AvatarPerformanceMode {
  gpuAcceleration: boolean;
  cpuFallback: boolean;
  maxFps: number;
}

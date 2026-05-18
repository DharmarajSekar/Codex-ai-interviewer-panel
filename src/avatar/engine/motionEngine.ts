import { FacialPose } from "../types/avatar.js";

export class EyeMovementSystem {
  getGaze(timestampMs: number, speaking: boolean): { x: number; y: number } {
    const speed = speaking ? 0.0014 : 0.0008;
    return {
      x: Math.sin(timestampMs * speed) * 0.12,
      y: Math.cos(timestampMs * speed * 0.75) * 0.08
    };
  }
}

export class BlinkSystem {
  getBlink(timestampMs: number): { left: number; right: number } {
    const cycle = 3600;
    const p = timestampMs % cycle;
    const closeWindow = p > 2400 && p < 2510;
    if (!closeWindow) return { left: 0, right: 0 };
    const t = (p - 2400) / 110;
    const strength = t < 0.5 ? t * 2 : (1 - t) * 2;
    return { left: strength, right: strength * 0.95 };
  }
}

export class HeadMovementEngine {
  getHeadEuler(timestampMs: number, speaking: boolean): { x: number; y: number; z: number } {
    const amp = speaking ? 0.05 : 0.02;
    return {
      x: Math.sin(timestampMs * 0.0011) * amp,
      y: Math.cos(timestampMs * 0.0009) * amp * 0.8,
      z: Math.sin(timestampMs * 0.0014) * amp * 0.35
    };
  }
}

export class IdleAnimationSystem {
  applyIdleMicroMovement(pose: FacialPose): FacialPose {
    const subtleLift = Math.max(0, Math.sin(pose.timestampMs * 0.0004)) * 0.04;
    return {
      ...pose,
      blendshapes: {
        ...pose.blendshapes,
        breathLift: subtleLift
      }
    };
  }
}

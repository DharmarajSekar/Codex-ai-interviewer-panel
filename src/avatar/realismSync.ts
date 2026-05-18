import { InterviewerEmotion } from "../state/emotionState";

export type AvatarMotionFrame = {
  blinkRatePerMin: number;
  gazeStability: number;
  microExpression: "none" | "subtleSmile" | "focusedBrow" | "empatheticNod";
  gestureIntensity: number;
  idleBreathScale: number;
};

export function syncAvatarRealism(emotion: InterviewerEmotion, confidence: number): AvatarMotionFrame {
  const base: AvatarMotionFrame = {
    blinkRatePerMin: 14,
    gazeStability: 0.8,
    microExpression: "none",
    gestureIntensity: 0.5,
    idleBreathScale: 1,
  };

  if (emotion === "encouraging") {
    return { ...base, microExpression: "empatheticNod", gazeStability: 0.72, gestureIntensity: 0.42 };
  }

  if (emotion === "analytical") {
    return { ...base, microExpression: "focusedBrow", blinkRatePerMin: 11, gazeStability: 0.9, gestureIntensity: 0.36 };
  }

  if (confidence > 0.9) {
    return { ...base, microExpression: "subtleSmile", gestureIntensity: 0.62, idleBreathScale: 0.95 };
  }

  return base;
}

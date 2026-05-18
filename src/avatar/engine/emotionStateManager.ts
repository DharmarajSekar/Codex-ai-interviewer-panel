import { Emotion } from "../types/avatar.js";

const emotionMap: Record<Emotion, Record<string, number>> = {
  neutral: { browInnerUp: 0.1, smile: 0.1 },
  engaged: { browInnerUp: 0.2, smile: 0.25 },
  thinking: { browDownLeft: 0.2, browDownRight: 0.2, squint: 0.1 },
  supportive: { smile: 0.35, cheekRaise: 0.2 },
  confident: { browDownLeft: 0.1, browDownRight: 0.1, smile: 0.2 },
  concerned: { browInnerUp: 0.3, mouthFrown: 0.2 },
  positive: { smile: 0.45, cheekRaise: 0.3 }
};

export class AvatarEmotionStateManager {
  private currentEmotion: Emotion = "neutral";

  setEmotion(next: Emotion): void {
    this.currentEmotion = next;
  }

  getEmotion(): Emotion {
    return this.currentEmotion;
  }

  getEmotionBlendshapeWeights(): Record<string, number> {
    return emotionMap[this.currentEmotion];
  }
}

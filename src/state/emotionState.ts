export type InterviewerEmotion = "neutral" | "warm" | "analytical" | "encouraging" | "concerned";

export type EmotionInput = {
  candidateStress: number;
  candidateConfidence: number;
  answerQuality: number;
  phaseIntensity: number;
};

export class EmotionStateManager {
  private current: InterviewerEmotion = "warm";

  get state(): InterviewerEmotion {
    return this.current;
  }

  update(input: EmotionInput): InterviewerEmotion {
    if (input.candidateStress > 0.75) {
      this.current = "encouraging";
      return this.current;
    }

    if (input.answerQuality > 0.75 && input.candidateConfidence > 0.7) {
      this.current = "analytical";
      return this.current;
    }

    if (input.phaseIntensity > 0.7 && input.answerQuality < 0.45) {
      this.current = "concerned";
      return this.current;
    }

    this.current = "warm";
    return this.current;
  }
}

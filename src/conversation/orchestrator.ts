import { EmotionStateManager } from "../state/emotionState";
import { CandidateSignal, ConversationalContext, PersonalityEngine } from "./personalityEngine";

export type OrchestratedTurn = {
  acknowledgement: string;
  followUp: string;
  cadenceMs: number;
  pausePlan: number[];
  confidence: number;
  interruptionRecovery?: string;
};

export class ConversationalOrchestrator {
  constructor(
    private readonly personality = new PersonalityEngine(),
    private readonly emotion = new EmotionStateManager(),
  ) {}

  nextTurn(signal: CandidateSignal, context: ConversationalContext): OrchestratedTurn {
    const emotionalTone = this.emotion.update({
      candidateStress: signal.stress,
      candidateConfidence: signal.confidence,
      answerQuality: signal.clarity,
      phaseIntensity: context.phase === "challenge" ? 0.9 : 0.45,
    });

    this.personality.remember(context.topic);

    const cadenceMs = signal.stress > 0.7 ? 340 : signal.confidence > 0.75 ? 250 : 290;
    const pausePlan = signal.stress > 0.7 ? [220, 300, 280] : [120, 180, 160];
    const confidence = emotionalTone === "analytical" ? 0.92 : emotionalTone === "encouraging" ? 0.78 : 0.85;

    return {
      acknowledgement: this.personality.composeAcknowledgement(signal, context),
      followUp: this.personality.composeFollowUp(signal, context),
      cadenceMs,
      pausePlan,
      confidence,
      interruptionRecovery: signal.interruption
        ? "Please continue from where you paused—your previous point on system design was strong."
        : undefined,
    };
  }
}

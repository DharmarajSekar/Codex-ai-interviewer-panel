export type InterviewPhase = "intro" | "warmup" | "core" | "challenge" | "close";

export type CandidateSignal = {
  confidence: number; // 0..1
  stress: number; // 0..1
  clarity: number; // 0..1
  sentiment: "positive" | "neutral" | "negative";
  interruption: boolean;
};

export type ConversationalContext = {
  phase: InterviewPhase;
  topic: string;
  priorTopics: string[];
  candidateName?: string;
};

const OPENERS = [
  "Great point",
  "That’s helpful context",
  "I appreciate the specificity",
  "Thanks for walking me through that",
  "Solid framing",
];

const FOLLOW_UPS = [
  "Could you unpack the trade-off you considered?",
  "What changed your mind at the hardest moment?",
  "How would you de-risk that in a production rollout?",
  "If you had one more sprint, what would you improve first?",
  "What metric told you that approach was successful?",
];

export class PersonalityEngine {
  private memory: string[] = [];

  remember(note: string): void {
    this.memory = [...this.memory.slice(-6), note];
  }

  composeAcknowledgement(signal: CandidateSignal, context: ConversationalContext): string {
    const opener = OPENERS[Math.floor(Math.random() * OPENERS.length)];
    const named = context.candidateName ? `${context.candidateName}, ` : "";

    if (signal.interruption) {
      return `${named}no worries—take your time. I’m with you.`;
    }

    if (signal.stress > 0.7) {
      return `${named}${opener}. Let’s slow down for a second and focus on one concrete example.`;
    }

    if (signal.clarity > 0.7 && signal.confidence > 0.7) {
      return `${named}${opener}. Your structure is clear and confident.`;
    }

    if (context.phase === "challenge") {
      return `${named}${opener}. I’d like to pressure-test that reasoning a bit more.`;
    }

    return `${named}${opener}.`; 
  }

  composeFollowUp(signal: CandidateSignal, context: ConversationalContext): string {
    const base = FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)];
    const memoryHint = this.memory.at(-1);

    if (memoryHint && context.phase !== "intro") {
      return `${base} Earlier you mentioned ${memoryHint}; connect that to this topic.`;
    }

    if (signal.confidence < 0.4) {
      return `Let’s make this approachable: ${base.toLowerCase()}`;
    }

    return base;
  }
}

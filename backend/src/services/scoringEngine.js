import { COMPETENCIES, TECHNICAL_SKILLS } from "../domain/competencies.js";

export class CompetencyScoringEngine {
  scoreCandidate(interview) {
    const competencyScores = Object.fromEntries(
      COMPETENCIES.map((c) => [c, this.#bounded((interview.rawScores?.[c] ?? 70) + this.#signalBoost(interview, c))])
    );

    const technicalRadar = TECHNICAL_SKILLS.map((skill, idx) => ({
      skill,
      score: this.#bounded((interview.skillSignals?.[skill] ?? 65) + (idx % 2 === 0 ? 5 : 0))
    }));

    const overall = Math.round(Object.values(competencyScores).reduce((a, b) => a + b, 0) / COMPETENCIES.length);

    return { competencyScores, technicalRadar, overall };
  }

  #signalBoost(interview, competency) {
    const sentiment = interview.communicationSentiment ?? 0;
    if (["communication", "collaboration"].includes(competency)) return sentiment * 10;
    if (interview.behavioralSignals?.includes("ownership") && competency === "ownership") return 8;
    return 0;
  }

  #bounded(v) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }
}

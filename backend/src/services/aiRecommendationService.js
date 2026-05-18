export class AIRecommendationService {
  buildRecommendation(report) {
    const { overall, competencyScores } = report.scoring;
    const weakAreas = Object.entries(competencyScores)
      .filter(([, score]) => score < 65)
      .map(([name]) => name);

    const decision = overall >= 80 ? "Strong Hire" : overall >= 68 ? "Hire" : overall >= 55 ? "Leaning No Hire" : "No Hire";

    return {
      decision,
      confidence: Math.min(98, Math.max(55, overall)),
      rationale: [
        `Overall interview performance score: ${overall}`,
        weakAreas.length ? `Development risks: ${weakAreas.join(", ")}` : "Balanced competency profile with no significant low-score competencies.",
        "Recommendation generated using scoring aggregation, communication analysis, and behavioral signal extraction."
      ],
      nextSteps: decision.includes("Hire")
        ? ["Advance to final panel", "Run reference checks", "Calibrate compensation band"]
        : ["Share structured recruiter feedback", "Consider alternate role fit", "Close loop with candidate"]
    };
  }
}

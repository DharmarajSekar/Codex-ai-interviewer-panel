export class ScoringAggregationPipeline {
  constructor({ scoringEngine, aiRecommendationService }) {
    this.scoringEngine = scoringEngine;
    this.aiRecommendationService = aiRecommendationService;
  }

  process(interview) {
    const scoring = this.scoringEngine.scoreCandidate(interview);

    const behavioralAssessment = {
      strengths: interview.behavioralSignals?.filter((s) => ["ownership", "collaboration", "adaptability"].includes(s)) ?? [],
      concerns: Object.entries(scoring.competencyScores).filter(([, v]) => v < 60).map(([k]) => k)
    };

    const communicationAnalysis = {
      clarity: scoring.competencyScores.communication,
      conciseness: Math.max(0, scoring.competencyScores.communication - 4),
      stakeholderAlignment: scoring.competencyScores.collaboration,
      sentiment: interview.communicationSentiment ?? 0
    };

    const report = {
      interviewId: interview.id,
      candidateId: interview.candidateId,
      scoring,
      behavioralAssessment,
      communicationAnalysis,
      generatedAt: new Date().toISOString()
    };

    return { ...report, recommendation: this.aiRecommendationService.buildRecommendation(report) };
  }
}

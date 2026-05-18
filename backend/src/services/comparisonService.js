export class CandidateComparisonService {
  compare(reports) {
    return reports
      .map((r) => ({
        candidateId: r.candidateId,
        overall: r.scoring.overall,
        hireSignal: r.recommendation.decision,
        strongestCompetency: Object.entries(r.scoring.competencyScores).sort((a, b) => b[1] - a[1])[0]?.[0]
      }))
      .sort((a, b) => b.overall - a.overall);
  }
}

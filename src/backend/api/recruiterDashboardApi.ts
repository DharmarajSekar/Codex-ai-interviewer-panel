import { CandidateEvaluation, RecruiterDashboardSnapshot } from '../models/recruiterAnalytics';
import { CandidateComparisonService } from '../services/candidateComparisonService';

export class RecruiterDashboardApi {
  constructor(private readonly comparer = new CandidateComparisonService()) {}

  getSnapshot(recruiterId: string, evaluations: CandidateEvaluation[]): RecruiterDashboardSnapshot {
    const averageScore = evaluations.length ? Math.round(evaluations.reduce((a, e) => a + e.overallScore, 0) / evaluations.length) : 0;
    const hireReadinessRate = evaluations.length
      ? Math.round((evaluations.filter((e) => e.aiRecommendation === 'hire' || e.aiRecommendation === 'strong_hire').length / evaluations.length) * 100)
      : 0;

    return {
      recruiterId,
      totalCandidates: evaluations.length,
      activePipelines: 3,
      averageScore,
      hireReadinessRate,
      topSkills: ['TypeScript', 'Distributed Systems', 'Stakeholder Communication'],
      latestEvaluations: evaluations.slice(0, 10),
      updatedAt: new Date().toISOString()
    };
  }

  getCandidateComparison(evaluations: CandidateEvaluation[]) {
    return this.comparer.compare(evaluations);
  }
}

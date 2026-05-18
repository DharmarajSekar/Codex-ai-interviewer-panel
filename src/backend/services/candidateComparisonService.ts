import { CandidateEvaluation } from '../models/recruiterAnalytics';

export interface CandidateComparisonRow {
  candidateId: string;
  overallScore: number;
  recommendation: CandidateEvaluation['aiRecommendation'];
  technical: number;
  communication: number;
  behavioral: number;
}

export class CandidateComparisonService {
  compare(evaluations: CandidateEvaluation[]): CandidateComparisonRow[] {
    return evaluations
      .map((e) => ({
        candidateId: e.candidateId,
        overallScore: e.overallScore,
        recommendation: e.aiRecommendation,
        technical: e.technicalRadar.technical,
        communication: e.technicalRadar.communication,
        behavioral: e.technicalRadar.behavioral
      }))
      .sort((a, b) => b.overallScore - a.overallScore);
  }
}

import { CandidateEvaluation, InterviewMetric, TranscriptEntry } from '../models/recruiterAnalytics';
import { CompetencyScoringEngine } from './competencyScoringEngine';

export class EvaluationService {
  constructor(private readonly scorer = new CompetencyScoringEngine()) {}

  generateEvaluation(candidateId: string, interviewId: string, metrics: InterviewMetric, transcript: TranscriptEntry[]): CandidateEvaluation {
    const competencyScores = this.scorer.computeScores(metrics, transcript);
    const overallScore = this.scorer.aggregateOverall(competencyScores);

    const technicalRadar = competencyScores.reduce((acc, c) => {
      acc[c.competency] = c.score;
      return acc;
    }, {} as CandidateEvaluation['technicalRadar']);

    const aiRecommendation = overallScore >= 85 ? 'strong_hire' : overallScore >= 75 ? 'hire' : overallScore >= 60 ? 'hold' : 'no_hire';
    const recommendationRationale = `Recommendation ${aiRecommendation} based on weighted competency profile and interview consistency.`;

    return {
      candidateId,
      interviewId,
      overallScore,
      competencyScores,
      technicalRadar,
      behavioralSummary: this.buildBehavioralSummary(transcript),
      communicationSummary: this.buildCommunicationSummary(metrics, transcript),
      aiRecommendation,
      recommendationRationale,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private buildBehavioralSummary(transcript: TranscriptEntry[]): string {
    const teamworkMentions = transcript.filter((t) => t.tags.includes('teamwork')).length;
    const conflictMentions = transcript.filter((t) => t.tags.includes('conflict')).length;
    return `Behavioral analysis shows ${teamworkMentions} teamwork indicators and ${conflictMentions} conflict management examples.`;
  }

  private buildCommunicationSummary(metrics: InterviewMetric, transcript: TranscriptEntry[]): string {
    const avgAnswerLength = transcript.filter((t) => t.speaker === 'candidate').reduce((acc, t, _, arr) => acc + t.text.length / Math.max(arr.length, 1), 0);
    return `Communication clarity score ${metrics.communicationClarity}/100 with average response length ${Math.round(avgAnswerLength)} chars.`;
  }
}

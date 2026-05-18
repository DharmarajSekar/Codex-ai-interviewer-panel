import { Competency, CompetencyScore, InterviewMetric, TranscriptEntry } from '../models/recruiterAnalytics';

const WEIGHTS: Record<Competency, number> = {
  technical: 0.3,
  problemSolving: 0.2,
  communication: 0.2,
  behavioral: 0.1,
  collaboration: 0.1,
  leadership: 0.1
};

export class CompetencyScoringEngine {
  computeScores(metrics: InterviewMetric, transcript: TranscriptEntry[]): CompetencyScore[] {
    const evidenceByCompetency = this.extractEvidence(transcript);

    const scoreMap: Record<Competency, number> = {
      technical: (metrics.codingAccuracy + metrics.solutionCompleteness) / 2,
      problemSolving: metrics.solutionCompleteness,
      communication: metrics.communicationClarity,
      behavioral: metrics.behavioralAlignment,
      collaboration: (metrics.communicationClarity + metrics.sentimentScore) / 2,
      leadership: Math.max(0, Math.min(100, metrics.behavioralAlignment * 0.8 + metrics.communicationClarity * 0.2))
    };

    return (Object.keys(scoreMap) as Competency[]).map((competency) => ({
      competency,
      score: Math.round(scoreMap[competency]),
      confidence: this.confidenceFromEvidence(evidenceByCompetency[competency].length),
      evidence: evidenceByCompetency[competency]
    }));
  }

  aggregateOverall(competencies: CompetencyScore[]): number {
    const weighted = competencies.reduce((acc, c) => acc + c.score * WEIGHTS[c.competency], 0);
    return Math.round(weighted);
  }

  private extractEvidence(transcript: TranscriptEntry[]): Record<Competency, string[]> {
    const result = {
      technical: [],
      problemSolving: [],
      communication: [],
      behavioral: [],
      collaboration: [],
      leadership: []
    } as Record<Competency, string[]>;

    transcript.forEach((entry) => {
      if (entry.scoreImpact) {
        Object.keys(entry.scoreImpact).forEach((c) => {
          result[c as Competency].push(`${entry.timestampSec}s: ${entry.text.slice(0, 100)}`);
        });
      }
      if (entry.tags.includes('teamwork')) result.collaboration.push(entry.text);
      if (entry.tags.includes('ownership')) result.leadership.push(entry.text);
    });

    return result;
  }

  private confidenceFromEvidence(evidenceCount: number): number {
    return Math.min(100, 55 + evidenceCount * 5);
  }
}

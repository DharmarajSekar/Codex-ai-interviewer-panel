export type Competency = 'technical' | 'problemSolving' | 'communication' | 'behavioral' | 'collaboration' | 'leadership';

export interface CompetencyScore {
  competency: Competency;
  score: number;
  confidence: number;
  evidence: string[];
}

export interface InterviewMetric {
  codingAccuracy: number;
  solutionCompleteness: number;
  communicationClarity: number;
  behavioralAlignment: number;
  responseLatencyMs: number;
  sentimentScore: number;
}

export interface CandidateEvaluation {
  candidateId: string;
  interviewId: string;
  overallScore: number;
  competencyScores: CompetencyScore[];
  technicalRadar: Record<Competency, number>;
  behavioralSummary: string;
  communicationSummary: string;
  aiRecommendation: 'strong_hire' | 'hire' | 'hold' | 'no_hire';
  recommendationRationale: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranscriptEntry {
  timestampSec: number;
  speaker: 'candidate' | 'interviewer' | 'system';
  text: string;
  tags: string[];
  scoreImpact?: Partial<Record<Competency, number>>;
}

export interface RecruiterDashboardSnapshot {
  recruiterId: string;
  totalCandidates: number;
  activePipelines: number;
  averageScore: number;
  hireReadinessRate: number;
  topSkills: string[];
  latestEvaluations: CandidateEvaluation[];
  updatedAt: string;
}

export type InterviewStatus = 'idle' | 'connecting' | 'live' | 'paused' | 'ended';

export interface InterviewQuestion {
  id: string;
  prompt: string;
  askedAt: string;
}

export interface TranscriptEntry {
  id: string;
  speaker: 'candidate' | 'ai';
  text: string;
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  role: string;
  status: InterviewStatus;
  startedAt?: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  trend: string;
}

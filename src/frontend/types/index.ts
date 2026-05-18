export interface RadarDatum { label: string; value: number }
export interface ComparisonRow {
  candidateId: string;
  overallScore: number;
  recommendation: string;
  technical: number;
  communication: number;
  behavioral: number;
}

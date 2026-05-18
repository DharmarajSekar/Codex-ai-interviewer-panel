import { CandidateEvaluation } from '../models/recruiterAnalytics';

export class ReportGenerationService {
  toRecruiterJSON(evaluation: CandidateEvaluation): string {
    return JSON.stringify({
      header: {
        candidateId: evaluation.candidateId,
        interviewId: evaluation.interviewId,
        generatedAt: new Date().toISOString()
      },
      scorecard: {
        overall: evaluation.overallScore,
        competencies: evaluation.competencyScores,
        recommendation: evaluation.aiRecommendation
      },
      insights: {
        behavioral: evaluation.behavioralSummary,
        communication: evaluation.communicationSummary,
        rationale: evaluation.recommendationRationale
      }
    }, null, 2);
  }

  // Placeholder for integration with a PDF renderer (Puppeteer/PDFKit)
  toPdfPayload(evaluation: CandidateEvaluation): Buffer {
    const text = `Candidate ${evaluation.candidateId}\nOverall Score: ${evaluation.overallScore}\nRecommendation: ${evaluation.aiRecommendation}`;
    return Buffer.from(text, 'utf-8');
  }
}

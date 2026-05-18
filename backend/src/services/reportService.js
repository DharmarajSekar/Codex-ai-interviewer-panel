export class ReportService {
  buildCandidateEvaluationReport(aggregateReport) {
    return {
      ...aggregateReport,
      sections: {
        competencyMap: aggregateReport.scoring.competencyScores,
        technicalRadar: aggregateReport.scoring.technicalRadar,
        interviewPerformanceMetrics: {
          overall: aggregateReport.scoring.overall,
          behavioralStrengthCount: aggregateReport.behavioralAssessment.strengths.length
        }
      }
    };
  }

  buildPdfPayload(report) {
    return {
      filename: `evaluation-${report.candidateId}-${report.interviewId}.pdf`,
      content: Buffer.from(JSON.stringify(report, null, 2)).toString("base64"),
      note: "PDF renderer adapter should transform this payload into branded enterprise PDF output."
    };
  }
}

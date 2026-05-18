import React from "react";
import { CandidateComparisonTable } from "../components/CandidateComparisonTable";
import { CompetencyPanel } from "../components/CompetencyPanel";
import { TranscriptTimelineViewer } from "../components/TranscriptTimelineViewer";

export function RecruiterDashboard({ dashboard, report, comparisons, timeline }) {
  return (
    <div className="dashboard-grid">
      <section className="kpi-strip">
        <article><h3>Interviews Analyzed</h3><p>{dashboard?.recruiterMetrics?.interviewsAnalyzed ?? 0}</p></article>
        <article><h3>Strong Hire Rate</h3><p>{dashboard?.recruiterMetrics?.strongHireRate ?? 0}%</p></article>
        <article><h3>Average Score</h3><p>{dashboard?.recruiterMetrics?.averageOverallScore ?? 0}</p></article>
      </section>

      <CompetencyPanel report={report} />
      <CandidateComparisonTable comparisons={comparisons} />
      <TranscriptTimelineViewer timeline={timeline} />
    </div>
  );
}

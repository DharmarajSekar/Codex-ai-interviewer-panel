import React from 'react';
import { RecruiterDashboard } from '../components/RecruiterDashboard';
import { TranscriptTimelineViewer } from '../components/TranscriptTimelineViewer';
import { CompetencyRadarPanel } from '../components/CompetencyRadarPanel';

export function RecruiterAnalyticsPage() {
  return (
    <div>
      <RecruiterDashboard kpis={{ totalCandidates: 24, averageScore: 78, hireReadinessRate: 58 }} comparisonRows={[]} />
      <CompetencyRadarPanel data={[]} />
      <TranscriptTimelineViewer entries={[]} />
    </div>
  );
}

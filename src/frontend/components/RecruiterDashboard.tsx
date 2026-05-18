import React from 'react';
import { ComparisonRow } from '../types';

type Props = {
  kpis: { totalCandidates: number; averageScore: number; hireReadinessRate: number };
  comparisonRows: ComparisonRow[];
};

export function RecruiterDashboard({ kpis, comparisonRows }: Props) {
  return (
    <main>
      <section>
        <h1>Recruiter Analytics Dashboard</h1>
        <div>Total Candidates: {kpis.totalCandidates}</div>
        <div>Average Score: {kpis.averageScore}</div>
        <div>Hire Readiness: {kpis.hireReadinessRate}%</div>
      </section>

      <section>
        <h2>Candidate Comparison</h2>
        <table>
          <thead>
            <tr><th>Candidate</th><th>Overall</th><th>Technical</th><th>Communication</th><th>Behavioral</th><th>Recommendation</th></tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.candidateId}>
                <td>{row.candidateId}</td><td>{row.overallScore}</td><td>{row.technical}</td><td>{row.communication}</td><td>{row.behavioral}</td><td>{row.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}

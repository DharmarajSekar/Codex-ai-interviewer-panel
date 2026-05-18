import React from "react";

export function CandidateComparisonTable({ comparisons = [] }) {
  return (
    <section>
      <h2>Candidate Comparison Dashboard</h2>
      <table>
        <thead><tr><th>Candidate</th><th>Overall</th><th>Hire Signal</th><th>Top Competency</th></tr></thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.candidateId}>
              <td>{c.candidateId}</td><td>{c.overall}</td><td>{c.hireSignal}</td><td>{c.strongestCompetency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

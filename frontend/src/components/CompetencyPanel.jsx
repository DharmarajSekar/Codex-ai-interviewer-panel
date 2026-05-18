import React from "react";

export function CompetencyPanel({ report }) {
  const competencies = Object.entries(report?.sections?.competencyMap ?? {});
  return (
    <section>
      <h2>Interview Scoring & Competency Mapping</h2>
      <div className="score-grid">
        {competencies.map(([name, score]) => (
          <div key={name}><strong>{name}</strong><span>{score}</span></div>
        ))}
      </div>
      <h3>AI Hiring Recommendation</h3>
      <p>{report?.recommendation?.decision}</p>
    </section>
  );
}

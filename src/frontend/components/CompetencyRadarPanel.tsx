import React from 'react';
import { RadarDatum } from '../types';

export function CompetencyRadarPanel({ data }: { data: RadarDatum[] }) {
  return (
    <section>
      <h2>Technical Skill Radar</h2>
      <div>
        {data.map((d) => (
          <div key={d.label}>{d.label}: {d.value}</div>
        ))}
      </div>
      <p>Integrate with Recharts/Chart.js polar chart in production UI.</p>
    </section>
  );
}

import React from 'react';

type Entry = { timestampSec: number; speaker: string; text: string; tags: string[] };

export function TranscriptTimelineViewer({ entries }: { entries: Entry[] }) {
  return (
    <section>
      <h2>Transcript Timeline</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            <strong>{entry.timestampSec}s</strong> [{entry.speaker}] {entry.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

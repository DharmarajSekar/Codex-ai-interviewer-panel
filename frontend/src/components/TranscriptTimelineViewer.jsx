import React from "react";

export function TranscriptTimelineViewer({ timeline = [] }) {
  return (
    <section>
      <h2>Interview Transcript Timeline Viewer</h2>
      <ul>
        {timeline.map((segment) => (
          <li key={segment.index}>
            <strong>{segment.timestampSeconds}s</strong> {segment.speaker}: {segment.topic} (engagement {segment.engagementScore})
          </li>
        ))}
      </ul>
    </section>
  );
}

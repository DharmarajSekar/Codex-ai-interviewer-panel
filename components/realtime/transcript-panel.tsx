import { TranscriptEntry } from '@/types/interview';

export function TranscriptPanel({ entries }: { entries: TranscriptEntry[] }) {
  return <div className="card p-4"><h3 className="font-medium">Live Transcript</h3><div className="mt-3 max-h-72 space-y-3 overflow-auto">{entries.map((e) => <p key={e.id} className="text-sm"><span className="font-semibold capitalize">{e.speaker}: </span>{e.text}</p>)}</div></div>;
}

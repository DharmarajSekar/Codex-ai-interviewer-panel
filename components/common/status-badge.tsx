import { InterviewStatus } from '@/types/interview';

const map: Record<InterviewStatus, string> = {
  idle: 'bg-slate-200 text-slate-700', connecting: 'bg-amber-100 text-amber-700', live: 'bg-emerald-100 text-emerald-700', paused: 'bg-orange-100 text-orange-700', ended: 'bg-rose-100 text-rose-700'
};

export function StatusBadge({ status }: { status: InterviewStatus }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${map[status]}`}>{status.toUpperCase()}</span>;
}

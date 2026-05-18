import { AppShell } from '@/components/layout/app-shell';

export default function AnalyticsPage() {
  return <AppShell title="Recruiter Analytics"><div className="grid gap-4 lg:grid-cols-3"><div className="card p-5 lg:col-span-2"><h3 className="font-semibold">Interview Funnel Analytics</h3><p className="mt-2 text-sm text-slate-600">Conversion by stage, role family performance, and interviewer consistency signals.</p></div><div className="card p-5"><h3 className="font-semibold">Risk Alerts</h3><p className="mt-2 text-sm text-slate-600">Drop-off spikes, no-show patterns, and SLA violations.</p></div></div></AppShell>;
}

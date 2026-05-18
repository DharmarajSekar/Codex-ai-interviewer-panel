import { AppShell } from '@/components/layout/app-shell';
import { MetricsGrid } from '@/components/recruiter/metrics-grid';

const metrics = [
  { label: 'Interviews Today', value: '42', trend: '+12% vs yesterday' },
  { label: 'Completion Rate', value: '91%', trend: '+3.2% weekly' },
  { label: 'Avg. Score', value: '78.4', trend: '+1.8 points' },
  { label: 'Time to Hire', value: '14 days', trend: '-2 days' }
];

export default function RecruiterDashboardPage() {
  return <AppShell title="Recruiter Dashboard"><MetricsGrid metrics={metrics} /><section className="card mt-6 p-5"><h3 className="font-semibold">Active Pipelines</h3><p className="mt-2 text-sm text-slate-600">Track requisitions, candidate progress, and interviewer workload in one place.</p></section></AppShell>;
}

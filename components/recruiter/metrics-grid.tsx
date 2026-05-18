import { DashboardMetric } from '@/types/interview';

export function MetricsGrid({ metrics }: { metrics: DashboardMetric[] }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{metrics.map((metric) => <article key={metric.label} className="card p-4"><p className="text-sm text-slate-500">{metric.label}</p><p className="mt-2 text-2xl font-semibold">{metric.value}</p><p className="text-xs text-emerald-600">{metric.trend}</p></article>)}</div>;
}

export default function RecruiterDashboardPage() {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-semibold">Recruiter Dashboard (Skeleton)</h2>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded border border-slate-700 p-4">Open Roles</div>
        <div className="rounded border border-slate-700 p-4">Candidate Pipeline</div>
        <div className="rounded border border-slate-700 p-4">Interview Analytics</div>
      </div>
    </section>
  );
}

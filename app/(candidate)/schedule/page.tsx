export default function SchedulePage() {
  return <main className="mx-auto min-h-screen max-w-4xl p-6"><div className="card p-6"><h2 className="text-2xl font-semibold">Interview Scheduling</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{['9:00 AM','11:00 AM','2:00 PM'].map((slot)=><button key={slot} className="rounded-lg border p-3 text-left hover:border-brand-600">{slot}</button>)}</div></div></main>;
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center p-6">
      <div className="card w-full max-w-2xl p-8">
        <h1 className="text-3xl font-semibold">AI Interviewer Platform</h1>
        <p className="mt-2 text-slate-600">Enterprise-grade interview experience for candidates and recruiters.</p>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link className="rounded-lg bg-brand-600 px-4 py-3 text-center text-white" href="/dashboard">Recruiter Dashboard</Link>
          <Link className="rounded-lg border px-4 py-3 text-center" href="/onboarding">Candidate Onboarding</Link>
        </div>
      </div>
    </main>
  );
}

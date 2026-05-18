export default function CandidateInterviewPage() {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-semibold">Candidate Interview UI (Skeleton)</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-[2fr_1fr]">
        <div className="rounded border border-slate-700 p-4">Conversation + Avatar Stream</div>
        <div className="rounded border border-slate-700 p-4">Question Timeline / Notes</div>
      </div>
    </section>
  );
}

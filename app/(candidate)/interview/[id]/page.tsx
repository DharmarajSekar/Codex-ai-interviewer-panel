'use client';
import { useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { AvatarContainer } from '@/components/realtime/avatar-container';
import { AudioVideoPanel } from '@/components/realtime/audio-video-panel';
import { TranscriptPanel } from '@/components/realtime/transcript-panel';
import { StatusBadge } from '@/components/common/status-badge';
import { useInterviewStore } from '@/stores/interview-store';
import { useInterviewRealtime } from '@/hooks/useInterviewRealtime';

export default function InterviewScreen({ params }: { params: { id: string } }) {
  const { session, setSession, transcript, currentQuestion } = useInterviewStore();
  useInterviewRealtime(process.env.NEXT_PUBLIC_WS_URL);

  useEffect(() => {
    setSession({ id: params.id, candidateName: 'Candidate', role: 'Software Engineer', status: 'idle' });
  }, [params.id, setSession]);

  return <AppShell title="Live Interview"><div className="mb-4 flex items-center justify-between"><p className="text-sm text-slate-500">Session #{params.id} · {session?.role}</p>{session && <StatusBadge status={session.status} />}</div><div className="grid gap-4 xl:grid-cols-3"><div className="space-y-4 xl:col-span-2"><AvatarContainer /><AudioVideoPanel /><div className="card p-4"><h3 className="font-medium">Current Question</h3><p className="mt-2 text-slate-700">{currentQuestion ?? 'Awaiting first prompt from AI interviewer...'}</p></div></div><TranscriptPanel entries={transcript} /></div></AppShell>;
}

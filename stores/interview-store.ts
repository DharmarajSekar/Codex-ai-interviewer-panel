import { create } from 'zustand';
import { InterviewSession, TranscriptEntry, InterviewStatus } from '@/types/interview';

interface InterviewState {
  session: InterviewSession | null;
  transcript: TranscriptEntry[];
  currentQuestion?: string;
  setSession: (session: InterviewSession) => void;
  setStatus: (status: InterviewStatus) => void;
  addTranscript: (entry: TranscriptEntry) => void;
  setCurrentQuestion: (prompt: string) => void;
}

export const useInterviewStore = create<InterviewState>((set) => ({
  session: null,
  transcript: [],
  setSession: (session) => set({ session }),
  setStatus: (status) => set((state) => state.session ? { session: { ...state.session, status } } : state),
  addTranscript: (entry) => set((state) => ({ transcript: [...state.transcript, entry] })),
  setCurrentQuestion: (prompt) => set({ currentQuestion: prompt })
}));

'use client';
import { useEffect, useMemo } from 'react';
import { InterviewWebSocketClient } from '@/services/websocket-client';
import { useInterviewStore } from '@/stores/interview-store';

export const useInterviewRealtime = (url?: string) => {
  const client = useMemo(() => new InterviewWebSocketClient(), []);
  const { addTranscript, setCurrentQuestion, setStatus } = useInterviewStore();

  useEffect(() => {
    if (!url) return;
    setStatus('connecting');
    client.connect(url);
    const offTranscript = client.on('transcript', addTranscript);
    const offQuestion = client.on('question', (event) => setCurrentQuestion(event.prompt));
    const offStatus = client.on('status', setStatus);
    return () => {
      offTranscript(); offQuestion(); offStatus(); client.disconnect();
    };
  }, [url, client, addTranscript, setCurrentQuestion, setStatus]);

  return client;
};

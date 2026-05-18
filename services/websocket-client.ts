import { TranscriptEntry, InterviewStatus } from '@/types/interview';

type EventMap = {
  transcript: TranscriptEntry;
  status: InterviewStatus;
  question: { prompt: string };
};

type EventKey = keyof EventMap;
type Listener<K extends EventKey> = (payload: EventMap[K]) => void;

export class InterviewWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: { [K in EventKey]: Set<Listener<K>> } = {
    transcript: new Set(),
    status: new Set(),
    question: new Set()
  } as { [K in EventKey]: Set<Listener<K>> };

  connect(url: string): void {
    this.socket = new WebSocket(url);
    this.socket.onopen = () => this.emit('status', 'live');
    this.socket.onclose = () => this.emit('status', 'ended');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data) as { type: EventKey; payload: unknown };
      if (data.type in this.listeners) {
        this.emit(data.type, data.payload as never);
      }
    };
  }

  sendMessage(type: EventKey, payload: unknown): void {
    this.socket?.send(JSON.stringify({ type, payload }));
  }

  on<K extends EventKey>(event: K, listener: Listener<K>): () => void {
    this.listeners[event].add(listener as never);
    return () => this.listeners[event].delete(listener as never);
  }

  disconnect(): void { this.socket?.close(); }

  private emit<K extends EventKey>(event: K, payload: EventMap[K]): void {
    this.listeners[event].forEach((listener) => listener(payload));
  }
}

import { AvatarFrame } from "../types/avatar.js";

export interface AvatarSyncTransport {
  send(payload: string): void;
  onMessage(listener: (payload: string) => void): void;
}

export class RealtimeAvatarWebsocketSynchronization {
  private listeners: Array<(frame: AvatarFrame) => void> = [];

  constructor(private readonly transport: AvatarSyncTransport) {}

  start(): void {
    this.transport.onMessage((payload) => {
      const parsed = JSON.parse(payload) as AvatarFrame;
      this.listeners.forEach((listener) => listener(parsed));
    });
  }

  broadcastFrame(frame: AvatarFrame): void {
    this.transport.send(JSON.stringify(frame));
  }

  onFrame(listener: (frame: AvatarFrame) => void): void {
    this.listeners.push(listener);
  }
}

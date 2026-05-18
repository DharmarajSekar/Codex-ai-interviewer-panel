export class InterviewWebSocketClient {
  private socket?: WebSocket;

  connect(sessionId: string) {
    const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL ?? "ws://localhost:8000";
    this.socket = new WebSocket(`${baseUrl}/ws/interviews/${sessionId}`);
  }

  disconnect() {
    this.socket?.close();
  }
}

export class RealtimeDashboardClient {
  private socket?: WebSocket;

  connect(url: string, onSnapshot: (payload: unknown) => void): void {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => onSnapshot(JSON.parse(event.data));
  }

  disconnect(): void {
    this.socket?.close();
  }
}

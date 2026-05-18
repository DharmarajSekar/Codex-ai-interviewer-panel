import { WebSocketServer } from "ws";

export function attachDashboardSocket(server, store) {
  const wss = new WebSocketServer({ server, path: "/ws/recruiter-dashboard" });

  const broadcast = (event, payload) => {
    const message = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
    wss.clients.forEach((client) => client.readyState === 1 && client.send(message));
  };

  store.onUpdate = (payload) => broadcast("evaluation_updated", payload);
  wss.on("connection", (socket) => socket.send(JSON.stringify({ event: "connected", payload: { ok: true } })));
}

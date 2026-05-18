export class DashboardClient {
  constructor(baseUrl = "/api") { this.baseUrl = baseUrl; }
  async dashboard() { return fetch(`${this.baseUrl}/analytics/dashboard`).then((r) => r.json()); }
  async report(interviewId) { return fetch(`${this.baseUrl}/reports/${interviewId}`).then((r) => r.json()); }
  async compare() { return fetch(`${this.baseUrl}/candidates/compare`).then((r) => r.json()); }
  async timeline(interviewId) { return fetch(`${this.baseUrl}/interviews/${interviewId}/timeline`).then((r) => r.json()); }
  subscribe(onMessage) {
    const ws = new WebSocket(`ws://${window.location.host}/ws/recruiter-dashboard`);
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    return () => ws.close();
  }
}

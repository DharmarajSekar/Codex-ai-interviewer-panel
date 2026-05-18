import { EventEmitter } from 'events';
import { RecruiterDashboardSnapshot } from '../models/recruiterAnalytics';

export class DashboardSocketHub extends EventEmitter {
  publishSnapshot(snapshot: RecruiterDashboardSnapshot): void {
    this.emit(`recruiter:${snapshot.recruiterId}:snapshot`, snapshot);
  }

  subscribe(recruiterId: string, listener: (snapshot: RecruiterDashboardSnapshot) => void): () => void {
    const topic = `recruiter:${recruiterId}:snapshot`;
    this.on(topic, listener);
    return () => this.off(topic, listener);
  }
}

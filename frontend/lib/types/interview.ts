export type InterviewSessionState = "idle" | "connected" | "in_progress" | "completed";

export interface InterviewMessage {
  role: "system" | "assistant" | "candidate";
  content: string;
  timestamp: string;
}

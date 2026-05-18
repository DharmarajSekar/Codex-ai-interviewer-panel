export type BackoffState = { attempt: number; nextDelayMs: number };

export function computeBackoff(attempt: number, baseMs = 250, maxMs = 8000): BackoffState {
  const exp = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * Math.min(500, exp * 0.2));
  return { attempt, nextDelayMs: exp + jitter };
}

export class BoundedQueue<T> {
  private buf: T[] = [];
  constructor(private readonly capacity: number) {}

  push(item: T): boolean {
    if (this.buf.length >= this.capacity) return false;
    this.buf.push(item);
    return true;
  }

  shift(): T | undefined {
    return this.buf.shift();
  }

  size(): number {
    return this.buf.length;
  }
}

export function shouldDropPartial(
  producedAtMs: number,
  nowMs: number,
  stalenessBudgetMs = 1500,
): boolean {
  return nowMs - producedAtMs > stalenessBudgetMs;
}

export function mergeTranscriptPartial(
  prev: string,
  partial: string,
  finalSegment = false,
): string {
  if (!partial.trim()) return prev;
  if (finalSegment) return `${prev} ${partial}`.trim();
  return `${prev} ${partial}`.replace(/\s+/g, " ").trim();
}

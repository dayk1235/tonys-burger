export class RuntimeClock {
  private startTime: number;
  private pausedAt: number | null = null;
  private totalPausedMs = 0;

  constructor() {
    this.startTime = Date.now();
  }

  now(): string {
    return new Date().toISOString();
  }

  nowMs(): number {
    return Date.now();
  }

  uptimeMs(): number {
    const elapsed = Date.now() - this.startTime;
    return elapsed - this.totalPausedMs;
  }

  pause(): void {
    if (this.pausedAt === null) {
      this.pausedAt = Date.now();
    }
  }

  resume(): void {
    if (this.pausedAt !== null) {
      this.totalPausedMs += Date.now() - this.pausedAt;
      this.pausedAt = null;
    }
  }

  isPaused(): boolean {
    return this.pausedAt !== null;
  }
}

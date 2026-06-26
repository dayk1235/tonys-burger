import { RuntimeScheduler } from "../engines/observation/ObservationContracts";
import { RuntimeClock } from "./RuntimeClock";
import { SchedulerError } from "./RuntimeErrors";

interface ScheduledJob {
  intervalMs: number;
  task: () => Promise<void>;
}

export class RuntimeSchedulerImpl implements RuntimeScheduler {
  private jobs: Map<string, ScheduledJob> = new Map();
  private timerIds: Map<string, ReturnType<typeof setInterval>> = new Map();
  private running = false;
  private clock: RuntimeClock;

  constructor(clock: RuntimeClock) {
    this.clock = clock;
  }

  async scheduleRecurring(
    jobId: string,
    cron: string,
    task: () => Promise<void>
  ): Promise<void> {
    if (this.jobs.has(jobId)) {
      throw new SchedulerError(`Job "${jobId}" is already scheduled`);
    }

    const intervalMs = this.parseCronToMs(cron);
    const job: ScheduledJob = { intervalMs, task };
    this.jobs.set(jobId, job);

    if (this.running) {
      this.startTimer(jobId, intervalMs, task);
    }
  }

  async cancelScheduled(jobId: string): Promise<void> {
    this.stopTimer(jobId);
    this.jobs.delete(jobId);
  }

  async start(): Promise<void> {
    this.running = true;
    for (const [id, job] of this.jobs.entries()) {
      this.startTimer(id, job.intervalMs, job.task);
    }
  }

  async stop(): Promise<void> {
    this.running = false;
    for (const id of this.timerIds.keys()) {
      this.stopTimer(id);
    }
  }

  jobCount(): number {
    return this.jobs.size;
  }

  private startTimer(id: string, intervalMs: number, task: () => Promise<void>): void {
    this.stopTimer(id);
    const timerId = setInterval(async () => {
      try {
        await task();
      } catch {
        // task errors are swallowed to prevent scheduler crashes
      }
    }, intervalMs);
    this.timerIds.set(id, timerId);
  }

  private stopTimer(id: string): void {
    const existing = this.timerIds.get(id);
    if (existing !== undefined) {
      clearInterval(existing);
      this.timerIds.delete(id);
    }
  }

  private parseCronToMs(cron: string): number {
    if (cron === "* * * * *") return 60_000;
    if (cron === "*/5 * * * *") return 300_000;
    if (cron === "*/10 * * * *") return 600_000;
    if (cron === "*/30 * * * *") return 1_800_000;
    if (cron === "0 * * * *") return 3_600_000;

    const match = cron.match(/^\*\/(\d+) \* \* \* \*$/);
    if (match) {
      return parseInt(match[1], 10) * 60_000;
    }

    return 60_000;
  }
}

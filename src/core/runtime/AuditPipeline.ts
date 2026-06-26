import { AuditPipeline as AuditPipelineContract } from "../engines/observation/ObservationContracts";
import { AuditRecord } from "./RuntimeTypes";
import { RuntimeClock } from "./RuntimeClock";

export class AuditPipelineImpl implements AuditPipelineContract {
  private records: AuditRecord[] = [];
  private auditIdCounter = 0;
  private retentionMs: number;
  private clock: RuntimeClock;

  constructor(clock: RuntimeClock, retentionMs = 86_400_000) {
    this.clock = clock;
    this.retentionMs = retentionMs;
  }

  async recordLog(engine: string, action: string, details: Record<string, unknown>): Promise<void> {
    this.evictExpired();

    const record: AuditRecord = {
      id: `aud_${++this.auditIdCounter}`,
      timestamp: this.clock.now(),
      source: engine,
      type: "LOG",
      action,
      details,
    };

    this.records.push(record);
  }

  async recordStateChange(engine: string, from: string, to: string): Promise<void> {
    this.evictExpired();

    const record: AuditRecord = {
      id: `aud_${++this.auditIdCounter}`,
      timestamp: this.clock.now(),
      source: engine,
      type: "STATE_CHANGE",
      action: `${from} → ${to}`,
      details: { from, to },
    };

    this.records.push(record);
  }

  getRecords(source?: string): AuditRecord[] {
    if (source) {
      return this.records.filter((r) => r.source === source);
    }
    return [...this.records];
  }

  getByType(type: string): AuditRecord[] {
    return this.records.filter((r) => r.type === type);
  }

  count(): number {
    return this.records.length;
  }

  clear(): void {
    this.records = [];
  }

  private evictExpired(): void {
    if (this.retentionMs <= 0) return;
    const cutoff = Date.now() - this.retentionMs;
    this.records = this.records.filter(
      (r) => new Date(r.timestamp).getTime() > cutoff
    );
  }
}

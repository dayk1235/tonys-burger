import { WorkingMemoryEntry } from "./RuntimeTypes";
import { WorkingMemoryError } from "./RuntimeErrors";
import { AuditPipeline } from "../engines/observation/ObservationContracts";
import { RuntimeErrorReporter } from "./RuntimeErrorReporter";

interface WorkingMemorySubscription {
  filter?: string;
  handler: (entry: WorkingMemoryEntry) => Promise<void>;
}

export class WorkingMemory {
  private entries: WorkingMemoryEntry[] = [];
  private subscriptions: WorkingMemorySubscription[] = [];
  private entryIdCounter = 0;
  private maxItems: number;
  private defaultTTL: number;
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(maxItems = 10000, defaultTTLMs = 300_000, auditPipeline?: AuditPipeline) {
    this.maxItems = maxItems;
    this.defaultTTL = defaultTTLMs;
    this.errorReporter = new RuntimeErrorReporter("WorkingMemory", auditPipeline);
  }

  async store(
    source: string,
    type: string,
    payload: Record<string, unknown>,
    ttlOverride?: number
  ): Promise<WorkingMemoryEntry> {
    const ttl = ttlOverride ?? this.defaultTTL;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttl);

    const entry: WorkingMemoryEntry = {
      id: `wme_${++this.entryIdCounter}`,
      source,
      type,
      payload,
      timestamp: now.toISOString(),
      ttl,
      expiresAt: expiresAt.toISOString(),
    };

    this.evictExpired();
    this.entries.push(entry);

    if (this.entries.length > this.maxItems) {
      this.entries = this.entries.slice(-this.maxItems);
    }

    await this.notifySubscribers(entry);

    return entry;
  }

  async retrieve(id: string): Promise<WorkingMemoryEntry | undefined> {
    this.evictExpired();
    return this.entries.find((e) => e.id === id);
  }

  async findByType(type: string): Promise<WorkingMemoryEntry[]> {
    this.evictExpired();
    return this.entries.filter((e) => e.type === type);
  }

  async findBySource(source: string): Promise<WorkingMemoryEntry[]> {
    this.evictExpired();
    return this.entries.filter((e) => e.source === source);
  }

  async find(predicate: (entry: WorkingMemoryEntry) => boolean): Promise<WorkingMemoryEntry[]> {
    this.evictExpired();
    return this.entries.filter(predicate);
  }

  async delete(id: string): Promise<boolean> {
    const idx = this.entries.findIndex((e) => e.id === id);
    if (idx === -1) return false;
    this.entries.splice(idx, 1);
    return true;
  }

  async clear(): Promise<void> {
    this.entries = [];
  }

  async subscribe(typeFilter: string | undefined, handler: (entry: WorkingMemoryEntry) => Promise<void>): Promise<void> {
    this.subscriptions.push({ filter: typeFilter, handler });
  }

  count(): number {
    this.evictExpired();
    return this.entries.length;
  }

  private evictExpired(): void {
    const now = new Date();
    this.entries = this.entries.filter((e) => new Date(e.expiresAt) > now);
  }

  private async notifySubscribers(entry: WorkingMemoryEntry): Promise<void> {
    for (const sub of this.subscriptions) {
      if (!sub.filter || sub.filter === entry.type) {
        try {
          await sub.handler(entry);
        } catch (err) {
          await this.errorReporter.reportRuntimeError("subscriber_notification", err);
        }
      }
    }
  }
}

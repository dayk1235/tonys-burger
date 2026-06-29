import { Attention } from "./AttentionTypes";
import { AttentionSubscriber } from "./AttentionContracts";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

export class AttentionMemory {
  private items: Map<string, Attention> = new Map();
  private subscribers: AttentionSubscriber[] = [];
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(errorReporter?: RuntimeErrorReporter) {
    this.errorReporter = errorReporter ?? new RuntimeErrorReporter("AttentionMemory");
  }

  subscribe(subscriber: AttentionSubscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: AttentionSubscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  store(attention: Attention): void {
    const existing = this.items.get(attention.id);
    this.items.set(attention.id, attention);

    if (!existing) {
      this.notifyCreated(attention);
    } else {
      this.notifyUpdated(attention);
    }
  }

  retrieve(id: string): Attention | undefined {
    return this.items.get(id);
  }

  getAll(): Attention[] {
    return Array.from(this.items.values());
  }

  findByStage(stage: string): Attention[] {
    return this.getAll().filter((a) => a.stage === stage);
  }

  findByCategory(category: string): Attention[] {
    return this.getAll().filter((a) => a.identity.category === category);
  }

  findBySourceId(sourceId: string): Attention[] {
    return this.getAll().filter((a) => a.identity.sourceId === sourceId);
  }

  findFocused(): Attention | undefined {
    return this.getAll().find((a) => a.stage === "FOCUSED");
  }

  findQueued(): Attention[] {
    return this.getAll().filter((a) => a.stage === "QUEUED");
  }

  findDeferred(): Attention[] {
    return this.getAll().filter((a) => a.stage === "DEFERRED");
  }

  findActive(): Attention[] {
    const active: string[] = ["CANDIDATE", "OBSERVED", "SCORED", "QUEUED", "FOCUSED", "MAINTAINED", "INTERRUPTED", "DEFERRED"];
    return this.getAll().filter((a) => active.includes(a.stage));
  }

  remove(id: string): boolean {
    const existed = this.items.has(id);
    this.items.delete(id);
    return existed;
  }

  count(): number {
    return this.items.size;
  }

  clear(): void {
    this.items.clear();
  }

  private notifyCreated(attention: Attention): void {
    for (const subscriber of this.subscribers) {
      subscriber.onAttentionCreated(attention).catch((err) => {
        this.errorReporter.reportEngineError("onAttentionCreated", err);
      });
    }
  }

  private notifyUpdated(attention: Attention): void {
    for (const subscriber of this.subscribers) {
      subscriber.onAttentionUpdated(attention).catch((err) => {
        this.errorReporter.reportEngineError("onAttentionUpdated", err);
      });
    }
  }
}

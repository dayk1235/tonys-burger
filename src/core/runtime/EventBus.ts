import { CognitiveEvent, PriorityLevel } from "./RuntimeTypes";
import { EventBusError } from "./RuntimeErrors";
import { RuntimeClock } from "./RuntimeClock";

interface Subscription {
  eventName: string;
  handler: (payload: Record<string, unknown>) => Promise<void>;
  priority: PriorityLevel;
}

interface DeadLetterEntry {
  event: CognitiveEvent;
  reason: string;
  timestamp: string;
  subscriber: string;
}

export class EventBus {
  private subscriptions: Map<string, Subscription[]> = new Map();
  private history: CognitiveEvent[] = [];
  private deadLetters: DeadLetterEntry[] = [];
  private eventIdCounter = 0;
  private historyLimit: number;
  private readonly clock: RuntimeClock;
  private onDelivered?: () => void;

  constructor(clock: RuntimeClock, historyLimit = 1000, onDelivered?: () => void) {
    this.clock = clock;
    this.historyLimit = historyLimit;
    this.onDelivered = onDelivered;
  }

  async emit(eventName: string, payload: Record<string, unknown>, source = "runtime", businessId?: string, correlationId?: string): Promise<void> {
    const event: CognitiveEvent = {
      id: `evt_${++this.eventIdCounter}`,
      type: eventName,
      source,
      timestamp: this.clock.now(),
      payload,
      businessId: businessId || (payload.businessId as string | undefined),
      correlationId: correlationId || (payload.correlationId as string | undefined),
    };

    this.addToHistory(event);

    const subs = this.subscriptions.get(eventName);
    if (!subs || subs.length === 0) return;

    const sorted = [...subs].sort((a, b) => {
      const order: Record<PriorityLevel, number> = { CRITICAL: 0, HIGH: 1, NORMAL: 2, LOW: 3, BACKGROUND: 4 };
      return order[a.priority] - order[b.priority];
    });

    for (const sub of sorted) {
      try {
        await sub.handler(payload);
        this.onDelivered?.();
      } catch (err) {
        this.deadLetters.push({
          event,
          reason: err instanceof Error ? err.message : "Unknown error",
          timestamp: this.clock.now(),
          subscriber: sub.eventName,
        });
      }
    }
  }

  async subscribe(eventName: string, handler: (payload: Record<string, unknown>) => Promise<void>, priority: PriorityLevel = "NORMAL"): Promise<void> {
    if (!eventName || eventName.trim().length === 0) {
      throw new EventBusError("event name is required");
    }
    if (typeof handler !== "function") {
      throw new EventBusError("handler must be a function");
    }

    const subs = this.subscriptions.get(eventName) || [];
    subs.push({ eventName, handler, priority });
    this.subscriptions.set(eventName, subs);
  }

  async unsubscribe(eventName: string, handler: (payload: Record<string, unknown>) => Promise<void>): Promise<void> {
    const subs = this.subscriptions.get(eventName);
    if (!subs) return;
    this.subscriptions.set(
      eventName,
      subs.filter((s) => s.handler !== handler)
    );
    if (this.subscriptions.get(eventName)?.length === 0) {
      this.subscriptions.delete(eventName);
    }
  }

  getHistory(eventName?: string): CognitiveEvent[] {
    if (eventName) {
      return this.history.filter((e) => e.type === eventName);
    }
    return [...this.history];
  }

  getDeadLetters(): DeadLetterEntry[] {
    return [...this.deadLetters];
  }

  subscriberCount(eventName?: string): number {
    if (eventName) {
      return this.subscriptions.get(eventName)?.length ?? 0;
    }
    let count = 0;
    for (const subs of this.subscriptions.values()) {
      count += subs.length;
    }
    return count;
  }

  private addToHistory(event: CognitiveEvent): void {
    this.history.push(event);
    if (this.history.length > this.historyLimit) {
      this.history = this.history.slice(-this.historyLimit);
    }
  }

  reset(): void {
    this.subscriptions.clear();
    this.history = [];
    this.deadLetters = [];
    this.eventIdCounter = 0;
  }
}

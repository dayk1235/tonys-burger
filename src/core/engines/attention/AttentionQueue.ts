import { Attention } from "./AttentionTypes";

export interface QueueEntry {
  readonly attention: Attention;
  readonly enqueuedAt: string;
  readonly position: number;
  readonly priorityScore: number;
}

export class AttentionQueue {
  private queue: Attention[] = [];
  private maxSize = 100;

  enqueue(attention: Attention): void {
    const existing = this.queue.findIndex((a) => a.id === attention.id);
    if (existing >= 0) {
      this.queue[existing] = attention;
    } else {
      if (this.queue.length >= this.maxSize) {
        this.evictLowestPriority();
      }
      this.queue.push(attention);
    }
    this.sort();
  }

  dequeue(): Attention | undefined {
    if (this.queue.length === 0) return undefined;
    this.sort();
    const item = this.queue.shift();
    if (item) {
      item.metadata.totalAllocations++;
    }
    return item;
  }

  peek(): Attention | undefined {
    this.sort();
    return this.queue[0];
  }

  remove(attentionId: string): boolean {
    const index = this.queue.findIndex((a) => a.id === attentionId);
    if (index >= 0) {
      this.queue.splice(index, 1);
      return true;
    }
    return false;
  }

  reorder(): void {
    this.sort();
  }

  getAll(): Attention[] {
    return [...this.queue];
  }

  getEntries(): QueueEntry[] {
    this.sort();
    return this.queue.map((attention, index) => ({
      attention,
      enqueuedAt: attention.provenance.creationTimeline[attention.provenance.creationTimeline.length - 1],
      position: index + 1,
      priorityScore: attention.priority,
    }));
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  setMaxSize(size: number): void {
    this.maxSize = Math.max(1, size);
    while (this.queue.length > this.maxSize) {
      this.evictLowestPriority();
    }
  }

  contains(attentionId: string): boolean {
    return this.queue.some((a) => a.id === attentionId);
  }

  clear(): void {
    this.queue = [];
  }

  private sort(): void {
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      if (a.timesInterrupted !== b.timesInterrupted) return b.timesInterrupted - a.timesInterrupted;
      return b.age - a.age;
    });
  }

  private evictLowestPriority(): void {
    this.sort();
    this.queue.pop();
  }
}

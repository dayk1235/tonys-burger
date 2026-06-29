import { EventBus } from '../bus/EventBus.js';
import { GraphSyncEvent } from '../bus/events.js';
import type { FileChangedPayload, BatchReadyPayload } from '../bus/events.js';
import { getLogger } from '../logger/logger.js';

export class Debouncer {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private pending: FileChangedPayload[] = [];
  private source: string = '';

  constructor(
    private bus: EventBus,
    private delayMs: number,
  ) {}

  add(change: FileChangedPayload, source: string): void {
    this.pending.push(change);
    this.source = source;
    this.resetTimer();
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.dispatch();
  }

  private resetTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.dispatch(), this.delayMs);
  }

  private dispatch(): void {
    if (this.pending.length === 0) return;

    this.timer = null;
    const changes = [...this.pending];
    const source = this.source;
    this.pending = [];

    const log = getLogger();
    log.debug(
      { count: changes.length, source },
      'debounce timer expired, dispatching batch',
    );

    const payload: BatchReadyPayload = {
      changes,
      source,
      mode: 'fast',
    };

    this.bus.emit(GraphSyncEvent.BatchReady, payload);
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  clear(): void {
    this.stop();
    this.pending = [];
  }
}

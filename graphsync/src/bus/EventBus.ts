import { EventEmitter } from 'node:events';

export class EventBus {
  private emitter = new EventEmitter();

  on(event: string, listener: (...args: unknown[]) => void): void {
    this.emitter.on(event, listener);
  }

  off(event: string, listener: (...args: unknown[]) => void): void {
    this.emitter.off(event, listener);
  }

  emit(event: string, payload: unknown): void {
    this.emitter.emit(event, payload);
  }

  removeAllListeners(): void {
    this.emitter.removeAllListeners();
  }
}

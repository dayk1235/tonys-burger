import { GraphSyncEvent } from '../bus/events.js';
import { getLogger } from '../logger/logger.js';
export class Debouncer {
    bus;
    delayMs;
    timer = null;
    pending = [];
    source = '';
    constructor(bus, delayMs) {
        this.bus = bus;
        this.delayMs = delayMs;
    }
    add(change, source) {
        this.pending.push(change);
        this.source = source;
        this.resetTimer();
    }
    flush() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        this.dispatch();
    }
    resetTimer() {
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = setTimeout(() => this.dispatch(), this.delayMs);
    }
    dispatch() {
        if (this.pending.length === 0)
            return;
        this.timer = null;
        const changes = [...this.pending];
        const source = this.source;
        this.pending = [];
        const log = getLogger();
        log.debug({ count: changes.length, source }, 'debounce timer expired, dispatching batch');
        const payload = {
            changes,
            source,
            mode: 'fast',
        };
        this.bus.emit(GraphSyncEvent.BatchReady, payload);
    }
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
    clear() {
        this.stop();
        this.pending = [];
    }
}
//# sourceMappingURL=Debouncer.js.map
import { EventEmitter } from 'node:events';
export class EventBus {
    emitter = new EventEmitter();
    on(event, listener) {
        this.emitter.on(event, listener);
    }
    off(event, listener) {
        this.emitter.off(event, listener);
    }
    emit(event, payload) {
        this.emitter.emit(event, payload);
    }
    removeAllListeners() {
        this.emitter.removeAllListeners();
    }
}
//# sourceMappingURL=EventBus.js.map
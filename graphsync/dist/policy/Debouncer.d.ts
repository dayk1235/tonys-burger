import { EventBus } from '../bus/EventBus.js';
import type { FileChangedPayload } from '../bus/events.js';
export declare class Debouncer {
    private bus;
    private delayMs;
    private timer;
    private pending;
    private source;
    constructor(bus: EventBus, delayMs: number);
    add(change: FileChangedPayload, source: string): void;
    flush(): void;
    private resetTimer;
    private dispatch;
    stop(): void;
    clear(): void;
}
//# sourceMappingURL=Debouncer.d.ts.map
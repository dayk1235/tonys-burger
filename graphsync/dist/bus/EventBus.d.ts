export declare class EventBus {
    private emitter;
    on(event: string, listener: (...args: unknown[]) => void): void;
    off(event: string, listener: (...args: unknown[]) => void): void;
    emit(event: string, payload: unknown): void;
    removeAllListeners(): void;
}
//# sourceMappingURL=EventBus.d.ts.map
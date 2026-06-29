import type { IndexProvider } from '../sync/IndexProvider.js';
export declare class ProviderRegistry {
    private providers;
    private activeType;
    register(type: string, provider: IndexProvider): void;
    setActive(type: string): void;
    getActive(): IndexProvider | null;
    get(type: string): IndexProvider | null;
    list(): string[];
    getActiveType(): string | null;
}
//# sourceMappingURL=ProviderRegistry.d.ts.map
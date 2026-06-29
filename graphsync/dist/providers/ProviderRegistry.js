export class ProviderRegistry {
    providers = new Map();
    activeType = null;
    register(type, provider) {
        this.providers.set(type, provider);
    }
    setActive(type) {
        if (!this.providers.has(type)) {
            throw new Error(`Provider '${type}' is not registered.`);
        }
        this.activeType = type;
    }
    getActive() {
        if (!this.activeType)
            return null;
        return this.providers.get(this.activeType) ?? null;
    }
    get(type) {
        return this.providers.get(type) ?? null;
    }
    list() {
        return Array.from(this.providers.keys());
    }
    getActiveType() {
        return this.activeType;
    }
}
//# sourceMappingURL=ProviderRegistry.js.map
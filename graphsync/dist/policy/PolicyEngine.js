export class PolicyEngine {
    options;
    cooldowns = new Map();
    firstSeen = new Set();
    constructor(options) {
        this.options = options;
    }
    evaluate(source, hasFiles, isIgnored) {
        if (!hasFiles) {
            return {
                reindex: false,
                mode: this.options.defaultMode,
                source,
                reason: 'no files to index',
            };
        }
        if (isIgnored) {
            return {
                reindex: false,
                mode: this.options.defaultMode,
                source,
                reason: 'file is in ignored pattern',
            };
        }
        if (this.isOnCooldown(source)) {
            return {
                reindex: false,
                mode: this.options.defaultMode,
                source,
                reason: `source '${source}' is on cooldown`,
            };
        }
        const mode = this.resolveMode(source);
        if (!this.firstSeen.has(source)) {
            this.firstSeen.add(source);
            return {
                reindex: true,
                mode: 'full',
                source,
                reason: `first index for source '${source}'`,
            };
        }
        return {
            reindex: true,
            mode,
            source,
            reason: 'change detected in knowledge source',
        };
    }
    markIndexed(source) {
        this.cooldowns.set(source, Date.now());
    }
    isOnCooldown(source) {
        const last = this.cooldowns.get(source);
        if (!last)
            return false;
        return Date.now() - last < this.options.cooldownSeconds * 1000;
    }
    resolveMode(source) {
        return this.options.modeBySource[source] ?? this.options.defaultMode;
    }
    resetCooldowns() {
        this.cooldowns.clear();
    }
}
//# sourceMappingURL=PolicyEngine.js.map
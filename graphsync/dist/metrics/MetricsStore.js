const startTime = Date.now();
export class MetricsStore {
    indexes = [];
    skipped = 0;
    providerChecks = [];
    recordIndex(metrics) {
        this.indexes.push(metrics);
    }
    recordSkip(source, _reason) {
        this.skipped++;
    }
    recordProviderCheck(metrics) {
        this.providerChecks.push(metrics);
    }
    snapshot() {
        const total = this.indexes.length;
        const successful = this.indexes.filter((i) => i.success).length;
        const failed = this.indexes.filter((i) => !i.success).length;
        const avgDuration = total > 0
            ? this.indexes.reduce((sum, i) => sum + i.durationMs, 0) / total
            : 0;
        const lastIndex = this.indexes.length > 0
            ? this.indexes[this.indexes.length - 1].timestamp
            : null;
        return {
            totalIndexes: total,
            successfulIndexes: successful,
            failedIndexes: failed,
            skippedIndexes: this.skipped,
            averageDurationMs: Math.round(avgDuration),
            lastIndexAt: lastIndex,
            uptimeMs: Date.now() - startTime,
        };
    }
    reset() {
        this.indexes = [];
        this.skipped = 0;
        this.providerChecks = [];
    }
}
//# sourceMappingURL=MetricsStore.js.map
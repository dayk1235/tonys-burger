import type {
  MetricsRecorder,
  IndexMetrics,
  ProviderMetrics,
  MetricsSnapshot,
} from './MetricsRecorder.js';

const startTime = Date.now();

export class MetricsStore implements MetricsRecorder {
  private indexes: IndexMetrics[] = [];
  private skipped: number = 0;
  private providerChecks: ProviderMetrics[] = [];

  recordIndex(metrics: IndexMetrics): void {
    this.indexes.push(metrics);
  }

  recordSkip(source: string, _reason: string): void {
    this.skipped++;
  }

  recordProviderCheck(metrics: ProviderMetrics): void {
    this.providerChecks.push(metrics);
  }

  snapshot(): MetricsSnapshot {
    const total = this.indexes.length;
    const successful = this.indexes.filter((i) => i.success).length;
    const failed = this.indexes.filter((i) => !i.success).length;
    const avgDuration =
      total > 0
        ? this.indexes.reduce((sum, i) => sum + i.durationMs, 0) / total
        : 0;
    const lastIndex =
      this.indexes.length > 0
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

  reset(): void {
    this.indexes = [];
    this.skipped = 0;
    this.providerChecks = [];
  }
}

/**
 * @file ObservationMetrics.ts
 * @description In-memory metrics aggregator for tracking processing latency,
 * ingestion volumes, failure rates, and source reliability.
 */

import { ObservationCategory } from "./ObservationTypes";

/**
 * Snapshot of metrics for the Observation Engine.
 */
export interface MetricsSnapshot {
  ingestedCount: number;
  verifiedCount: number;
  verificationFailedCount: number;
  contextEnrichedCount: number;
  qualityFailedCount: number;
  totalLatencyMs: number;
  averageLatencyMs: number;
  categoryDistribution: Record<ObservationCategory, number>;
  sourceReliability: Record<string, { total: number; failed: number; ratio: number }>;
}

/**
 * Aggregator for engine telemetry.
 */
export class ObservationMetrics {
  private ingestedCount = 0;
  private verifiedCount = 0;
  private verificationFailedCount = 0;
  private contextEnrichedCount = 0;
  private qualityFailedCount = 0;
  private totalLatencyMs = 0;
  
  private categoryDistribution: Record<ObservationCategory, number> = {
    [ObservationCategory.OPERATIONAL]: 0,
    [ObservationCategory.BEHAVIORAL]: 0,
    [ObservationCategory.ENVIRONMENTAL]: 0,
    [ObservationCategory.FINANCIAL]: 0,
    [ObservationCategory.TEMPORAL]: 0,
    [ObservationCategory.CUSTOMER]: 0,
    [ObservationCategory.EMPLOYEE]: 0,
    [ObservationCategory.INVENTORY]: 0,
    [ObservationCategory.SUPPLY_CHAIN]: 0,
    [ObservationCategory.EXPERIENCE]: 0
  };

  private sourceTelemetry: Record<string, { total: number; failed: number }> = {};

  public recordIngestion(category: ObservationCategory, sourceId: string): void {
    this.ingestedCount++;
    this.categoryDistribution[category] = (this.categoryDistribution[category] || 0) + 1;
    
    if (!this.sourceTelemetry[sourceId]) {
      this.sourceTelemetry[sourceId] = { total: 0, failed: 0 };
    }
    this.sourceTelemetry[sourceId].total++;
  }

  public recordVerificationSuccess(): void {
    this.verifiedCount++;
  }

  public recordVerificationFailure(sourceId: string): void {
    this.verificationFailedCount++;
    if (this.sourceTelemetry[sourceId]) {
      this.sourceTelemetry[sourceId].failed++;
    }
  }

  public recordContextEnriched(): void {
    this.contextEnrichedCount++;
  }

  public recordQualityFailure(sourceId: string): void {
    this.qualityFailedCount++;
    if (this.sourceTelemetry[sourceId]) {
      this.sourceTelemetry[sourceId].failed++;
    }
  }

  public recordProcessingTime(ms: number): void {
    this.totalLatencyMs += ms;
  }

  public getSnapshot(): MetricsSnapshot {
    const sourceReliability: Record<string, { total: number; failed: number; ratio: number }> = {};
    
    for (const [sourceId, telemetry] of Object.entries(this.sourceTelemetry)) {
      sourceReliability[sourceId] = {
        total: telemetry.total,
        failed: telemetry.failed,
        ratio: telemetry.total > 0 ? (telemetry.total - telemetry.failed) / telemetry.total : 1
      };
    }

    return {
      ingestedCount: this.ingestedCount,
      verifiedCount: this.verifiedCount,
      verificationFailedCount: this.verificationFailedCount,
      contextEnrichedCount: this.contextEnrichedCount,
      qualityFailedCount: this.qualityFailedCount,
      totalLatencyMs: this.totalLatencyMs,
      averageLatencyMs: this.ingestedCount > 0 ? this.totalLatencyMs / this.ingestedCount : 0,
      categoryDistribution: { ...this.categoryDistribution },
      sourceReliability
    };
  }

  public reset(): void {
    this.ingestedCount = 0;
    this.verifiedCount = 0;
    this.verificationFailedCount = 0;
    this.contextEnrichedCount = 0;
    this.qualityFailedCount = 0;
    this.totalLatencyMs = 0;
    
    for (const key of Object.keys(this.categoryDistribution)) {
      this.categoryDistribution[key as ObservationCategory] = 0;
    }
    this.sourceTelemetry = {};
  }
}

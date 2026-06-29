import { ObservationRef, PatternDetectionResult } from "./PatternTypes";
import { TrendDetectionError } from "./PatternErrors";
import { AuditPipeline } from "../observation/ObservationContracts";
import { RuntimeErrorReporter } from "../../runtime/RuntimeErrorReporter";

export type TrendDirection = "POSITIVE" | "NEGATIVE" | "STABLE" | "EMERGING";

export interface TrendResult {
  readonly direction: TrendDirection;
  readonly slope: number;
  readonly intercept: number;
  readonly rSquared: number;
  readonly significance: number;
  readonly sampleSize: number;
  readonly accelerating: boolean;
  readonly seasonalityDetected: boolean;
}

export class PatternTrend {
  private readonly errorReporter: RuntimeErrorReporter;

  constructor(private readonly auditPipeline?: AuditPipeline) {
    this.errorReporter = new RuntimeErrorReporter("PatternTrend", this.auditPipeline);
  }

  detect(
    observations: readonly ObservationRef[],
    category?: string
  ): TrendResult {
    const filtered = category
      ? observations.filter((o) => o.category === category)
      : observations;

    if (filtered.length < 3) {
      throw new TrendDetectionError(
        `Need at least 3 observations for trend detection, got ${filtered.length}`
      );
    }

    const sorted = [...filtered].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const values = this.extractTimeSeries(sorted);
    const regressionResult = this.linearRegression(values);
    const residuals = values.map((v) => v.value - (regressionResult.slope * v.x + regressionResult.intercept));
    const accelerating = this.detectAcceleration(values);
    const seasonalityDetected = this.detectSeasonality(values);

    let direction: TrendDirection;
    const absSlope = Math.abs(regressionResult.slope);
    const meanValue = values.reduce((s, v) => s + v.value, 0) / values.length;
    const relativeSlope = meanValue !== 0 ? absSlope / meanValue : absSlope;

    if (regressionResult.rSquared < 0.3 || relativeSlope < 0.01) {
      direction = "STABLE";
    } else if (sorted.length < 5 && regressionResult.rSquared > 0.6) {
      direction = "EMERGING";
    } else {
      direction = regressionResult.slope > 0 ? "POSITIVE" : "NEGATIVE";
    }

    return {
      direction,
      slope: regressionResult.slope,
      intercept: regressionResult.intercept,
      rSquared: regressionResult.rSquared,
      significance: Math.min(0.99, Math.max(0.01, regressionResult.rSquared)),
      sampleSize: filtered.length,
      accelerating,
      seasonalityDetected,
    };
  }

  findTrends(
    observations: readonly ObservationRef[],
    minSlopeSignificance = 0.3
  ): PatternDetectionResult[] {
    const results: PatternDetectionResult[] = [];
    const byCategory = this.groupByCategory(observations);

    for (const { category, obsList } of byCategory) {
      try {
        const trend = this.detect(obsList, category);
        if (trend.rSquared >= minSlopeSignificance) {
          results.push({
            detected: true,
            strength: trend.rSquared,
            confidence: trend.significance,
            novelty: trend.accelerating ? 0.7 : 0.3,
            evidence: obsList.map((o) => o.id),
            metadata: {
              direction: trend.direction,
              slope: trend.slope,
              rSquared: trend.rSquared,
              accelerating: trend.accelerating,
              seasonalityDetected: trend.seasonalityDetected,
              category,
              sampleSize: trend.sampleSize,
            },
          });
        }
      } catch (error) {
        void this.errorReporter.reportWithDetails("detect_trend", error, {
          event: category,
        });
      }
    }

    return results;
  }

  private extractTimeSeries(
    observations: readonly ObservationRef[]
  ): Array<{ x: number; value: number }> {
    if (observations.length === 0) return [];
    const baseTime = new Date(observations[0].timestamp).getTime();

    return observations.map((obs) => {
      const timeMs = new Date(obs.timestamp).getTime() - baseTime;
      const value = this.extractNumericValue(obs);
      return { x: timeMs / (1000 * 60 * 60), value };
    });
  }

  private extractNumericValue(obs: ObservationRef): number {
    const payload = obs.payload as Record<string, unknown>;
    const numericKeys = Object.entries(payload).filter(
      ([, v]) => typeof v === "number"
    );
    if (numericKeys.length === 0) return 1;
    return numericKeys[0][1] as number;
  }

  private linearRegression(
    values: Array<{ x: number; value: number }>
  ): { slope: number; intercept: number; rSquared: number } {
    const n = values.length;
    const sumX = values.reduce((s, v) => s + v.x, 0);
    const sumY = values.reduce((s, v) => s + v.value, 0);
    const sumXY = values.reduce((s, v) => s + v.x * v.value, 0);
    const sumX2 = values.reduce((s, v) => s + v.x * v.x, 0);

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return { slope: 0, intercept: sumY / n, rSquared: 0 };

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    const meanY = sumY / n;
    const ssRes = values.reduce((s, v) => s + Math.pow(v.value - (slope * v.x + intercept), 2), 0);
    const ssTot = values.reduce((s, v) => s + Math.pow(v.value - meanY, 2), 0);

    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    return { slope, intercept, rSquared: Math.max(0, Math.min(1, rSquared)) };
  }

  private detectAcceleration(values: Array<{ x: number; value: number }>): boolean {
    if (values.length < 6) return false;
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    const firstSlope = this.linearRegression(firstHalf).slope;
    const secondSlope = this.linearRegression(secondHalf).slope;
    return Math.abs(secondSlope) > Math.abs(firstSlope) * 1.5;
  }

  private detectSeasonality(values: Array<{ x: number; value: number }>): boolean {
    if (values.length < 24) return false;
    const hourlyValues = new Array(24).fill(0);
    const hourlyCounts = new Array(24).fill(0);
    for (const v of values) {
      const hour = Math.round(v.x) % 24;
      hourlyValues[hour] += v.value;
      hourlyCounts[hour]++;
    }
    const hourlyMeans = hourlyValues.map((sum, i) => hourlyCounts[i] > 0 ? sum / hourlyCounts[i] : 0);
    const mean = hourlyMeans.reduce((s, m) => s + m, 0) / 24;
    const variance = hourlyMeans.reduce((s, m) => s + Math.pow(m - mean, 2), 0) / 24;
    return variance > mean * 0.2;
  }

  private groupByCategory(
    observations: readonly ObservationRef[]
  ): Array<{ category: string; obsList: ObservationRef[] }> {
    const groups = new Map<string, ObservationRef[]>();
    for (const obs of observations) {
      const existing = groups.get(obs.category) || [];
      existing.push(obs);
      groups.set(obs.category, existing);
    }
    return Array.from(groups.entries()).map(([category, obsList]) => ({ category, obsList }));
  }
}

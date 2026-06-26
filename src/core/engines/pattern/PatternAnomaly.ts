import { ObservationRef, PatternDetectionResult } from "./PatternTypes";
import { AnomalyDetectionError } from "./PatternErrors";

export interface AnomalyResult {
  readonly isAnomaly: boolean;
  readonly zScore: number;
  readonly deviation: number;
  readonly percentile: number;
  readonly severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  readonly contributingFactors: readonly string[];
}

export class PatternAnomaly {
  detect(
    observation: ObservationRef,
    baseline: readonly ObservationRef[],
    method: "ZSCORE" | "IQR" = "ZSCORE"
  ): AnomalyResult {
    if (baseline.length < 5) {
      throw new AnomalyDetectionError(
        `Need at least 5 baseline observations, got ${baseline.length}`
      );
    }

    const value = this.extractNumericValue(observation);
    const baselineValues = baseline.map((o) => this.extractNumericValue(o));

    if (method === "ZSCORE") {
      return this.detectZScore(observation, value, baselineValues);
    }
    return this.detectIQR(observation, value, baselineValues);
  }

  findAnomalies(
    observations: readonly ObservationRef[],
    threshold = 2.0
  ): PatternDetectionResult[] {
    if (observations.length < 10) return [];
    const results: PatternDetectionResult[] = [];

    const byCategory = this.groupByCategory(observations);
    for (const { category, obsList } of byCategory) {
      if (obsList.length < 5) continue;
      const values = obsList.map((o) => this.extractNumericValue(o));
      const mean = values.reduce((s, v) => s + v, 0) / values.length;
      const std = Math.sqrt(values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length);

      if (std === 0) continue;

      for (const obs of obsList) {
        const value = this.extractNumericValue(obs);
        const zScore = Math.abs((value - mean) / std);
        if (zScore >= threshold) {
          results.push({
            detected: true,
            strength: Math.min(1, zScore / 5),
            confidence: Math.min(0.99, 1 - 1 / (1 + zScore)),
            novelty: Math.min(1, zScore / 3),
            evidence: [obs.id],
            metadata: {
              category,
              zScore,
              value,
              mean,
              stdDev: std,
              threshold,
              severity: zScore >= 4 ? "CRITICAL" : zScore >= 3 ? "HIGH" : "MEDIUM",
            },
          });
        }
      }
    }

    return results;
  }

  private detectZScore(
    observation: ObservationRef,
    value: number,
    baselineValues: number[]
  ): AnomalyResult {
    const mean = baselineValues.reduce((s, v) => s + v, 0) / baselineValues.length;
    const std = Math.sqrt(
      baselineValues.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / baselineValues.length
    );

    if (std === 0) {
      return {
        isAnomaly: value !== mean,
        zScore: value !== mean ? Infinity : 0,
        deviation: value - mean,
        percentile: value < mean ? 0 : 100,
        severity: value !== mean ? "HIGH" : "LOW",
        contributingFactors: ["zero-variance baseline"],
      };
    }

    const zScore = (value - mean) / std;
    const absZ = Math.abs(zScore);
    const percentile = this.approximatePercentile(zScore);

    let severity: AnomalyResult["severity"] = "LOW";
    if (absZ >= 4) severity = "CRITICAL";
    else if (absZ >= 3) severity = "HIGH";
    else if (absZ >= 2) severity = "MEDIUM";

    return {
      isAnomaly: absZ >= 2,
      zScore,
      deviation: value - mean,
      percentile,
      severity,
      contributingFactors: this.identifyFactors(observation, value, mean),
    };
  }

  private detectIQR(
    observation: ObservationRef,
    value: number,
    baselineValues: number[]
  ): AnomalyResult {
    const sorted = [...baselineValues].sort((a, b) => a - b);
    const n = sorted.length;
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    const lower = q1 - 1.5 * iqr;
    const upper = q3 + 1.5 * iqr;

    const isAnomaly = value < lower || value > upper;
    const deviation = value - (q1 + q3) / 2;
    const zScore = iqr > 0 ? (value - (q1 + q3) / 2) / (iqr * 0.7413) : 0;
    const absZ = Math.abs(zScore);

    let severity: AnomalyResult["severity"] = "LOW";
    if (absZ >= 4) severity = "CRITICAL";
    else if (absZ >= 3) severity = "HIGH";
    else if (absZ >= 2) severity = "MEDIUM";

    return {
      isAnomaly,
      zScore,
      deviation,
      percentile: value < lower ? 0 : value > upper ? 100 : 50,
      severity,
      contributingFactors: this.identifyFactors(observation, value, (q1 + q3) / 2),
    };
  }

  private extractNumericValue(obs: ObservationRef): number {
    const payload = obs.payload as Record<string, unknown>;
    const numericKeys = Object.entries(payload).filter(
      ([, v]) => typeof v === "number"
    );
    if (numericKeys.length === 0) return 0;
    return numericKeys[0][1] as number;
  }

  private identifyFactors(
    observation: ObservationRef,
    value: number,
    baselineMean: number
  ): string[] {
    const factors: string[] = [];
    const payload = observation.payload as Record<string, unknown>;
    const deviation = Math.abs(value - baselineMean);
    const deviationRatio = baselineMean !== 0 ? deviation / Math.abs(baselineMean) : deviation;

    if (deviationRatio > 2) factors.push("extreme_value_deviation");
    if (payload.amount && (payload.amount as number) > 1000) factors.push("high_amount");
    if (observation.sourceType === "IOT_SENSOR" && deviationRatio > 3) factors.push("sensor_reading_outlier");

    return factors;
  }

  private approximatePercentile(zScore: number): number {
    const a = Math.abs(zScore);
    const p = 1 - 0.5 * Math.exp(-a * a / 2) / (0.7978845608028654 + 0.3823644376576754 * a);
    return zScore >= 0 ? p * 100 : (1 - p) * 100;
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

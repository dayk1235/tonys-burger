import {
  PatternDefinition,
  DetectionMethod,
  PatternCategory,
  ObservationRef,
  PatternDetectionResult,
} from "./PatternTypes";

const FREQUENCY_DEFINITION: PatternDefinition = {
  name: "repeated_event",
  category: "REPEATED_EVENT",
  description: "Detects events that occur repeatedly within a time window",
  detectionMethod: "FREQUENCY",
  minSupport: 3,
  confidenceThreshold: 0.5,
  timeWindowMs: 3600000,
  evaluate: (observations: readonly ObservationRef[]): PatternDetectionResult => {
    if (observations.length < 3) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const windowMs = 3600000;
    const sorted = [...observations].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const clusters: ObservationRef[][] = [];
    let currentCluster: ObservationRef[] = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const gap = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i - 1].timestamp).getTime();
      if (gap <= windowMs) {
        currentCluster.push(sorted[i]);
      } else {
        if (currentCluster.length >= 3) clusters.push(currentCluster);
        currentCluster = [sorted[i]];
      }
    }
    if (currentCluster.length >= 3) clusters.push(currentCluster);
    if (clusters.length === 0) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const totalInClusters = clusters.reduce((s, c) => s + c.length, 0);
    const strength = Math.min(1, totalInClusters / (sorted.length * 0.8));
    const confidence = Math.min(0.99, clusters.length / Math.max(1, sorted.length) * 0.5 + strength * 0.5);
    return {
      detected: true,
      strength,
      confidence,
      novelty: 1 - totalInClusters / sorted.length,
      evidence: clusters.flatMap((c) => c.map((o) => o.id)),
      metadata: { clusters: clusters.length, totalEvents: totalInClusters },
    };
  },
};

const POSITIVE_TREND_DEFINITION: PatternDefinition = {
  name: "positive_trend",
  category: "POSITIVE_TREND",
  description: "Detects sustained upward trends in numeric observation values",
  detectionMethod: "TREND_REGRESSION",
  minSupport: 5,
  confidenceThreshold: 0.6,
  timeWindowMs: 86400000,
  evaluate: (observations: readonly ObservationRef[]): PatternDetectionResult => {
    if (observations.length < 5) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const sorted = [...observations].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const values = sorted.map((o) => {
      const p = o.payload as Record<string, unknown>;
      const nums = Object.entries(p).filter(([, v]) => typeof v === "number");
      return nums.length > 0 ? (nums[0][1] as number) : 0;
    });
    const n = values.length;
    const indices = values.map((_, i) => i);
    const sumX = indices.reduce((s, x) => s + x, 0);
    const sumY = values.reduce((s, y) => s + y, 0);
    const sumXY = indices.reduce((s, i) => s + i * values[i], 0);
    const sumX2 = indices.reduce((s, x) => s + x * x, 0);
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    const meanY = sumY / n;
    const ssRes = values.reduce((s, y, i) => s + Math.pow(y - (slope * indices[i] + intercept), 2), 0);
    const ssTot = values.reduce((s, y) => s + Math.pow(y - meanY, 2), 0);
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;
    const detected = slope > 0 && rSquared > 0.3;
    return {
      detected,
      strength: rSquared,
      confidence: Math.min(0.99, rSquared * 0.7 + Math.min(1, n / 20) * 0.3),
      novelty: detected ? 0.3 : 0,
      evidence: sorted.map((o) => o.id),
      metadata: { slope, intercept, rSquared, direction: "POSITIVE" },
    };
  },
};

const NEGATIVE_TREND_DEFINITION: PatternDefinition = {
  name: "negative_trend",
  category: "NEGATIVE_TREND",
  description: "Detects sustained downward trends in numeric observation values",
  detectionMethod: "TREND_REGRESSION",
  minSupport: 5,
  confidenceThreshold: 0.6,
  timeWindowMs: 86400000,
  evaluate: (observations: readonly ObservationRef[]): PatternDetectionResult => {
    if (observations.length < 5) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const sorted = [...observations].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const values = sorted.map((o) => {
      const p = o.payload as Record<string, unknown>;
      const nums = Object.entries(p).filter(([, v]) => typeof v === "number");
      return nums.length > 0 ? (nums[0][1] as number) : 0;
    });
    const n = values.length;
    const indices = values.map((_, i) => i);
    const sumX = indices.reduce((s, x) => s + x, 0);
    const sumY = values.reduce((s, y) => s + y, 0);
    const sumXY = indices.reduce((s, i) => s + i * values[i], 0);
    const sumX2 = indices.reduce((s, x) => s + x * x, 0);
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) {
      return { detected: false, strength: 0, confidence: 0, novelty: 0, evidence: [], metadata: {} };
    }
    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;
    const meanY = sumY / n;
    const ssRes = values.reduce((s, y, i) => s + Math.pow(y - (slope * indices[i] + intercept), 2), 0);
    const ssTot = values.reduce((s, y) => s + Math.pow(y - meanY, 2), 0);
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;
    const detected = slope < 0 && rSquared > 0.3;
    return {
      detected,
      strength: rSquared,
      confidence: Math.min(0.99, rSquared * 0.7 + Math.min(1, n / 20) * 0.3),
      novelty: detected ? 1 - rSquared : 0,
      evidence: sorted.map((o) => o.id),
      metadata: { slope, intercept, rSquared, direction: "NEGATIVE" },
    };
  },
};

export const DEFAULT_PATTERN_DEFINITIONS: readonly PatternDefinition[] = [
  FREQUENCY_DEFINITION,
  POSITIVE_TREND_DEFINITION,
  NEGATIVE_TREND_DEFINITION,
];

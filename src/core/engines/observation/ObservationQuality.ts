/**
 * @file ObservationQuality.ts
 * @description Evaluates observation quality across seven dimensions
 * (Accuracy, Precision, Freshness, Completeness, Consistency, Uniqueness, Traceability)
 * and calculates the final confidence score.
 */

import { Observation, ObservationCategory } from "./ObservationTypes";

/**
 * Detailed grading score for each of the 7 quality dimensions.
 */
export interface QualityProfile {
  accuracy: number;
  precision: number;
  freshness: number;
  completeness: number;
  consistency: number;
  uniqueness: number;
  traceability: number;
}

/**
 * Quality Assessment Engine.
 */
export class ObservationQuality {
  
  /**
   * Evaluates the observation across all 7 dimensions and computes the overall confidence score.
   */
  public evaluateQuality(observation: Observation, recentObservations: Observation[] = []): {
    profile: QualityProfile;
    confidenceScore: number;
  } {
    const traceability = this.gradeTraceability(observation);
    const completeness = this.gradeCompleteness(observation);
    const freshness = this.gradeFreshness(observation);
    const precision = this.gradePrecision(observation);
    const uniqueness = this.gradeUniqueness(observation, recentObservations);
    const consistency = this.gradeConsistency(observation, recentObservations);
    const accuracy = this.gradeAccuracy(observation, recentObservations);

    const profile: QualityProfile = {
      accuracy,
      precision,
      freshness,
      completeness,
      consistency,
      uniqueness,
      traceability
    };

    // Calculate weighted confidence score
    // Invariants: confidence is never 0 and never absolute (1.0). Limit to [0.01, 0.99]
    const rawScore = 
      accuracy * 0.25 +
      traceability * 0.15 +
      freshness * 0.15 +
      consistency * 0.15 +
      completeness * 0.10 +
      precision * 0.10 +
      uniqueness * 0.10;

    // Confidence is bounded by the trustworthiness of the source
    const boundedScore = rawScore * observation.source.trustScore;

    // Apply bounds: strictly between 0 and 1
    const confidenceScore = Math.max(0.01, Math.min(0.99, boundedScore));

    return {
      profile,
      confidenceScore
    };
  }

  private gradeTraceability(obs: Observation): number {
    if (!obs.source || !obs.source.id) return 0.1;
    // Source trust score directly weights traceability
    return Math.max(0.1, Math.min(1.0, obs.source.trustScore));
  }

  private gradeCompleteness(obs: Observation): number {
    let score = 0;
    const ctx = obs.context;
    
    if (ctx.spatial && ctx.spatial.locationId && ctx.spatial.zone !== "unknown") score += 0.2;
    if (ctx.temporal && ctx.temporal.timeOfDay && ctx.temporal.dayOfWeek) score += 0.2;
    if (ctx.behavior && ctx.behavior.actionType) score += 0.2;
    if (ctx.operational && ctx.operational.staffingLevel) score += 0.2;
    if (ctx.environmental && (ctx.environmental.weatherCondition || ctx.environmental.temperatureCelsius !== undefined)) score += 0.2;
    
    return Math.max(0.1, score);
  }

  private gradeFreshness(obs: Observation): number {
    const occurrenceTime = new Date(obs.timestamp).getTime();
    const captureTime = new Date(obs.captureTime).getTime();
    
    // Latency is the delay between occurrence and system capture
    const latencyMs = Math.max(0, captureTime - occurrenceTime);
    
    let freshnessThresholdMs = 24 * 60 * 60 * 1000; // Default 24 hours
    
    // Domain-specific latency thresholds
    switch (obs.category) {
      case ObservationCategory.OPERATIONAL:
        freshnessThresholdMs = 30 * 60 * 1000; // 30 minutes
        break;
      case ObservationCategory.ENVIRONMENTAL:
        freshnessThresholdMs = 2 * 60 * 60 * 1000; // 2 hours
        break;
      case ObservationCategory.FINANCIAL:
        freshnessThresholdMs = 12 * 60 * 60 * 1000; // 12 hours
        break;
      case ObservationCategory.INVENTORY:
        freshnessThresholdMs = 4 * 60 * 60 * 1000; // 4 hours
        break;
      default:
        break;
    }

    if (latencyMs <= freshnessThresholdMs) {
      return 1.0;
    } else {
      // Exponential decay relative to freshness threshold violation
      const decayRatio = latencyMs / freshnessThresholdMs;
      return Math.max(0.1, Math.exp(-0.5 * decayRatio));
    }
  }

  private gradePrecision(obs: Observation): number {
    const payloadKeysCount = Object.keys(obs.payload).length;
    if (payloadKeysCount === 0) return 0.1;
    // More detailed payloads get higher precision scores up to a point
    return Math.min(1.0, 0.4 + payloadKeysCount * 0.15);
  }

  private gradeUniqueness(obs: Observation, recent: Observation[]): number {
    // Check if duplicate of recent observations
    for (const other of recent) {
      if (other.id === obs.id) continue;
      
      const timeDiff = Math.abs(new Date(other.timestamp).getTime() - new Date(obs.timestamp).getTime());
      
      // Duplicate detection parameters: source, time, value similarity
      if (
        other.source.id === obs.source.id &&
        timeDiff < 2000 && // 2 seconds
        JSON.stringify(other.payload) === JSON.stringify(obs.payload)
      ) {
        return 0.1; // Duplicate detected
      }
    }
    return 1.0;
  }

  private gradeConsistency(obs: Observation, recent: Observation[]): number {
    // Check for direct contradictions (e.g. same POS device, same time, conflicting sales total)
    for (const other of recent) {
      if (other.id === obs.id) continue;
      
      const timeDiff = Math.abs(new Date(other.timestamp).getTime() - new Date(obs.timestamp).getTime());
      if (
        other.source.id === obs.source.id &&
        timeDiff < 5000 && // 5 seconds
        other.category === obs.category
      ) {
        // Look for business contradictions
        if (obs.category === ObservationCategory.FINANCIAL) {
          const otherAmt = other.payload.amount || other.payload.revenue;
          const obsAmt = obs.payload.amount || obs.payload.revenue;
          if (otherAmt !== undefined && obsAmt !== undefined && otherAmt !== obsAmt) {
            return 0.2; // High contradiction detected
          }
        }
      }
    }
    return 1.0;
  }

  private gradeAccuracy(obs: Observation, recent: Observation[]): number {
    // Check cross-source validation. If another independent source observed a similar fact, accuracy increases.
    // Otherwise, standalone observations begin at 0.9 (which is high-confidence but leaves room).
    let supportFound = false;
    for (const other of recent) {
      if (other.id === obs.id || other.source.id === obs.source.id) continue; // must be from a different source
      
      const timeDiff = Math.abs(new Date(other.timestamp).getTime() - new Date(obs.timestamp).getTime());
      if (
        other.category === obs.category &&
        timeDiff < 10 * 60 * 1000 && // 10 minutes
        JSON.stringify(other.payload) === JSON.stringify(obs.payload)
      ) {
        supportFound = true;
        break;
      }
    }
    
    return supportFound ? 0.98 : 0.90;
  }
}

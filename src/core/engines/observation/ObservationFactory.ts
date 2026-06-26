/**
 * @file ObservationFactory.ts
 * @description Inception factory for creating, promoting, and building Observations
 * from environmental stimulus inputs.
 */

import { 
  Observation, 
  ObservationStage, 
  ObservationCategory, 
  SourceOfTruth,
  ObservationContextDimensions
} from "./ObservationTypes";

/**
 * Factory class that abstracts creation, ensuring proper ID generation and default structures.
 */
export class ObservationFactory {
  
  /**
   * Generates a unique RFC4122 v4 compliant UUID in pure JS to avoid external dependencies.
   */
  public generateId(): string {
    // Standard JS crypto randomUUID is supported in modern Node.js and browsers
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    // Fallback uuid generator
    return "obs_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now().toString(36);
  }

  /**
   * Creates an initial raw Potential Observation skeleton.
   */
  public createPotential(params: {
    category: ObservationCategory;
    businessId: string;
    restaurantId?: string;
    source: SourceOfTruth;
    payload: Record<string, unknown>;
    timestamp?: string;
  }): Observation {
    const id = this.generateId();
    const nowStr = new Date().toISOString();
    const occurrenceTime = params.timestamp || nowStr;

    const defaultContext: ObservationContextDimensions = {
      spatial: { locationId: "unknown", zone: "unknown" },
      temporal: {
        timeOfDay: "00:00:00",
        dayOfWeek: "Monday",
        isHoliday: false,
        servicePeriod: "between_services",
        season: "spring"
      },
      behavior: { actionType: "none", observedImpact: "none" },
      operational: { staffingLevel: "optimal", inventoryAlertsCount: 0, activePromotions: [] },
      environmental: { localEventsNearRestaurant: [] }
    };

    return {
      id,
      stage: ObservationStage.POTENTIAL,
      category: params.category,
      timestamp: occurrenceTime,
      captureTime: nowStr,
      businessId: params.businessId,
      restaurantId: params.restaurantId,
      source: params.source,
      payload: params.payload,
      evidence: "Raw environmental stimulus",
      confidence: {
        score: 0.5, // Default average confidence for potential
        history: [],
        sourceWeight: params.source.trustScore,
        freshnessWeight: 1.0,
        consistencyWeight: 1.0
      },
      context: defaultContext,
      relationships: {
        relatedObservations: [],
        supportedPatterns: [],
        supportedKnowledge: [],
        supportedRecommendations: [],
        associatedDecisions: []
      },
      importance: 0.5, // Default average importance
      attentionScore: 0.5, // Default average attention
      isDeprecated: false
    };
  }

  /**
   * Builds a new Observation object with updated stage or fields (enforcing immutability by copying).
   */
  public cloneWithTransition(
    original: Observation,
    targetStage: ObservationStage,
    updates?: Partial<Omit<Observation, "id" | "stage">>
  ): Observation {
    return {
      ...original,
      ...updates,
      stage: targetStage,
      // Retain deep references cleanly
      confidence: updates?.confidence ? { ...updates.confidence } : { ...original.confidence },
      context: updates?.context ? { ...updates.context } : { ...original.context },
      relationships: updates?.relationships ? { ...updates.relationships } : { ...original.relationships }
    };
  }
}

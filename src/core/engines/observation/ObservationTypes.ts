/**
 * @file ObservationTypes.ts
 * @description Core types and interfaces for the Restaurant OS Observation System.
 * Defines the atomic cognitive unit structures, lifecycle stages, context dimensions,
 * classifications, and provenance fields.
 */

/**
 * Stages of the Observation Lifecycle.
 * Enforces forward-only transitions in the cognitive pipeline.
 */
export enum ObservationStage {
  POTENTIAL = "POTENTIAL",
  CANDIDATE = "CANDIDATE",
  VERIFIED = "VERIFIED",
  CONTEXTUALIZED = "CONTEXTUALIZED",
  HISTORICAL = "HISTORICAL",
  PATTERN_EVIDENCE = "PATTERN_EVIDENCE",
  KNOWLEDGE_EVIDENCE = "KNOWLEDGE_EVIDENCE",
  ARCHIVED = "ARCHIVED"
}

/**
 * Primary categories of observations mapping to the Business Ontology.
 */
export enum ObservationCategory {
  OPERATIONAL = "OPERATIONAL",
  BEHAVIORAL = "BEHAVIORAL",
  ENVIRONMENTAL = "ENVIRONMENTAL",
  FINANCIAL = "FINANCIAL",
  TEMPORAL = "TEMPORAL",
  CUSTOMER = "CUSTOMER",
  EMPLOYEE = "EMPLOYEE",
  INVENTORY = "INVENTORY",
  SUPPLY_CHAIN = "SUPPLY_CHAIN",
  EXPERIENCE = "EXPERIENCE"
}

/**
 * Source of Truth description indicating provenance and origin of the observed stimulus.
 */
export interface SourceOfTruth {
  id: string;
  name: string;
  type: "POS" | "IOT_SENSOR" | "HUMAN_INPUT" | "ENVIRONMENT_FEED" | "SYSTEM_LOG" | "INFERENCE_ENGINE";
  trustScore: number; // Normalized [0, 1] trust value representing reliability
}

/**
 * Historical record of confidence calibration for auditing and learning.
 */
export interface ConfidenceHistoryRecord {
  timestamp: string;
  previousConfidence: number;
  newConfidence: number;
  reason: string;
}

/**
 * Encloses the uncertainty calibration metric of the observation.
 */
export interface ConfidenceAssessment {
  score: number; // Value between 0 (exclusive) and 1 (exclusive) representing certainty
  history: ConfidenceHistoryRecord[];
  sourceWeight: number;
  freshnessWeight: number;
  consistencyWeight: number;
}

/**
 * Spatial context detailing where the observed fact occurred.
 */
export interface SpatialContext {
  locationId: string;
  zone: "dining_room" | "kitchen" | "bar" | "takeout_counter" | "delivery_zone" | "offsite" | "unknown";
  coordinates?: {
    x: number;
    y: number;
  };
}

/**
 * Temporal context positioning the observation within the business rhythm.
 */
export interface TemporalContext {
  timeOfDay: string; // HH:MM:SS format
  dayOfWeek: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isHoliday: boolean;
  servicePeriod: "breakfast" | "lunch" | "dinner" | "late_night" | "between_services";
  season: "spring" | "summer" | "autumn" | "winter";
}

/**
 * Behavioral context detailing observable actions of human actors.
 */
export interface BehaviorContext {
  actorId?: string;
  actorType?: "customer" | "employee" | "owner" | "system";
  actionType: string;
  observedImpact: string;
}

/**
 * Operational context reflecting the internal state of the restaurant during the observation.
 */
export interface OperationalContext {
  activeMenuId?: string;
  staffingLevel: "understaffed" | "optimal" | "overstaffed";
  inventoryAlertsCount: number;
  activePromotions: string[];
}

/**
 * Environmental context reflecting external variables influencing outcomes.
 */
export interface EnvironmentalContext {
  temperatureCelsius?: number;
  weatherCondition?: "sunny" | "rainy" | "snowy" | "cloudy" | "stormy" | "windy";
  localEventsNearRestaurant: string[];
}

/**
 * Unified context dimensions required for Stage 4 (Contextualized) observations.
 */
export interface ObservationContextDimensions {
  spatial: SpatialContext;
  temporal: TemporalContext;
  behavior: BehaviorContext;
  operational: OperationalContext;
  environmental: EnvironmentalContext;
}

/**
 * Relationships connecting this observation to other cognitive entities.
 */
export interface ObservationRelationships {
  relatedObservations: string[]; // Observation IDs
  supportedPatterns: string[]; // Pattern IDs
  supportedKnowledge: string[]; // Knowledge IDs
  supportedRecommendations: string[]; // Recommendation IDs
  associatedDecisions: string[]; // Decision IDs
}

/**
 * The atomic, verified, immutable cognitive unit of Restaurant OS.
 */
export interface Observation {
  readonly id: string;
  readonly stage: ObservationStage;
  readonly category: ObservationCategory;
  readonly timestamp: string; // ISO 8601 occurrence timestamp
  readonly captureTime: string; // ISO 8601 capture timestamp
  readonly businessId: string;
  readonly restaurantId?: string;
  readonly source: SourceOfTruth;
  readonly payload: Record<string, unknown>; // Schema-less verified value payload
  readonly evidence: string; // Verification reference or justification text
  readonly confidence: ConfidenceAssessment;
  readonly context: ObservationContextDimensions;
  readonly relationships: ObservationRelationships;
  readonly importance: number; // Normalized importance [0, 1] relative to business outcomes
  readonly attentionScore: number; // Normalized priority [0, 1] assigned at ingestion
  readonly isDeprecated: boolean; // Immutability enforcement: marked deprecated instead of deleted
  readonly deprecationReason?: string;
  readonly correctedByObservationId?: string; // Pointer to replacement observation
}

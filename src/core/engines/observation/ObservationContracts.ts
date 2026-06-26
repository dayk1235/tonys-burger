/**
 * @file ObservationContracts.ts
 * @description Defines the contracts and interface requirements for cognitive engines
 * and their integration into the Restaurant OS Runtime.
 */

import { Observation, ObservationCategory } from "./ObservationTypes";

/**
 * State of a Cognitive Engine within the runtime.
 */
export type EngineState = "INITIALIZED" | "RUNNING" | "PAUSED" | "STOPPED" | "RECOVERING";

/**
 * The standard contract that every Cognitive Engine in Restaurant OS must implement.
 */
export interface CognitiveEngine {
  readonly name: string;
  readonly classification: string;
  readonly contractVersion: string;
  
  start(): Promise<void>;
  stop(): Promise<void>;
  getState(): EngineState;
  
  /**
   * Accepts input from other engines or sources.
   * Enforces rejection gates.
   */
  receiveInput(input: Record<string, unknown>, options?: Record<string, unknown>): Promise<unknown>;
}

/**
 * Interface for the Runtime Registry where all engines are registered.
 */
export interface RuntimeRegistry {
  registerEngine(engine: CognitiveEngine): Promise<void>;
  deregisterEngine(engineName: string): Promise<void>;
  getEngine(engineName: string): CognitiveEngine | undefined;
}

/**
 * Interface for scheduling tasks or periodic jobs within the Runtime.
 */
export interface RuntimeScheduler {
  scheduleRecurring(jobId: string, cron: string, task: () => Promise<void>): Promise<void>;
  cancelScheduled(jobId: string): Promise<void>;
}

/**
 * Interface for the Runtime Event Bus to emit and subscribe to cognitive events.
 */
export interface RuntimeEventBus {
  emit(eventName: string, payload: Record<string, unknown>): Promise<void>;
  subscribe(eventName: string, handler: (payload: Record<string, unknown>) => Promise<void>): Promise<void>;
}

/**
 * Interface for the Context Bus to query current active spatial, temporal, operational, 
 * or environmental variables of the restaurant.
 */
export interface ContextBus {
  queryContext(businessId: string, restaurantId?: string): Promise<{
    spatialZone: string;
    isHoliday: boolean;
    servicePeriod: "breakfast" | "lunch" | "dinner" | "late_night" | "between_services";
    season: "spring" | "summer" | "autumn" | "winter";
    staffingLevel: "understaffed" | "optimal" | "overstaffed";
    inventoryAlertsCount: number;
    activePromotions: string[];
    temperatureCelsius?: number;
    weatherCondition?: "sunny" | "rainy" | "snowy" | "cloudy" | "stormy" | "windy";
  }>;
}

/**
 * Audit Pipeline interface to persist the step-by-step trace of cognitive operations.
 */
export interface AuditPipeline {
  recordLog(engineName: string, action: string, details: Record<string, unknown>): Promise<void>;
  recordStateChange(engineName: string, fromState: string, toState: string): Promise<void>;
}

/**
 * Recovery Pipeline interface to handle cognitive failures, contradiction resolutions,
 * and cascading audits for corrected observations.
 */
export interface RecoveryPipeline {
  registerFailure(engineName: string, errorName: string, errorMessage: string, stack?: string): Promise<string>; // returns failureId
  initiateRecovery(failureId: string, recoveryAction: () => Promise<void>): Promise<boolean>;
  triggerCascadingAudit(deprecatedObservationId: string, correctedObservationId: string): Promise<void>;
}

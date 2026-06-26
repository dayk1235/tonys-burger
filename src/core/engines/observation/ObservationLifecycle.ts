/**
 * @file ObservationLifecycle.ts
 * @description State machine coordinator for the Observation Lifecycle.
 * Enforces forward-only transitions and triggers lifecycle event hooks.
 */

import { ObservationStage } from "./ObservationTypes";
import { InvalidLifecycleTransitionError } from "./ObservationErrors";

/**
 * Lifecycle controller ensuring transition invariants are strictly maintained.
 */
export class ObservationLifecycle {
  
  // Defines allowed transitions
  private static readonly ALLOWED_TRANSITIONS: Record<ObservationStage, Set<ObservationStage>> = {
    [ObservationStage.POTENTIAL]: new Set([ObservationStage.CANDIDATE]),
    [ObservationStage.CANDIDATE]: new Set([ObservationStage.VERIFIED]),
    [ObservationStage.VERIFIED]: new Set([ObservationStage.CONTEXTUALIZED, ObservationStage.HISTORICAL]),
    [ObservationStage.CONTEXTUALIZED]: new Set([ObservationStage.HISTORICAL]),
    [ObservationStage.HISTORICAL]: new Set([ObservationStage.PATTERN_EVIDENCE, ObservationStage.ARCHIVED]),
    [ObservationStage.PATTERN_EVIDENCE]: new Set([ObservationStage.KNOWLEDGE_EVIDENCE, ObservationStage.ARCHIVED]),
    [ObservationStage.KNOWLEDGE_EVIDENCE]: new Set([ObservationStage.ARCHIVED]),
    [ObservationStage.ARCHIVED]: new Set([ObservationStage.PATTERN_EVIDENCE]) // Reactivation case
  };

  /**
   * Enforces transition invariants, throwing if regression or skip occurs.
   */
  public validateTransition(current: ObservationStage, next: ObservationStage): void {
    if (current === next) return; // Self-transition is a no-op
    
    const allowed = ObservationLifecycle.ALLOWED_TRANSITIONS[current];
    if (!allowed || !allowed.has(next)) {
      throw new InvalidLifecycleTransitionError(
        `Invalid lifecycle transition from ${current} to ${next}. Lifecycle must only progress forward.`
      );
    }
  }

  /**
   * Evaluates if the observation can be promoted to the target stage.
   */
  public canTransition(current: ObservationStage, next: ObservationStage): boolean {
    if (current === next) return true;
    const allowed = ObservationLifecycle.ALLOWED_TRANSITIONS[current];
    return allowed ? allowed.has(next) : false;
  }
}

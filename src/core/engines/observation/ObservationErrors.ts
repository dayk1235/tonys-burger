/**
 * @file ObservationErrors.ts
 * @description Custom error definitions for the Restaurant OS Observation Engine.
 * Enforces cognitive invariants, boundary limitations, verification rules, and immutability.
 */

/**
 * Base error class for all Observation System cognitive errors.
 */
export class ObservationError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Thrown when verification fails for a Candidate Observation.
 */
export class VerificationError extends ObservationError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

/**
 * Thrown when an Observation fails to meet configured quality thresholds.
 */
export class QualityThresholdViolation extends ObservationError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

/**
 * Thrown when an action violates the declared boundary of the Perception Engine.
 * E.g., trying to generate predictions, opinions, or judgments.
 */
export class BoundaryValidationError extends ObservationError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

/**
 * Thrown when there is an attempt to modify an immutable Observation.
 */
export class ImmutabilityViolationError extends ObservationError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

/**
 * Thrown when a lifecycle transition is invalid.
 */
export class InvalidLifecycleTransitionError extends ObservationError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, metadata);
  }
}

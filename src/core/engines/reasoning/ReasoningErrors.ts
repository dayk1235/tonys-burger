export class ReasoningError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "ReasoningError";
    Object.setPrototypeOf(this, ReasoningError.prototype);
  }
}

export class ReasoningBoundaryError extends ReasoningError {
  constructor(reason: string) {
    super(`Reasoning boundary violation: ${reason}. Reasoning never decides, executes, or predicts.`);
    this.name = "ReasoningBoundaryError";
    Object.setPrototypeOf(this, ReasoningBoundaryError.prototype);
  }
}

export class InvalidReasoningLifecycleTransitionError extends ReasoningError {
  constructor(current: string, target: string) {
    super(`Invalid reasoning lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidReasoningLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidReasoningLifecycleTransitionError.prototype);
  }
}

export class ReasoningValidationError extends ReasoningError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Reasoning validation failed: ${reason}`, details);
    this.name = "ReasoningValidationError";
    Object.setPrototypeOf(this, ReasoningValidationError.prototype);
  }
}

export class InsufficientEvidenceError extends ReasoningError {
  constructor(reasoningId: string, reason: string) {
    super(`Insufficient evidence for reasoning "${reasoningId}": ${reason}`);
    this.name = "InsufficientEvidenceError";
    Object.setPrototypeOf(this, InsufficientEvidenceError.prototype);
  }
}

export class ConsistencyViolationError extends ReasoningError {
  constructor(reasoningId: string, details: string) {
    super(`Consistency violation in reasoning "${reasoningId}": ${details}`);
    this.name = "ConsistencyViolationError";
    Object.setPrototypeOf(this, ConsistencyViolationError.prototype);
  }
}

export class ConfidenceCalibrationError extends ReasoningError {
  constructor(reasoningId: string, reason: string) {
    super(`Confidence calibration error for reasoning "${reasoningId}": ${reason}`);
    this.name = "ConfidenceCalibrationError";
    Object.setPrototypeOf(this, ConfidenceCalibrationError.prototype);
  }
}

export class HypothesisGenerationError extends ReasoningError {
  constructor(reasoningId: string, reason: string) {
    super(`Hypothesis generation failed for reasoning "${reasoningId}": ${reason}`);
    this.name = "HypothesisGenerationError";
    Object.setPrototypeOf(this, HypothesisGenerationError.prototype);
  }
}

export class ReasoningNotFoundError extends ReasoningError {
  constructor(reasoningId: string) {
    super(`Reasoning not found: "${reasoningId}"`);
    this.name = "ReasoningNotFoundError";
    Object.setPrototypeOf(this, ReasoningNotFoundError.prototype);
  }
}

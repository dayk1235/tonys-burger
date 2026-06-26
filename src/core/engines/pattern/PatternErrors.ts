export class PatternError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "PatternError";
    Object.setPrototypeOf(this, PatternError.prototype);
  }
}

export class InvalidLifecycleTransitionError extends PatternError {
  constructor(current: string, target: string) {
    super(`Invalid lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidLifecycleTransitionError.prototype);
  }
}

export class PatternValidationError extends PatternError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Pattern validation failed: ${reason}`, details);
    this.name = "PatternValidationError";
    Object.setPrototypeOf(this, PatternValidationError.prototype);
  }
}

export class InsufficientEvidenceError extends PatternError {
  constructor(patternName: string, required: number, actual: number) {
    super(`Insufficient evidence for pattern "${patternName}": need ${required}, have ${actual}`);
    this.name = "InsufficientEvidenceError";
    Object.setPrototypeOf(this, InsufficientEvidenceError.prototype);
  }
}

export class DetectionFailedError extends PatternError {
  constructor(method: string, reason: string) {
    super(`Detection method "${method}" failed: ${reason}`);
    this.name = "DetectionFailedError";
    Object.setPrototypeOf(this, DetectionFailedError.prototype);
  }
}

export class PatternConflictError extends PatternError {
  constructor(patternId: string, conflictingPatternId: string, reason: string) {
    super(`Pattern "${patternId}" conflicts with "${conflictingPatternId}": ${reason}`);
    this.name = "PatternConflictError";
    Object.setPrototypeOf(this, PatternConflictError.prototype);
  }
}

export class PatternMergeError extends PatternError {
  constructor(source: string, target: string, reason: string) {
    super(`Cannot merge "${source}" into "${target}": ${reason}`);
    this.name = "PatternMergeError";
    Object.setPrototypeOf(this, PatternMergeError.prototype);
  }
}

export class CorrelationError extends PatternError {
  constructor(reason: string) {
    super(`Correlation detection failed: ${reason}`);
    this.name = "CorrelationError";
    Object.setPrototypeOf(this, CorrelationError.prototype);
  }
}

export class TrendDetectionError extends PatternError {
  constructor(reason: string) {
    super(`Trend detection failed: ${reason}`);
    this.name = "TrendDetectionError";
    Object.setPrototypeOf(this, TrendDetectionError.prototype);
  }
}

export class AnomalyDetectionError extends PatternError {
  constructor(reason: string) {
    super(`Anomaly detection failed: ${reason}`);
    this.name = "AnomalyDetectionError";
    Object.setPrototypeOf(this, AnomalyDetectionError.prototype);
  }
}

export class SequenceDetectionError extends PatternError {
  constructor(reason: string) {
    super(`Sequence detection failed: ${reason}`);
    this.name = "SequenceDetectionError";
    Object.setPrototypeOf(this, SequenceDetectionError.prototype);
  }
}

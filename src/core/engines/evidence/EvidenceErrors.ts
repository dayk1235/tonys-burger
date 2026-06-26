export class EvidenceError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "EvidenceError";
    Object.setPrototypeOf(this, EvidenceError.prototype);
  }
}

export class InvalidLifecycleTransitionError extends EvidenceError {
  constructor(current: string, target: string) {
    super(`Invalid evidence lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidLifecycleTransitionError.prototype);
  }
}

export class EvidenceValidationError extends EvidenceError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Evidence validation failed: ${reason}`, details);
    this.name = "EvidenceValidationError";
    Object.setPrototypeOf(this, EvidenceValidationError.prototype);
  }
}

export class InsufficientSupportError extends EvidenceError {
  constructor(patternId: string, required: number, actual: number) {
    super(`Insufficient support for pattern "${patternId}": need ${required} supporting refs, have ${actual}`);
    this.name = "InsufficientSupportError";
    Object.setPrototypeOf(this, InsufficientSupportError.prototype);
  }
}

export class ContradictionError extends EvidenceError {
  constructor(patternId: string, reason: string) {
    super(`Contradiction detected for pattern "${patternId}": ${reason}`);
    this.name = "ContradictionError";
    Object.setPrototypeOf(this, ContradictionError.prototype);
  }
}

export class SourceReliabilityError extends EvidenceError {
  constructor(sourceType: string, trustScore: number) {
    super(`Source reliability insufficient: "${sourceType}" has trust score ${trustScore}`);
    this.name = "SourceReliabilityError";
    Object.setPrototypeOf(this, SourceReliabilityError.prototype);
  }
}

export class DuplicateEvidenceError extends EvidenceError {
  constructor(patternId: string, evidenceId: string) {
    super(`Duplicate evidence for pattern "${patternId}": existing evidence "${evidenceId}"`);
    this.name = "DuplicateEvidenceError";
    Object.setPrototypeOf(this, DuplicateEvidenceError.prototype);
  }
}

export class ProvenanceError extends EvidenceError {
  constructor(reason: string) {
    super(`Provenance error: ${reason}`);
    this.name = "ProvenanceError";
    Object.setPrototypeOf(this, ProvenanceError.prototype);
  }
}

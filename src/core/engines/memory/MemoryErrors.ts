export class MemoryError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "MemoryError";
    Object.setPrototypeOf(this, MemoryError.prototype);
  }
}

export class InvalidMemoryLifecycleTransitionError extends MemoryError {
  constructor(current: string, target: string) {
    super(`Invalid memory lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidMemoryLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidMemoryLifecycleTransitionError.prototype);
  }
}

export class MemoryValidationError extends MemoryError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Memory validation failed: ${reason}`, details);
    this.name = "MemoryValidationError";
    Object.setPrototypeOf(this, MemoryValidationError.prototype);
  }
}

export class MemoryNotFoundError extends MemoryError {
  constructor(memoryId: string) {
    super(`Memory not found: "${memoryId}"`);
    this.name = "MemoryNotFoundError";
    Object.setPrototypeOf(this, MemoryNotFoundError.prototype);
  }
}

export class DuplicateMemoryError extends MemoryError {
  constructor(evidenceId: string, existingId: string) {
    super(`Duplicate memory for evidence "${evidenceId}": existing memory "${existingId}"`);
    this.name = "DuplicateMemoryError";
    Object.setPrototypeOf(this, DuplicateMemoryError.prototype);
  }
}

export class MemoryStrengthError extends MemoryError {
  constructor(memoryId: string, reason: string) {
    super(`Memory strength operation failed for "${memoryId}": ${reason}`);
    this.name = "MemoryStrengthError";
    Object.setPrototypeOf(this, MemoryStrengthError.prototype);
  }
}

export class MemoryForgettingError extends MemoryError {
  constructor(memoryId: string, reason: string) {
    super(`Memory forgetting failed for "${memoryId}": ${reason}`);
    this.name = "MemoryForgettingError";
    Object.setPrototypeOf(this, MemoryForgettingError.prototype);
  }
}

export class MemoryMergeError extends MemoryError {
  constructor(ids: string[], reason: string) {
    super(`Memory merge failed for [${ids.join(", ")}]: ${reason}`);
    this.name = "MemoryMergeError";
    Object.setPrototypeOf(this, MemoryMergeError.prototype);
  }
}

export class MemoryCompressionError extends MemoryError {
  constructor(memoryId: string, reason: string) {
    super(`Memory compression failed for "${memoryId}": ${reason}`);
    this.name = "MemoryCompressionError";
    Object.setPrototypeOf(this, MemoryCompressionError.prototype);
  }
}

export class MemoryAssociationError extends MemoryError {
  constructor(fromId: string, toId: string, reason: string) {
    super(`Memory association failed between "${fromId}" and "${toId}": ${reason}`);
    this.name = "MemoryAssociationError";
    Object.setPrototypeOf(this, MemoryAssociationError.prototype);
  }
}

export class AttentionError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "AttentionError";
    Object.setPrototypeOf(this, AttentionError.prototype);
  }
}

export class InvalidAttentionLifecycleTransitionError extends AttentionError {
  constructor(current: string, target: string) {
    super(`Invalid attention lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidAttentionLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidAttentionLifecycleTransitionError.prototype);
  }
}

export class AttentionValidationError extends AttentionError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Attention validation failed: ${reason}`, details);
    this.name = "AttentionValidationError";
    Object.setPrototypeOf(this, AttentionValidationError.prototype);
  }
}

export class AttentionNotFoundError extends AttentionError {
  constructor(attentionId: string) {
    super(`Attention not found: "${attentionId}"`);
    this.name = "AttentionNotFoundError";
    Object.setPrototypeOf(this, AttentionNotFoundError.prototype);
  }
}

export class DuplicateAttentionError extends AttentionError {
  constructor(sourceId: string, existingId: string) {
    super(`Duplicate attention for source "${sourceId}": existing "${existingId}"`);
    this.name = "DuplicateAttentionError";
    Object.setPrototypeOf(this, DuplicateAttentionError.prototype);
  }
}

export class AttentionBudgetExhaustedError extends AttentionError {
  constructor(available: number, requested: number) {
    super(`Attention budget exhausted: available ${available.toFixed(3)} < requested ${requested.toFixed(3)}`);
    this.name = "AttentionBudgetExhaustedError";
    Object.setPrototypeOf(this, AttentionBudgetExhaustedError.prototype);
  }
}

export class AttentionStarvationError extends AttentionError {
  constructor(attentionId: string, waitTime: number) {
    super(`Attention starvation detected for "${attentionId}": waiting ${waitTime}ms`);
    this.name = "AttentionStarvationError";
    Object.setPrototypeOf(this, AttentionStarvationError.prototype);
  }
}

export class AttentionInterruptionError extends AttentionError {
  constructor(attentionId: string, reason: string) {
    super(`Attention interruption failed for "${attentionId}": ${reason}`);
    this.name = "AttentionInterruptionError";
    Object.setPrototypeOf(this, AttentionInterruptionError.prototype);
  }
}

export class AttentionAllocationError extends AttentionError {
  constructor(attentionId: string, reason: string) {
    super(`Attention allocation failed for "${attentionId}": ${reason}`);
    this.name = "AttentionAllocationError";
    Object.setPrototypeOf(this, AttentionAllocationError.prototype);
  }
}

export class AttentionPriorityError extends AttentionError {
  constructor(attentionId: string, reason: string) {
    super(`Attention priority error for "${attentionId}": ${reason}`);
    this.name = "AttentionPriorityError";
    Object.setPrototypeOf(this, AttentionPriorityError.prototype);
  }
}

export class AttentionBudgetExceededError extends AttentionError {
  constructor(budget: number, requested: number) {
    super(`Attention budget exceeded: ${requested} > ${budget}`);
    this.name = "AttentionBudgetExceededError";
    Object.setPrototypeOf(this, AttentionBudgetExceededError.prototype);
  }
}

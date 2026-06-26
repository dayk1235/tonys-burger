export class KnowledgeError extends Error {
  constructor(message: string, public readonly metadata?: Record<string, unknown>) {
    super(message);
    this.name = "KnowledgeError";
    Object.setPrototypeOf(this, KnowledgeError.prototype);
  }
}

export class InvalidKnowledgeLifecycleTransitionError extends KnowledgeError {
  constructor(current: string, target: string) {
    super(`Invalid knowledge lifecycle transition: "${current}" → "${target}"`);
    this.name = "InvalidKnowledgeLifecycleTransitionError";
    Object.setPrototypeOf(this, InvalidKnowledgeLifecycleTransitionError.prototype);
  }
}

export class KnowledgeValidationError extends KnowledgeError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Knowledge validation failed: ${reason}`, details);
    this.name = "KnowledgeValidationError";
    Object.setPrototypeOf(this, KnowledgeValidationError.prototype);
  }
}

export class KnowledgeNotFoundError extends KnowledgeError {
  constructor(knowledgeId: string) {
    super(`Knowledge not found: "${knowledgeId}"`);
    this.name = "KnowledgeNotFoundError";
    Object.setPrototypeOf(this, KnowledgeNotFoundError.prototype);
  }
}

export class DuplicateKnowledgeError extends KnowledgeError {
  constructor(memoryId: string, existingId: string) {
    super(`Duplicate knowledge for memory "${memoryId}": existing "${existingId}"`);
    this.name = "DuplicateKnowledgeError";
    Object.setPrototypeOf(this, DuplicateKnowledgeError.prototype);
  }
}

export class KnowledgeBoundaryError extends KnowledgeError {
  constructor(reason: string) {
    super(`Knowledge boundary violation: ${reason}`);
    this.name = "KnowledgeBoundaryError";
    Object.setPrototypeOf(this, KnowledgeBoundaryError.prototype);
  }
}

export class KnowledgeGeneralizationError extends KnowledgeError {
  constructor(knowledgeId: string, reason: string) {
    super(`Knowledge generalization failed for "${knowledgeId}": ${reason}`);
    this.name = "KnowledgeGeneralizationError";
    Object.setPrototypeOf(this, KnowledgeGeneralizationError.prototype);
  }
}

export class KnowledgeExtractionError extends KnowledgeError {
  constructor(memoryId: string, reason: string) {
    super(`Knowledge extraction failed for memory "${memoryId}": ${reason}`);
    this.name = "KnowledgeExtractionError";
    Object.setPrototypeOf(this, KnowledgeExtractionError.prototype);
  }
}

export class KnowledgeOntologyError extends KnowledgeError {
  constructor(reason: string) {
    super(`Ontology error: ${reason}`);
    this.name = "KnowledgeOntologyError";
    Object.setPrototypeOf(this, KnowledgeOntologyError.prototype);
  }
}

export class KnowledgeMergeError extends KnowledgeError {
  constructor(ids: string[], reason: string) {
    super(`Knowledge merge failed for [${ids.join(", ")}]: ${reason}`);
    this.name = "KnowledgeMergeError";
    Object.setPrototypeOf(this, KnowledgeMergeError.prototype);
  }
}

export class DecisionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DecisionError";
  }
}

export class DecisionValidationError extends DecisionError {
  constructor(message: string) {
    super(message);
    this.name = "DecisionValidationError";
  }
}

export class DecisionNotFoundError extends DecisionError {
  constructor(id: string) {
    super(`Decision proposal not found: ${id}`);
    this.name = "DecisionNotFoundError";
  }
}

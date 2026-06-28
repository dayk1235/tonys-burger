export class LearningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LearningError";
  }
}

export class LearningValidationError extends LearningError {
  constructor(message: string) {
    super(message);
    this.name = "LearningValidationError";
  }
}

export class LearningNotFoundError extends LearningError {
  constructor(id: string) {
    super(`Learning cycle not found: ${id}`);
    this.name = "LearningNotFoundError";
  }
}

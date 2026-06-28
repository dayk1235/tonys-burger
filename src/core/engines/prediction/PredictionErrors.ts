export class PredictionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PredictionError";
  }
}

export class PredictionValidationError extends PredictionError {
  constructor(message: string) {
    super(message);
    this.name = "PredictionValidationError";
  }
}

export class PredictionNotFoundError extends PredictionError {
  constructor(id: string) {
    super(`Prediction not found: ${id}`);
    this.name = "PredictionNotFoundError";
  }
}

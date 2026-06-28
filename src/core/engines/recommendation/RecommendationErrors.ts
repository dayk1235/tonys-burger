export class RecommendationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RecommendationError";
  }
}

export class RecommendationValidationError extends RecommendationError {
  constructor(message: string) {
    super(message);
    this.name = "RecommendationValidationError";
  }
}

export class RecommendationNotFoundError extends RecommendationError {
  constructor(id: string) {
    super(`Recommendation not found: ${id}`);
    this.name = "RecommendationNotFoundError";
  }
}

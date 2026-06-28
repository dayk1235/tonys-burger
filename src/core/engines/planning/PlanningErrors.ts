export class PlanningError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PlanningError";
  }
}

export class PlanningValidationError extends PlanningError {
  constructor(message: string) {
    super(message);
    this.name = "PlanningValidationError";
  }
}

export class PlanningNotFoundError extends PlanningError {
  constructor(id: string) {
    super(`Plan not found: ${id}`);
    this.name = "PlanningNotFoundError";
  }
}

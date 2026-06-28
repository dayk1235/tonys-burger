export class ExecutionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ExecutionError";
  }
}

export class ExecutionValidationError extends ExecutionError {
  constructor(message: string) {
    super(message);
    this.name = "ExecutionValidationError";
  }
}

export class ExecutionNotFoundError extends ExecutionError {
  constructor(id: string) {
    super(`Execution not found: ${id}`);
    this.name = "ExecutionNotFoundError";
  }
}

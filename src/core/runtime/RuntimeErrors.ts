import { RuntimeState } from "./RuntimeTypes";

export class RuntimeError extends Error {
  constructor(message: string) {
    super(`[Runtime] ${message}`);
    this.name = "RuntimeError";
  }
}

export class EngineRegistrationError extends RuntimeError {
  constructor(engineName: string, reason: string) {
    super(`Engine registration failed for "${engineName}": ${reason}`);
    this.name = "EngineRegistrationError";
  }
}

export class EngineNotFoundError extends RuntimeError {
  constructor(engineName: string) {
    super(`Engine "${engineName}" not found in registry`);
    this.name = "EngineNotFoundError";
  }
}

export class EngineNotRunningError extends RuntimeError {
  constructor(engineName: string, state: string) {
    super(`Engine "${engineName}" is not running. Current state: ${state}`);
    this.name = "EngineNotRunningError";
  }
}

export class EngineStateTransitionError extends RuntimeError {
  constructor(engineName: string, from: string, to: string, reason: string) {
    super(`State transition "${from}" → "${to}" for "${engineName}" rejected: ${reason}`);
    this.name = "EngineStateTransitionError";
  }
}

export class EventBusError extends RuntimeError {
  constructor(message: string) {
    super(`EventBus: ${message}`);
    this.name = "EventBusError";
  }
}

export class ContextBusError extends RuntimeError {
  constructor(message: string) {
    super(`ContextBus: ${message}`);
    this.name = "ContextBusError";
  }
}

export class WorkingMemoryError extends RuntimeError {
  constructor(message: string) {
    super(`WorkingMemory: ${message}`);
    this.name = "WorkingMemoryError";
  }
}

export class InvalidConfigurationError extends RuntimeError {
  constructor(key: string, message: string) {
    super(`Configuration "${key}": ${message}`);
    this.name = "InvalidConfigurationError";
  }
}

export class LifecycleTransitionError extends RuntimeError {
  constructor(from: RuntimeState, to: string, reason: string) {
    super(`Runtime state transition "${from}" → "${to}" rejected: ${reason}`);
    this.name = "LifecycleTransitionError";
  }
}

export class SchedulerError extends RuntimeError {
  constructor(message: string) {
    super(`Scheduler: ${message}`);
    this.name = "SchedulerError";
  }
}

export class ManifestValidationError extends RuntimeError {
  constructor(engineName: string, field: string, reason: string) {
    super(`Manifest validation for "${engineName}" field "${field}": ${reason}`);
    this.name = "ManifestValidationError";
  }
}

export class RecoveryError extends RuntimeError {
  constructor(engineName: string, message: string) {
    super(`Recovery for "${engineName}": ${message}`);
    this.name = "RecoveryError";
  }
}

export class AuditError extends RuntimeError {
  constructor(message: string) {
    super(`Audit: ${message}`);
    this.name = "AuditError";
  }
}

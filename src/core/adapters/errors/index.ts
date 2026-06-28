/**
 * @file src/core/adapters/errors/index.ts
 * @description Error classes for the Restaurant OS Adapter Layer.
 * 
 * Every adapter transformation that fails must throw one of these
 * typed errors so that the AdapterRegistry, Runtime, and downstream
 * consumers can handle failures predictably.
 *
 * Error Hierarchy:
 *
 *   AdapterError (base)
 *   ├── ValidationError      — Input failed validation rules
 *   ├── TransformationError  — Conversion from source to canonical failed
 *   └── UnsupportedSourceError — No adapter registered for the given source
 */

/**
 * Base error for all Adapter Layer failures.
 * All adapter-specific errors inherit from this class.
 */
export class AdapterError extends Error {
  /** Machine-readable error code */
  public readonly code: string;
  /** ISO 8601 timestamp of when the error occurred */
  public readonly timestamp: string;
  /** Whether this error represents a transient or permanent failure */
  public readonly retryable: boolean;

  constructor(message: string, code: string, retryable = false) {
    super(message);
    this.name = "AdapterError";
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.retryable = retryable;
  }
}

/**
 * Thrown when the input from an external source fails validation.
 *
 * **Causes:**
 * - Missing required fields
 * - Invalid field types or values
 * - Structural violations (e.g. empty items array)
 * - Cross-field validation failures (e.g. price mismatch)
 *
 * **Recovery:**
 * - The source should be notified of the validation failure.
 * - This error is NOT retryable — the input must be corrected.
 */
export class ValidationError extends AdapterError {
  /** The detailed validation issues that caused this error */
  public readonly issues: Array<{ code: string; field?: string; message: string }>;

  constructor(
    message: string,
    issues: Array<{ code: string; field?: string; message: string }> = [],
  ) {
    super(message, "ADAPTER_VALIDATION_ERROR", false);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

/**
 * Thrown when the adapter fails to transform source-specific input
 * into a valid Canonical Order Event.
 *
 * **Causes:**
 * - Unrecognized source format or structure
 * - Missing mapping rules for a field
 * - Data type conversion failure (e.g. string to number)
 * - Corrupted or malformed input
 *
 * **Recovery:**
 * - The error is retryable if the source can resend the input.
 * - The transformation logic should be logged for debugging.
 */
export class TransformationError extends AdapterError {
  /** The original input that caused the transformation to fail */
  public readonly originalInput?: unknown;
  /** The step in the transformation pipeline that failed */
  public readonly failedStep: string;

  constructor(
    message: string,
    failedStep: string,
    originalInput?: unknown,
    retryable = true,
  ) {
    super(message, "ADAPTER_TRANSFORMATION_ERROR", retryable);
    this.name = "TransformationError";
    this.failedStep = failedStep;
    this.originalInput = originalInput;
  }
}

/**
 * Thrown when no adapter is registered for the requested source provider.
 *
 * **Causes:**
 * - The source provider is not yet supported
 * - The adapter was not registered in the AdapterRegistry
 * - The source slug does not match any registered adapter
 *
 * **Recovery:**
 * - A new adapter must be implemented and registered.
 * - This error is NOT retryable — the source cannot be processed.
 */
export class UnsupportedSourceError extends AdapterError {
  /** The source provider that was requested */
  public readonly requestedProvider: string;
  /** List of currently registered provider slugs */
  public readonly availableProviders: string[];

  constructor(requestedProvider: string, availableProviders: string[]) {
    super(
      `Unsupported source provider: "${requestedProvider}". ` +
      `Available providers: ${availableProviders.join(", ") || "(none)"}`,
      "ADAPTER_UNSUPPORTED_SOURCE",
      false,
    );
    this.name = "UnsupportedSourceError";
    this.requestedProvider = requestedProvider;
    this.availableProviders = availableProviders;
  }
}

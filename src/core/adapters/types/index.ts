/**
 * @file src/core/adapters/types/index.ts
 * @description Shared types for the Restaurant OS Adapter Layer.
 * 
 * These types define the contracts between external sources and the
 * Adapter Layer's CanonicalOrderAdapter interface. Every adapter —
 * regardless of source (UberEats, Rappi, WhatsApp, POS, CSV, API) —
 * uses these types to declare its capabilities, receive input,
 * produce output, and report validation results.
 *
 * @see {@link ../contracts/CanonicalOrderAdapter.ts} for the adapter contract
 * @see {@link project-docs/intelligence/CANONICAL_ORDER_EVENT_SPEC.md} for the canonical spec
 */

// ─── Source Representation ────────────────────────────────────────────────

/**
 * Identifies an external source that produces orders.
 * Each concrete adapter is bound to exactly one provider.
 */
export interface AdapterSource {
  /** Canonical provider slug (e.g. "uber-eats", "rappi", "pos-clover", "whatsapp") */
  provider: string;
  /** Human-readable display name for the source */
  displayName: string;
  /** Version of the source adapter implementation */
  version: string;
}

// ─── Input ────────────────────────────────────────────────────────────────

/**
 * Raw input received from an external source.
 * The adapter is responsible for understanding this format
 * and converting it to a CanonicalOrderEvent.
 */
export interface AdapterInput {
  /** The raw source-specific payload (JSON, XML, CSV string, etc.) */
  raw: unknown;
  /** Original content-type if known (e.g. "application/json", "text/csv") */
  contentType?: string;
  /** Any contextual metadata provided alongside the input */
  context?: Record<string, unknown>;
}

// ─── Output ───────────────────────────────────────────────────────────────

/**
 * The successful result of an adapter transformation.
 * Contains the validated Canonical Order Event ready for
 * ingestion into the Cognitive Pipeline via ObservationEngine.
 */
export interface AdapterOutput {
  /** The validated Canonical Order Event */
  canonical: Record<string, unknown>;
  /** Version of the canonical spec the output conforms to */
  specVersion: string;
  /** Metadata about the transformation */
  metadata: AdapterTransformationMetadata;
}

/**
 * Metadata generated during the transformation lifecycle.
 */
export interface AdapterTransformationMetadata {
  /** When the transformation started */
  startedAt: string;
  /** When the transformation completed */
  completedAt: string;
  /** Elapsed time in milliseconds */
  durationMs: number;
  /** Number of validation warnings issued */
  warnings: number;
  /** Number of fields that were mapped successfully */
  fieldsMapped: number;
  /** Number of fields that were set to defaults */
  fieldsDefaulted: number;
  /** Adapter version that performed the transformation */
  adapterVersion: string;
}

// ─── Validation ───────────────────────────────────────────────────────────

/**
 * Severity levels for validation issues.
 */
export type ValidationSeverity = "ERROR" | "WARNING" | "INFO";

/**
 * A single validation issue found during adapter processing.
 */
export interface AdapterValidationIssue {
  /** Severity of the issue */
  severity: ValidationSeverity;
  /** Machine-readable error code */
  code: string;
  /** Human-readable description */
  message: string;
  /** JSON path or field name where the issue was found */
  field?: string;
  /** The value that caused the issue */
  value?: unknown;
  /** Suggestion for how to resolve */
  suggestion?: string;
}

/**
 * The complete result of an adapter validation pass.
 */
export interface AdapterValidationResult {
  /** Whether the input passed validation */
  valid: boolean;
  /** List of all issues found (errors, warnings, info) */
  issues: AdapterValidationIssue[];
  /** Number of error-level issues */
  errorCount: number;
  /** Number of warning-level issues */
  warningCount: number;
  /** Overall confidence in the validity of the input (0.0 – 1.0) */
  confidence: number;
}

// ─── Capabilities ─────────────────────────────────────────────────────────

/**
 * Declares what an adapter is capable of.
 * Used by AdapterRegistry.listCapabilities() to enable
 * runtime discovery of available adapters.
 */
export interface AdapterCapabilities {
  /** Supported content types (e.g. ["application/json", "text/csv"]) */
  contentTypes: string[];
  /** Supported channel types */
  channels: string[];
  /** Whether this adapter supports batch/CSV import */
  supportsBatch: boolean;
  /** Whether this adapter supports idempotent processing */
  supportsIdempotency: boolean;
  /** Maximum payload size in bytes this adapter can handle */
  maxPayloadBytes: number;
  /** Any additional capabilities as key-value pairs */
  extensions?: Record<string, unknown>;
}

// ─── Context ──────────────────────────────────────────────────────────────

/**
 * Contextual information provided to the adapter at invocation time.
 * Enables adapters to make source-specific decisions based on
 * restaurant configuration, locale, or environment.
 */
export interface AdapterContext {
  /** Restaurant ID performing the ingestion */
  restaurantId: string;
  /** Optional branch ID for multi-branch operations */
  branchId?: string;
  /** Target locale for the canonical output (e.g. "es-MX") */
  locale: string;
  /** Environment context */
  environment: "PRODUCTION" | "STAGING" | "TEST";
  /** Any additional source-specific context */
  custom?: Record<string, unknown>;
}

// ─── Statistics ───────────────────────────────────────────────────────────

/**
 * Aggregated statistics for an adapter's operation.
 * Useful for monitoring, dashboards, and runtime health checks.
 */
export interface AdapterStatistics {
  /** Total number of transformations performed */
  totalTransformations: number;
  /** Number of successful transformations */
  successfulTransformations: number;
  /** Number of failed transformations */
  failedTransformations: number;
  /** Number of validation errors encountered */
  totalValidationErrors: number;
  /** Number of validation warnings encountered */
  totalValidationWarnings: number;
  /** Average transformation duration in milliseconds */
  averageDurationMs: number;
  /** Timestamp of the last transformation */
  lastTransformationAt: string | null;
  /** Adapter version these statistics apply to */
  adapterVersion: string;
}

// ─── Adapter Metadata ─────────────────────────────────────────────────────

/**
 * Read-only metadata about an adapter registered in the AdapterRegistry.
 */
export interface AdapterMetadata {
  /** Unique name of the adapter */
  name: string;
  /** Description of what this adapter does */
  description: string;
  /** Source provider this adapter handles */
  source: AdapterSource;
  /** Declared capabilities */
  capabilities: AdapterCapabilities;
  /** ISO 8601 timestamp of when the adapter was registered */
  registeredAt: string;
  /** Whether the adapter is currently active */
  active: boolean;
  /** Current operational statistics */
  statistics: AdapterStatistics;
}

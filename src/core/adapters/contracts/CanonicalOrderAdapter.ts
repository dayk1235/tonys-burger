/**
 * @file src/core/adapters/contracts/CanonicalOrderAdapter.ts
 * @description Canonical contract that EVERY adapter must implement.
 *
 * This contract defines the public interface for all source-specific
 * adapters in Restaurant OS. Every external source — UberEats, Rappi,
 * WhatsApp, POS, CSV, API — must have a corresponding adapter that
 * implements this interface.
 *
 * The adapter layer follows LAW_064 (Design Before Implementation):
 * Design → Specification → ADR → Approval → Freeze → Implementation
 * → Validation → Audit → Certification.
 *
 * @see {@link ../types/index.ts} for shared types
 * @see {@link ../registry/AdapterRegistry.ts} for the registry that manages adapters
 * @see {@link ../../../project-docs/intelligence/CANONICAL_ORDER_EVENT_SPEC.md} for the canonical spec
 */

import type {
  AdapterInput,
  AdapterOutput,
  AdapterValidationResult,
  AdapterCapabilities,
  AdapterContext,
  AdapterStatistics,
  AdapterMetadata,
} from "../types";

/**
 * Interface that all source-specific adapters must implement.
 *
 * **Lifecycle:**
 * ```
 * 1. canHandle(input)  ──► determine if this adapter supports the input
 * 2. validate(input)    ──► validate the raw input against source-specific rules
 * 3. transform(input)   ──► convert source format → Canonical Order Event
 * 4. normalize(output)  ──► normalize derived fields and defaults
 * 5. getMetadata()      ──► return read-only adapter metadata for the registry
 * ```
 *
 * **Invariants:**
 * - Every adapter MUST produce a Canonical Order Event that passes the
 *   canonical spec's validation rules (see CANONICAL_ORDER_EVENT_SPEC.md §5).
 * - Every adapter MUST be registered in AdapterRegistry before use.
 * - Every adapter MUST declare its capabilities honestly.
 */
export interface CanonicalOrderAdapter {
  // ─── Identity ──────────────────────────────────────────────────────────

  /** Unique name for this adapter (e.g. "uber-eats", "pos-clover") */
  readonly name: string;

  /** Human-readable description */
  readonly description: string;

  // ─── Capability Checks ──────────────────────────────────────────────────

  /**
   * Determines whether this adapter can handle the given input.
   * This is the first gate — called before validate() or transform().
   *
   * @param input - The raw input from an external source.
   * @returns true if this adapter can process the input.
   *
   * **Example:** An UberEats adapter checks for `order.uber_id` or
   * content-type `application/json` with a specific structure.
   */
  canHandle(input: AdapterInput): boolean;

  /**
   * Returns the declared capabilities of this adapter.
   * Used by AdapterRegistry.listCapabilities() for runtime discovery.
   */
  getCapabilities(): AdapterCapabilities;

  // ─── Validation ────────────────────────────────────────────────────────

  /**
   * Validates the raw input against source-specific rules.
   *
   * This is called BEFORE transform() to fail fast on invalid input.
   * Validation includes:
   * - Structural checks (required fields exist)
   * - Type checks (fields have correct types)
   * - Business rules (quantities > 0, prices >= 0)
   *
   * @param input - The raw input from an external source.
   * @returns A validation result with issues and confidence score.
   *
   * **Note:** This validates the SOURCE format, not the canonical format.
   * Canonical validation happens after transform() normalizes the output.
   */
  validate(input: AdapterInput): Promise<AdapterValidationResult>;

  // ─── Transformation ────────────────────────────────────────────────────

  /**
   * Transforms source-specific input into a Canonical Order Event.
   *
   * This is the core operation of every adapter. It maps source-specific
   * fields to the canonical structure defined in the Canonical Order Event Spec.
   *
   * @param input - The raw input from an external source.
   * @param context - Contextual information (restaurant, locale, environment).
   * @returns A validated canonical output ready for the Cognitive Pipeline.
   *
   * @throws {ValidationError} if the input fails validation.
   * @throws {TransformationError} if the transformation fails.
   *
   * **Post-conditions:**
   * - The output MUST conform to the Canonical Order Event Spec v1.0.0.
   * - The output MUST pass AdapterOutputValidation before being returned.
   * - All monetary values MUST be in cents (smallest currency unit).
   * - All timestamps MUST be ISO 8601 with timezone offset.
   */
  transform(input: AdapterInput, context: AdapterContext): Promise<AdapterOutput>;

  // ─── Normalization ─────────────────────────────────────────────────────

  /**
   * Normalizes the adapter output after transformation.
   *
   * Normalization includes:
   * - Computing derived fields (e.g. items[].totalPrice = unitPrice * quantity)
   * - Setting default values for optional fields
   * - Formatting timestamps to ISO 8601
   * - Applying locale-specific formatting
   * - Stripping source-internal fields that should not be in the canonical event
   *
   * @param output - The raw output from transform().
   * @returns The normalized output with all derived fields computed.
   */
  normalize(output: AdapterOutput): Promise<AdapterOutput>;

  // ─── Metadata ──────────────────────────────────────────────────────────

  /**
   * Returns read-only metadata about this adapter.
   * Used by the AdapterRegistry to expose the adapter to the Runtime.
   */
  getMetadata(): AdapterMetadata;

  /**
   * Returns current operational statistics.
   * Used by monitoring, dashboards, and health checks.
   */
  getStatistics(): AdapterStatistics;
}

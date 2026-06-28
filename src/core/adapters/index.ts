/**
 * @file src/core/adapters/index.ts
 * @description Barrel exports for the Restaurant OS Adapter Layer.
 */

export type { CanonicalOrderAdapter } from "./contracts/CanonicalOrderAdapter";
export { AdapterRegistry, adapterRegistry } from "./registry/AdapterRegistry";
export type {
  AdapterSource,
  AdapterInput,
  AdapterOutput,
  AdapterTransformationMetadata,
  ValidationSeverity,
  AdapterValidationIssue,
  AdapterValidationResult,
  AdapterCapabilities,
  AdapterContext,
  AdapterStatistics,
  AdapterMetadata,
} from "./types";
export {
  AdapterError,
  ValidationError,
  TransformationError,
  UnsupportedSourceError,
} from "./errors";

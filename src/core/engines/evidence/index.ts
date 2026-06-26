export { EvidenceEngine } from "./EvidenceEngine";
export { EvidencePipeline } from "./EvidencePipeline";
export { EvidenceFactory } from "./EvidenceFactory";
export { EvidenceValidator } from "./EvidenceValidator";
export { EvidenceLifecycle } from "./EvidenceLifecycle";
export { EvidenceQuality } from "./EvidenceQuality";
export { EvidenceConfidence } from "./EvidenceConfidence";
export { EvidenceScoring } from "./EvidenceScoring";
export { EvidenceAggregation } from "./EvidenceAggregation";
export { EvidenceContradictions } from "./EvidenceContradictions";
export { EvidenceSources } from "./EvidenceSources";
export { EvidenceRelationships } from "./EvidenceRelationships";
export { EvidenceMemory } from "./EvidenceMemory";
export { EvidenceRegistry } from "./EvidenceRegistry";
export { EvidenceMetrics } from "./EvidenceMetrics";
export { EvidencePolicyEngine } from "./EvidencePolicies";
export { EvidenceRegistry as EvidenceRegistryClass } from "./EvidenceRegistry";
export type { EvidencePolicy } from "./EvidenceRegistry";

export {
  EVIDENCE_ENGINE_NAME,
  EVIDENCE_ENGINE_CLASSIFICATION,
  EVIDENCE_ENGINE_CONTRACT_VERSION,
} from "./EvidenceTypes";

export type {
  Evidence,
  EvidenceStage,
  EvidenceCategory,
  EvidenceIdentity,
  EvidenceVersion,
  SupportingRef,
  ContradictingRef,
  EvidenceQualityProfile,
  EvidenceProvenance,
  EvidenceRelationship,
  EvidenceMetadata,
  EvidenceEvaluationRequest,
  EvidenceEvaluationResult,
  ObservationDetail,
  PatternDetail,
  EvidenceEventPayload,
} from "./EvidenceTypes";

export {
  EVIDENCE_EVENTS,
} from "./EvidenceEvents";

export type {
  EvidenceEventName,
  EvidenceEventEnvelope,
} from "./EvidenceEvents";

export {
  EvidenceError,
  InvalidLifecycleTransitionError,
  EvidenceValidationError,
  InsufficientSupportError,
  ContradictionError,
  SourceReliabilityError,
  DuplicateEvidenceError,
  ProvenanceError,
} from "./EvidenceErrors";

export type {
  EvidenceSubscriber,
  EvidenceQuery,
  EvidenceEngineMetrics,
} from "./EvidenceContracts";

export type {
  AggregatedResult,
} from "./EvidenceAggregation";

export type {
  ContradictionAnalysis,
} from "./EvidenceContradictions";

export type {
  SourceReliabilityProfile,
} from "./EvidenceSources";

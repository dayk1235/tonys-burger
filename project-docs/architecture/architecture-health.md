# Architecture Health Report

**Generated**: 2026-06-28T17:05:14.934Z
**Repository**: tony-burgers
**Engines**: 13
**Total Event Bindings**: 77

---

## Architecture Score

| Metric | Value |
|--------|-------|
| **Overall Score** | **55 / 100** |
| Contracts (canonical %) | 100% |
| Traceability (chains intact) | 88% |
| Dead Code Issues | 51 |
| Broken Chains | 1 |
| Payload Risks | 1 |

---

## Dependency Summary

| Engine | Subscribes | Emits | Lifecycle Events |
|--------|-----------|-------|-----------------|
| **attention** | 3 | 7 | 2 |
| **decision** | 1 | 2 | 2 |
| **evidence** | 2 | 4 | 0 |
| **execution** | 1 | 2 | 2 |
| **knowledge** | 3 | 5 | 3 |
| **learning** | 2 | 2 | 3 |
| **memory** | 3 | 10 | 1 |
| **observation** | 0 | 9 | 0 |
| **pattern** | 1 | 9 | 0 |
| **planning** | 1 | 2 | 2 |
| **prediction** | 1 | 2 | 2 |
| **reasoning** | 1 | 1 | 0 |
| **recommendation** | 1 | 2 | 2 |

## Runtime Graph

```
✓ observation      → observation.lifecycle.*                  [CONNECTED]
✓ pattern          → pattern.lifecycle.*                      [CONNECTED]
✓ evidence         → evidence.lifecycle.*                     [CONNECTED]
✓ memory           → memory.lifecycle.*                       [CONNECTED]
✓ knowledge        → knowledge.lifecycle.*                    [CONNECTED]
✓ attention        → attention.operation.prioritized          [CONNECTED]
✓ reasoning        → reasoning.lifecycle.*                    [CONNECTED]
✗ decision         → decision.lifecycle.*                     [DISCONNECTED]
```

## Producer / Consumer Matrix

| Event | Producers | Consumers | Contract |
|-------|-----------|-----------|----------|
| `RUNTIME_EVENTS.RUNTIME_EMERGENCY` | — | AttentionEngine.ts | ✅ Canonical |
| `RUNTIME_EVENTS.RUNTIME_CONTEXT_CHANGE` | — | AttentionEngine.ts | ✅ Canonical |
| `knowledge.lifecycle.validated` | — | AttentionEngine.ts | ✅ Canonical |
| `RUNTIME_EVENTS.ENGINE_STATE_CHANGE` | AttentionEngine.ts, DecisionEngine.ts, EvidenceEngine.ts, ExecutionEngine.ts, KnowledgeEngine.ts, LearningEngine.ts, MemoryEngine.ts, PatternEngine.ts, PlanningEngine.ts, PredictionEngine.ts, ReasoningEngine.ts, RecommendationEngine.ts | — | ✅ Canonical |
| `attention.operation.prioritized` | AttentionPipeline.ts | ReasoningEngine.ts | ✅ Canonical |
| `attention.operation.focused` | AttentionPipeline.ts | — | ✅ Canonical |
| `attention.operation.defocused` | AttentionPipeline.ts | — | ✅ Canonical |
| `attention.operation.interrupted` | AttentionPipeline.ts | — | ✅ Canonical |
| `attention.lifecycle.deferred` | AttentionPipeline.ts | — | ✅ Canonical |
| `attention.operation.released` | AttentionPipeline.ts | — | ✅ Canonical |
| `recommendation.lifecycle.completed` | — | DecisionEngine.ts, ExecutionEngine.ts, PlanningEngine.ts, PredictionEngine.ts, RecommendationEngine.ts | ✅ Canonical |
| `recommendation.lifecycle.initiated` | DecisionPipeline.ts, ExecutionPipeline.ts, LearningPipeline.ts, PlanningPipeline.ts, PredictionPipeline.ts, RecommendationPipeline.ts | LearningEngine.ts | ✅ Canonical |
| `pattern.lifecycle.supported_established` | — | EvidenceEngine.ts | ✅ Canonical |
| `pattern.lifecycle.validated_confirmed` | — | EvidenceEngine.ts | ✅ Canonical |
| `evidence.evaluation.started` | EvidencePipeline.ts | — | ✅ Canonical |
| `evidence.evaluation.completed` | EvidencePipeline.ts | MemoryEngine.ts | ✅ Canonical |
| `evidence.evaluation.failed` | EvidencePipeline.ts | — | ✅ Canonical |
| `memory.lifecycle.consolidated` | — | KnowledgeEngine.ts | ✅ Canonical |
| `memory.lifecycle.long_term_promoted` | — | KnowledgeEngine.ts | ✅ Canonical |
| `memory.lifecycle.semantic_established` | — | KnowledgeEngine.ts | ✅ Canonical |
| `knowledge.operation.extracted` | KnowledgePipeline.ts | — | ✅ Canonical |
| `knowledge.operation.generalized` | KnowledgePipeline.ts | — | ✅ Canonical |
| `knowledge.operation.specialized` | KnowledgePipeline.ts | — | ✅ Canonical |
| `knowledge.operation.deprecated` | KnowledgePipeline.ts | — | ✅ Canonical |
| `decision.lifecycle.accepted` | — | LearningEngine.ts | ✅ Canonical |
| `evidence.lifecycle.validated_confirmed` | — | MemoryEngine.ts | ✅ Canonical |
| `observation.lifecycle.historical_committed` | ObservationPipeline.ts | MemoryEngine.ts, PatternEngine.ts | ✅ Canonical |
| `memory.operation.created` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.strengthened` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.weakened` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.forgotten` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.reactivated` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.compressed` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.merged` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.associated` | MemoryPipeline.ts | — | ✅ Canonical |
| `memory.operation.detached` | MemoryPipeline.ts | — | ✅ Canonical |
| `pattern.lifecycle.potential_detected` | ObservationPipeline.ts, PatternPipeline.ts | — | ✅ Canonical |
| `observation.lifecycle.candidate_verified` | ObservationPipeline.ts | — | ✅ Canonical |
| `observation.lifecycle.context_assigned` | ObservationPipeline.ts | — | ✅ Canonical |
| `pattern.lifecycle.deprecated` | ObservationPipeline.ts, PatternPipeline.ts | — | ✅ Canonical |
| `observation.quality.corrected` | ObservationPipeline.ts | — | ✅ Canonical |
| `observation.lifecycle.pattern_evidence_linked` | ObservationPipeline.ts | — | ✅ Canonical |
| `observation.lifecycle.knowledge_evidence_linked` | ObservationPipeline.ts | — | ✅ Canonical |
| `observation.lifecycle.archived` | ObservationPipeline.ts | — | ✅ Canonical |
| `pattern.lifecycle.emerging_confirmed` | PatternPipeline.ts | — | ✅ Canonical |
| `pattern.lifecycle.pattern_updated` | PatternPipeline.ts | — | ✅ Canonical |
| `pattern.discovery.correlation_found` | PatternPipeline.ts | — | ✅ Canonical |
| `pattern.discovery.trend_detected` | PatternPipeline.ts | — | ✅ Canonical |
| `pattern.discovery.anomaly_detected` | PatternPipeline.ts | — | ✅ Canonical |
| `pattern.discovery.sequence_discovered` | PatternPipeline.ts | — | ✅ Canonical |

## Contract Verification

Canonical constants found: **157** in **13** files

| File | Constant | Value |
|------|----------|-------|
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_CANDIDATE` | `attention.lifecycle.candidate` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_OBSERVED` | `attention.lifecycle.observed` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_SCORED` | `attention.lifecycle.scored` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_QUEUED` | `attention.lifecycle.queued` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_FOCUSED` | `attention.lifecycle.focused` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_MAINTAINED` | `attention.lifecycle.maintained` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_INTERRUPTED` | `attention.lifecycle.interrupted` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_DEFERRED` | `attention.lifecycle.deferred` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_RELEASED` | `attention.lifecycle.released` |
| src/core/engines/attention/AttentionEvents.ts | `LIFECYCLE_ARCHIVED` | `attention.lifecycle.archived` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_PRIORITIZED` | `attention.operation.prioritized` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_FOCUSED` | `attention.operation.focused` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_DEFOCUSED` | `attention.operation.defocused` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_INTERRUPTED` | `attention.operation.interrupted` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_ESCALATED` | `attention.operation.escalated` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_SUSPENDED` | `attention.operation.suspended` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_RESUMED` | `attention.operation.resumed` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_ALLOCATED` | `attention.operation.allocated` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_RELEASED` | `attention.operation.released` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_EXPIRED` | `attention.operation.expired` |
| src/core/engines/attention/AttentionEvents.ts | `OPERATION_STARVED` | `attention.operation.starved` |
| src/core/engines/attention/AttentionEvents.ts | `BUDGET_UPDATED` | `attention.budget.updated` |
| src/core/engines/attention/AttentionEvents.ts | `CONTEXT_CHANGED` | `attention.context.changed` |
| src/core/engines/attention/AttentionEvents.ts | `METRICS_UPDATED` | `attention.metrics.updated` |
| src/core/engines/decision/DecisionEvents.ts | `LIFECYCLE_INITIATED` | `decision.lifecycle.initiated` |
| src/core/engines/decision/DecisionEvents.ts | `LIFECYCLE_EVALUATING` | `decision.lifecycle.evaluating` |
| src/core/engines/decision/DecisionEvents.ts | `LIFECYCLE_COMMITTED` | `decision.lifecycle.committed` |
| src/core/engines/decision/DecisionEvents.ts | `LIFECYCLE_ARCHIVED` | `decision.lifecycle.archived` |
| src/core/engines/decision/DecisionEvents.ts | `OPERATION_INITIATED` | `decision.operation.initiated` |
| src/core/engines/decision/DecisionEvents.ts | `OPERATION_APPROVED` | `decision.operation.approved` |
| src/core/engines/decision/DecisionEvents.ts | `OPERATION_REJECTED` | `decision.operation.rejected` |
| src/core/engines/decision/DecisionEvents.ts | `OPERATION_EXECUTED` | `decision.operation.executed` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_CANDIDATE_CREATED` | `evidence.lifecycle.candidate_created` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_COLLECTING_STARTED` | `evidence.lifecycle.collecting_started` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_SUPPORTING_ESTABLISHED` | `evidence.lifecycle.supporting_established` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_CONFLICTING_DETECTED` | `evidence.lifecycle.conflicting_detected` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_WEIGHTED_CALCULATED` | `evidence.lifecycle.weighted_calculated` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_VALIDATED_CONFIRMED` | `evidence.lifecycle.validated_confirmed` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_REJECTED` | `evidence.lifecycle.rejected` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_HISTORICAL_ARCHIVED` | `evidence.lifecycle.historical_archived` |
| src/core/engines/evidence/EvidenceEvents.ts | `LIFECYCLE_ARCHIVED` | `evidence.lifecycle.archived` |
| src/core/engines/evidence/EvidenceEvents.ts | `EVALUATION_STARTED` | `evidence.evaluation.started` |
| src/core/engines/evidence/EvidenceEvents.ts | `EVALUATION_COMPLETED` | `evidence.evaluation.completed` |
| src/core/engines/evidence/EvidenceEvents.ts | `EVALUATION_FAILED` | `evidence.evaluation.failed` |
| src/core/engines/evidence/EvidenceEvents.ts | `CONTRADICTION_DETECTED` | `evidence.contradiction.detected` |
| src/core/engines/evidence/EvidenceEvents.ts | `CONTRADICTION_RESOLVED` | `evidence.contradiction.resolved` |
| src/core/engines/evidence/EvidenceEvents.ts | `RELATIONSHIP_DISCOVERED` | `evidence.relationship.discovered` |
| src/core/engines/evidence/EvidenceEvents.ts | `METRICS_UPDATED` | `evidence.metrics.updated` |
| src/core/engines/execution/ExecutionEvents.ts | `LIFECYCLE_INITIATED` | `execution.lifecycle.initiated` |
| src/core/engines/execution/ExecutionEvents.ts | `LIFECYCLE_COMPLETED` | `execution.lifecycle.completed` |
| src/core/engines/execution/ExecutionEvents.ts | `LIFECYCLE_FAILED` | `execution.lifecycle.failed` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_CANDIDATE_CREATED` | `knowledge.lifecycle.candidate_created` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_EXTRACTED` | `knowledge.lifecycle.extracted` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_STRUCTURED` | `knowledge.lifecycle.structured` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_VALIDATED` | `knowledge.lifecycle.validated` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_GENERALIZED` | `knowledge.lifecycle.generalized` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_SPECIALIZED` | `knowledge.lifecycle.specialized` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_SEMANTIC` | `knowledge.lifecycle.semantic` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_CANONICAL` | `knowledge.lifecycle.canonical` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_HISTORICAL` | `knowledge.lifecycle.historical` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `LIFECYCLE_ARCHIVED` | `knowledge.lifecycle.archived` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_EXTRACTED` | `knowledge.operation.extracted` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_GENERALIZED` | `knowledge.operation.generalized` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_SPECIALIZED` | `knowledge.operation.specialized` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_LINKED` | `knowledge.operation.linked` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_MERGED` | `knowledge.operation.merged` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_VALIDATED` | `knowledge.operation.validated` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_DEPRECATED` | `knowledge.operation.deprecated` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `OPERATION_EXPANDED` | `knowledge.operation.expanded` |
| src/core/engines/knowledge/KnowledgeEvents.ts | `METRICS_UPDATED` | `knowledge.metrics.updated` |
| src/core/engines/learning/LearningEvents.ts | `LIFECYCLE_INITIATED` | `learning.lifecycle.initiated` |
| src/core/engines/learning/LearningEvents.ts | `LIFECYCLE_COMPLETED` | `learning.lifecycle.completed` |
| src/core/engines/learning/LearningEvents.ts | `LIFECYCLE_ACCEPTED` | `decision.lifecycle.accepted` |
| src/core/engines/learning/LearningEvents.ts | `LIFECYCLE_FAILED` | `learning.lifecycle.failed` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_WORKING_CREATED` | `memory.lifecycle.working_created` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_CANDIDATE_PROMOTED` | `memory.lifecycle.candidate_promoted` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_SHORT_TERM_ESTABLISHED` | `memory.lifecycle.short_term_established` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_STABILIZING_STARTED` | `memory.lifecycle.stabilizing_started` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_CONSOLIDATED` | `memory.lifecycle.consolidated` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_LONG_TERM_PROMOTED` | `memory.lifecycle.long_term_promoted` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_SEMANTIC_ESTABLISHED` | `memory.lifecycle.semantic_established` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_HISTORICAL_ARCHIVED` | `memory.lifecycle.historical_archived` |
| src/core/engines/memory/MemoryEvents.ts | `LIFECYCLE_ARCHIVED` | `memory.lifecycle.archived` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_CREATED` | `memory.operation.created` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_CONSOLIDATED` | `memory.operation.consolidated` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_STRENGTHENED` | `memory.operation.strengthened` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_WEAKENED` | `memory.operation.weakened` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_FORGOTTEN` | `memory.operation.forgotten` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_ARCHIVED` | `memory.operation.archived` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_COMPRESSED` | `memory.operation.compressed` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_MERGED` | `memory.operation.merged` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_REACTIVATED` | `memory.operation.reactivated` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_ASSOCIATED` | `memory.operation.associated` |
| src/core/engines/memory/MemoryEvents.ts | `OPERATION_DETACHED` | `memory.operation.detached` |
| src/core/engines/memory/MemoryEvents.ts | `METRICS_UPDATED` | `memory.metrics.updated` |
| src/core/engines/observation/ObservationEvents.ts | `POTENTIAL_DETECTED` | `observation.lifecycle.potential_detected` |
| src/core/engines/observation/ObservationEvents.ts | `CANDIDATE_VERIFIED` | `observation.lifecycle.candidate_verified` |
| src/core/engines/observation/ObservationEvents.ts | `CONTEXT_ASSIGNED` | `observation.lifecycle.context_assigned` |
| src/core/engines/observation/ObservationEvents.ts | `HISTORICAL_COMMITTED` | `observation.lifecycle.historical_committed` |
| src/core/engines/observation/ObservationEvents.ts | `PATTERN_EVIDENCE_LINKED` | `observation.lifecycle.pattern_evidence_linked` |
| src/core/engines/observation/ObservationEvents.ts | `KNOWLEDGE_EVIDENCE_LINKED` | `observation.lifecycle.knowledge_evidence_linked` |
| src/core/engines/observation/ObservationEvents.ts | `ARCHIVED` | `observation.lifecycle.archived` |
| src/core/engines/observation/ObservationEvents.ts | `DEPRECATED` | `observation.quality.deprecated` |
| src/core/engines/observation/ObservationEvents.ts | `CORRECTED` | `observation.quality.corrected` |
| src/core/engines/observation/ObservationEvents.ts | `VERIFICATION_FAILED` | `observation.pipeline.verification_failed` |
| src/core/engines/observation/ObservationEvents.ts | `QUALITY_FAILED` | `observation.pipeline.quality_failed` |
| src/core/engines/pattern/PatternEvents.ts | `POTENTIAL_DETECTED` | `pattern.lifecycle.potential_detected` |
| src/core/engines/pattern/PatternEvents.ts | `CANDIDATE_EVALUATED` | `pattern.lifecycle.candidate_evaluated` |
| src/core/engines/pattern/PatternEvents.ts | `EMERGING_CONFIRMED` | `pattern.lifecycle.emerging_confirmed` |
| src/core/engines/pattern/PatternEvents.ts | `SUPPORTED_ESTABLISHED` | `pattern.lifecycle.supported_established` |
| src/core/engines/pattern/PatternEvents.ts | `VALIDATED_CONFIRMED` | `pattern.lifecycle.validated_confirmed` |
| src/core/engines/pattern/PatternEvents.ts | `STRENGTHENING_OBSERVED` | `pattern.lifecycle.strengthening_observed` |
| src/core/engines/pattern/PatternEvents.ts | `WEAKENING_OBSERVED` | `pattern.lifecycle.weakening_observed` |
| src/core/engines/pattern/PatternEvents.ts | `DEPRECATED` | `pattern.lifecycle.deprecated` |
| src/core/engines/pattern/PatternEvents.ts | `HISTORICAL_ARCHIVED` | `pattern.lifecycle.historical_archived` |
| src/core/engines/pattern/PatternEvents.ts | `CORRELATION_FOUND` | `pattern.discovery.correlation_found` |
| src/core/engines/pattern/PatternEvents.ts | `TREND_DETECTED` | `pattern.discovery.trend_detected` |
| src/core/engines/pattern/PatternEvents.ts | `ANOMALY_DETECTED` | `pattern.discovery.anomaly_detected` |
| src/core/engines/pattern/PatternEvents.ts | `SEQUENCE_DISCOVERED` | `pattern.discovery.sequence_discovered` |
| src/core/engines/pattern/PatternEvents.ts | `PATTERN_UPDATED` | `pattern.lifecycle.pattern_updated` |
| src/core/engines/pattern/PatternEvents.ts | `PATTERN_CONFLICT` | `pattern.lifecycle.pattern_conflict` |
| src/core/engines/pattern/PatternEvents.ts | `PATTERN_MERGED` | `pattern.lifecycle.pattern_merged` |
| src/core/engines/planning/PlanningEvents.ts | `LIFECYCLE_INITIATED` | `planning.lifecycle.initiated` |
| src/core/engines/planning/PlanningEvents.ts | `LIFECYCLE_COMPLETED` | `planning.lifecycle.completed` |
| src/core/engines/planning/PlanningEvents.ts | `LIFECYCLE_FAILED` | `planning.lifecycle.failed` |
| src/core/engines/prediction/PredictionEvents.ts | `LIFECYCLE_INITIATED` | `prediction.lifecycle.initiated` |
| src/core/engines/prediction/PredictionEvents.ts | `LIFECYCLE_COMPLETED` | `prediction.lifecycle.completed` |
| src/core/engines/prediction/PredictionEvents.ts | `LIFECYCLE_FAILED` | `prediction.lifecycle.failed` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CANDIDATE` | `reasoning.lifecycle.candidate` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_ACTIVATED` | `reasoning.lifecycle.activated` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONTEXT_BUILDING` | `reasoning.lifecycle.context_building` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_INFORMATION_GAP_DETECTION` | `reasoning.lifecycle.information_gap_detection` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_EVIDENCE_GATHERING` | `reasoning.lifecycle.evidence_gathering` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_KNOWLEDGE_RETRIEVAL` | `reasoning.lifecycle.knowledge_retrieval` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_HYPOTHESIS_GENERATION` | `reasoning.lifecycle.hypothesis_generation` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_ALTERNATIVE_GENERATION` | `reasoning.lifecycle.alternative_generation` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONSTRAINT_EVALUATION` | `reasoning.lifecycle.constraint_evaluation` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_TRADEOFF_EVALUATION` | `reasoning.lifecycle.tradeoff_evaluation` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONSISTENCY_CHECKING` | `reasoning.lifecycle.consistency_checking` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONFIDENCE_ASSESSMENT` | `reasoning.lifecycle.confidence_assessment` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONFIDENCE_EXPLANATION` | `reasoning.lifecycle.confidence_explanation` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_CONCLUSION_BUILDING` | `reasoning.lifecycle.conclusion_building` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_COMPLETED` | `reasoning.lifecycle.completed` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_ARCHIVED` | `reasoning.lifecycle.archived` |
| src/core/engines/reasoning/ReasoningEvents.ts | `LIFECYCLE_RETIRED` | `reasoning.lifecycle.retired` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_HYPOTHESIS_GENERATED` | `reasoning.operation.hypothesis_generated` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_HYPOTHESIS_WEAKENED` | `reasoning.operation.hypothesis_weakened` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_HYPOTHESIS_REJECTED` | `reasoning.operation.hypothesis_rejected` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_ALTERNATIVE_GENERATED` | `reasoning.operation.alternative_generated` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_ALTERNATIVE_DISCARDED` | `reasoning.operation.alternative_discarded` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_CONSTRAINT_VIOLATED` | `reasoning.operation.constraint_violated` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_INFERENCE_PERFORMED` | `reasoning.operation.inference_performed` |
| src/core/engines/reasoning/ReasoningEvents.ts | `OPERATION_CONCLUSION_BUILT` | `reasoning.operation.conclusion_built` |
| src/core/engines/reasoning/ReasoningEvents.ts | `METRICS_UPDATED` | `reasoning.metrics.updated` |
| src/core/engines/recommendation/RecommendationEvents.ts | `LIFECYCLE_INITIATED` | `recommendation.lifecycle.initiated` |
| src/core/engines/recommendation/RecommendationEvents.ts | `LIFECYCLE_COMPLETED` | `recommendation.lifecycle.completed` |
| src/core/engines/recommendation/RecommendationEvents.ts | `LIFECYCLE_FAILED` | `recommendation.lifecycle.failed` |

### Hardcoded Event Names (0)

✅ No hardcoded event names found — all use canonical constants.

## Dead Code Report

| Type | Description | File | Line | Severity |
|------|-------------|------|------|----------|
| ORPHAN_SUBSCRIBER | Subscribes to "RUNTIME_EVENTS.RUNTIME_EMERGENCY" but no emitter found | src/core/engines/attention/AttentionEngine.ts | 136 | 🔴 HIGH |
| ORPHAN_SUBSCRIBER | Subscribes to "RUNTIME_EVENTS.RUNTIME_CONTEXT_CHANGE" but no emitter found | src/core/engines/attention/AttentionEngine.ts | 148 | 🔴 HIGH |
| ORPHAN_SUBSCRIBER | Subscribes to "decision.lifecycle.accepted" but no emitter found | src/core/engines/learning/LearningEngine.ts | 105 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/attention/AttentionEngine.ts | 52 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "attention.operation.focused" but no subscriber found | src/core/engines/attention/AttentionPipeline.ts | 263 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "attention.operation.defocused" but no subscriber found | src/core/engines/attention/AttentionPipeline.ts | 295 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "attention.operation.interrupted" but no subscriber found | src/core/engines/attention/AttentionPipeline.ts | 333 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "attention.lifecycle.deferred" but no subscriber found | src/core/engines/attention/AttentionPipeline.ts | 363 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "attention.operation.released" but no subscriber found | src/core/engines/attention/AttentionPipeline.ts | 394 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/decision/DecisionEngine.ts | 54 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/evidence/EvidenceEngine.ts | 55 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "evidence.evaluation.started" but no subscriber found | src/core/engines/evidence/EvidencePipeline.ts | 68 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "evidence.evaluation.failed" but no subscriber found | src/core/engines/evidence/EvidencePipeline.ts | 197 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/execution/ExecutionEngine.ts | 53 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/knowledge/KnowledgeEngine.ts | 53 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "knowledge.operation.extracted" but no subscriber found | src/core/engines/knowledge/KnowledgePipeline.ts | 114 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "knowledge.operation.generalized" but no subscriber found | src/core/engines/knowledge/KnowledgePipeline.ts | 202 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "knowledge.operation.specialized" but no subscriber found | src/core/engines/knowledge/KnowledgePipeline.ts | 238 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "knowledge.operation.deprecated" but no subscriber found | src/core/engines/knowledge/KnowledgePipeline.ts | 311 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/learning/LearningEngine.ts | 54 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/memory/MemoryEngine.ts | 67 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "memory.operation.created" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 86 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.strengthened" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 154 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.weakened" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 176 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.forgotten" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 197 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.reactivated" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 228 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.compressed" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 249 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.merged" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 276 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.associated" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 297 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "memory.operation.detached" but no subscriber found | src/core/engines/memory/MemoryPipeline.ts | 317 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.potential_detected" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 70 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.lifecycle.candidate_verified" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 88 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.lifecycle.context_assigned" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 97 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.deprecated" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 232 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.quality.corrected" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 233 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.lifecycle.pattern_evidence_linked" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 259 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.lifecycle.knowledge_evidence_linked" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 280 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "observation.lifecycle.archived" but no subscriber found | src/core/engines/observation/ObservationPipeline.ts | 295 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/pattern/PatternEngine.ts | 54 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.potential_detected" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 133 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.emerging_confirmed" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 134 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.pattern_updated" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 168 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.discovery.correlation_found" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 196 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.discovery.trend_detected" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 228 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.discovery.anomaly_detected" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 258 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.discovery.sequence_discovered" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 288 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "pattern.lifecycle.deprecated" but no subscriber found | src/core/engines/pattern/PatternPipeline.ts | 323 | 🟡 MEDIUM |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/planning/PlanningEngine.ts | 53 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/prediction/PredictionEngine.ts | 53 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/reasoning/ReasoningEngine.ts | 44 | 🔴 HIGH |
| ORPHAN_EMITTER | Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found | src/core/engines/recommendation/RecommendationEngine.ts | 53 | 🔴 HIGH |

## Payload Compatibility

| Producer | Consumer | Event | Issue | Severity |
|----------|----------|-------|-------|----------|
| src/core/engines/attention/AttentionPipeline.ts | src/core/engines/reasoning/ReasoningEngine.ts | `attention.operation.prioritized` | Producer emits flat payload {attentionId, name, category, priority} but consumer expects nested {attention: {id, identity, provenance}} — fallback paths used, provenance lost | 🟡 MEDIUM |

## Hot Spot Analysis

> **Note**: Full fan-in/fan-out analysis requires codebase-memory MCP.
> Run in agent context: `get_architecture()` or `search_graph()`.

| File | Event Bindings | Risk |
|------|---------------|------|
| src/core/engines/memory/MemoryPipeline.ts | 9 | 🔴 CRITICAL |
| src/core/engines/observation/ObservationPipeline.ts | 9 | 🔴 CRITICAL |
| src/core/engines/pattern/PatternPipeline.ts | 8 | 🔴 CRITICAL |
| src/core/engines/attention/AttentionPipeline.ts | 6 | 🟡 HIGH |
| src/core/engines/attention/AttentionEngine.ts | 4 | 🟢 MEDIUM |
| src/core/engines/knowledge/KnowledgeEngine.ts | 4 | 🟢 MEDIUM |
| src/core/engines/knowledge/KnowledgePipeline.ts | 4 | 🟢 MEDIUM |
| src/core/engines/memory/MemoryEngine.ts | 4 | 🟢 MEDIUM |
| src/core/engines/evidence/EvidenceEngine.ts | 3 | 🟢 MEDIUM |
| src/core/engines/evidence/EvidencePipeline.ts | 3 | 🟢 MEDIUM |

## Recommended Actions

### 🔴 Critical (15)

- **ORPHAN_SUBSCRIBER**: Subscribes to "RUNTIME_EVENTS.RUNTIME_EMERGENCY" but no emitter found (src/core/engines/attention/AttentionEngine.ts:136)
- **ORPHAN_SUBSCRIBER**: Subscribes to "RUNTIME_EVENTS.RUNTIME_CONTEXT_CHANGE" but no emitter found (src/core/engines/attention/AttentionEngine.ts:148)
- **ORPHAN_SUBSCRIBER**: Subscribes to "decision.lifecycle.accepted" but no emitter found (src/core/engines/learning/LearningEngine.ts:105)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/attention/AttentionEngine.ts:52)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/decision/DecisionEngine.ts:54)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/evidence/EvidenceEngine.ts:55)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/execution/ExecutionEngine.ts:53)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/knowledge/KnowledgeEngine.ts:53)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/learning/LearningEngine.ts:54)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/memory/MemoryEngine.ts:67)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/pattern/PatternEngine.ts:54)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/planning/PlanningEngine.ts:53)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/prediction/PredictionEngine.ts:53)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/reasoning/ReasoningEngine.ts:44)
- **ORPHAN_EMITTER**: Emits "RUNTIME_EVENTS.ENGINE_STATE_CHANGE" but no subscriber found (src/core/engines/recommendation/RecommendationEngine.ts:53)

### 🟡 Medium (37)

- **ORPHAN_EMITTER**: Emits "attention.operation.focused" but no subscriber found (src/core/engines/attention/AttentionPipeline.ts:263)
- **ORPHAN_EMITTER**: Emits "attention.operation.defocused" but no subscriber found (src/core/engines/attention/AttentionPipeline.ts:295)
- **ORPHAN_EMITTER**: Emits "attention.operation.interrupted" but no subscriber found (src/core/engines/attention/AttentionPipeline.ts:333)
- **ORPHAN_EMITTER**: Emits "attention.lifecycle.deferred" but no subscriber found (src/core/engines/attention/AttentionPipeline.ts:363)
- **ORPHAN_EMITTER**: Emits "attention.operation.released" but no subscriber found (src/core/engines/attention/AttentionPipeline.ts:394)
- **ORPHAN_EMITTER**: Emits "evidence.evaluation.started" but no subscriber found (src/core/engines/evidence/EvidencePipeline.ts:68)
- **ORPHAN_EMITTER**: Emits "evidence.evaluation.failed" but no subscriber found (src/core/engines/evidence/EvidencePipeline.ts:197)
- **ORPHAN_EMITTER**: Emits "knowledge.operation.extracted" but no subscriber found (src/core/engines/knowledge/KnowledgePipeline.ts:114)
- **ORPHAN_EMITTER**: Emits "knowledge.operation.generalized" but no subscriber found (src/core/engines/knowledge/KnowledgePipeline.ts:202)
- **ORPHAN_EMITTER**: Emits "knowledge.operation.specialized" but no subscriber found (src/core/engines/knowledge/KnowledgePipeline.ts:238)
- **ORPHAN_EMITTER**: Emits "knowledge.operation.deprecated" but no subscriber found (src/core/engines/knowledge/KnowledgePipeline.ts:311)
- **ORPHAN_EMITTER**: Emits "memory.operation.created" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:86)
- **ORPHAN_EMITTER**: Emits "memory.operation.strengthened" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:154)
- **ORPHAN_EMITTER**: Emits "memory.operation.weakened" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:176)
- **ORPHAN_EMITTER**: Emits "memory.operation.forgotten" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:197)
- **ORPHAN_EMITTER**: Emits "memory.operation.reactivated" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:228)
- **ORPHAN_EMITTER**: Emits "memory.operation.compressed" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:249)
- **ORPHAN_EMITTER**: Emits "memory.operation.merged" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:276)
- **ORPHAN_EMITTER**: Emits "memory.operation.associated" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:297)
- **ORPHAN_EMITTER**: Emits "memory.operation.detached" but no subscriber found (src/core/engines/memory/MemoryPipeline.ts:317)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.potential_detected" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:70)
- **ORPHAN_EMITTER**: Emits "observation.lifecycle.candidate_verified" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:88)
- **ORPHAN_EMITTER**: Emits "observation.lifecycle.context_assigned" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:97)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.deprecated" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:232)
- **ORPHAN_EMITTER**: Emits "observation.quality.corrected" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:233)
- **ORPHAN_EMITTER**: Emits "observation.lifecycle.pattern_evidence_linked" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:259)
- **ORPHAN_EMITTER**: Emits "observation.lifecycle.knowledge_evidence_linked" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:280)
- **ORPHAN_EMITTER**: Emits "observation.lifecycle.archived" but no subscriber found (src/core/engines/observation/ObservationPipeline.ts:295)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.potential_detected" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:133)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.emerging_confirmed" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:134)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.pattern_updated" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:168)
- **ORPHAN_EMITTER**: Emits "pattern.discovery.correlation_found" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:196)
- **ORPHAN_EMITTER**: Emits "pattern.discovery.trend_detected" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:228)
- **ORPHAN_EMITTER**: Emits "pattern.discovery.anomaly_detected" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:258)
- **ORPHAN_EMITTER**: Emits "pattern.discovery.sequence_discovered" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:288)
- **ORPHAN_EMITTER**: Emits "pattern.lifecycle.deprecated" but no subscriber found (src/core/engines/pattern/PatternPipeline.ts:323)
- **PAYLOAD_MISMATCH**: Producer emits flat payload {attentionId, name, category, priority} but consumer expects nested {attention: {id, identity, provenance}} — fallback paths used, provenance lost (src/core/engines/reasoning/ReasoningEngine.ts:123)

## Decision

⚠️ **IMPLEMENT WITH CAUTION** — 15 critical issues found.

---
*Report generated by ARCH-002 Continuous Architecture Watchdog*

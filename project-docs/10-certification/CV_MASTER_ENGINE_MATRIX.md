# CV MASTER ENGINE MATRIX — Cross-Engine Reference

**Date:** 2026-06-28

---

## ENGINE IMPLEMENTATION MATRIX

### Legend
| Column | Description |
|--------|-------------|
| Pattern | Follows standardized VS1-012 pattern (Types/Contracts/Errors/Lifecycle/Metrics/Memory/Builder/Pipeline/Engine) |
| ID Format | Entity ID generation pattern |
| Subscribes | Event the engine listens to |
| Emits | Events the engine produces |
| Lifecycle Stages | State machine stages |
| Tests | Test files and passing count |
| Pattern % | Percentage of pattern files implemented |

### Matrix

| Engine | Pattern | ID Format | Subscribes | Emits | Lifecycle Stages | Tests | Files | Pattern% |
|--------|:-------:|-----------|------------|-------|-----------------|:-----:|:-----:|:--------:|
| Observation | ❌ Early | `obs-{timestamp}` | Runtime.receive() | `observation.*` | PENDING→IN_PROGRESS→VERIFIED→COMPLETED→FAILED→DEPRECATED→CORRECTED | 7 files | 20 | 60% |
| Pattern | ❌ Early | `pat-{type}-{obsId}` | `observation.*` | `pattern.*` | EMERGING→STRENGTHENING→MATURE→DECAYING | 3 files | 24 | 60% |
| Evidence | ❌ Early | `ev-{timestamp}` | None verified | `evidence.*` | INITIATED→COLLECTED→ANALYZED→CORROBORATED→CONSOLIDATED→ARCHIVED | **0 files** | 21 | 60% |
| Memory | ❌ Early | `mem-{patternId}` | `pattern.*` | `memory.*` | RAW→PROCESSED→CONSOLIDATED→ARCHIVED | 3 files | 27 | 60% |
| Knowledge | ❌ Early | `know-{memoryId}` | `memory.*` | `knowledge.*` | INITIATED→PROCESSED→VALIDATED→COMPLETED→ARCHIVED | 0 files | 27 | 60% |
| Attention | ❌ Early | `attn-{priority}-{ts}` | `knowledge.*` | `attention.*` | QUEUED→PRIORITIZED→COMPETED→RESOLVED→ARCHIVED | 2 files | 24 | 60% |
| Reasoning | ❌ Early | `reason-{timestamp}` | `attention.*` | `reasoning.*` | INITIATED→ANALYZING→EVALUATING→FORMULATING→COMPLETED | 1 file | 27 | 60% |
| Decision | ✅ VS1-012 | `dec-{reasoningId}` | `reasoning.lifecycle.completed` | `decision.*` (8 events) | 14 stages: CANDIDATE→...→ACCEPTED/REJECTED | 1 file (7 pass) | 13 | **100%** |
| Learning | ✅ VS1-013 | `learn-{decisionId}` | `decision.lifecycle.initiated` | `learning.*` (3 events) | INITIATED→...→KNOWLEDGE_UPDATED→COMPLETED | 1 file (3 pass) | 13 | **100%** |
| Prediction | ✅ VS1-014 | `pred-{learningId}` | `learning.lifecycle.completed` | `prediction.*` (3 events) | INITIATED→...→PREDICTION_READY→COMPLETED | 1 file (2 pass) | 13 | **100%** |
| Recommendation | ✅ VS1-015 | `rec-{predictionId}` | `prediction.lifecycle.completed` | `recommendation.*` (3 events) | INITIATED→ANALYZED→PRIORITIZED→OPTIMIZED→READY→COMPLETED | 1 file (3 pass) | 14 | **100%** |
| Planning | ✅ VS1-016 | `plan-{recommendationId}` | `recommendation.lifecycle.completed` | `planning.*` (3 events) | INITIATED→...→READY→COMPLETED | 1 file (3 pass) | 14 | **100%** |
| Execution | ✅ VS1-017 | `exec-{planId}` | `planning.lifecycle.completed` | `execution.*` (4 events) | INITIATED→QUEUED→PREPARING→RUNNING→VERIFYING→COMPLETED | 1 file (3 pass) | 14 | **100%** |

---

## FILE EXISTENCE MATRIX

| Required File | Obs | Pat | Ev | Mem | Know | Attn | Reas | Dec | Learn | Pred | Rec | Plan | Exec |
|:---|---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Types | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contracts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Errors | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Lifecycle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Metrics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Memory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Builder/Generator | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅Eval | ✅Bld | ✅Fore | ✅Eval+Bld | ✅Gen+Bld | ✅Run+Bld |
| Pipeline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Validator | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Engine | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| index.ts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Events | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tests | 7 | 3 | **0** | 3 | 0 | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |

---

## EVENT PROPAGATION MATRIX

### Downstream Chain (Reasoning → Execution)

| Event | Producer | Consumer | Payload Shape | businessId |
|-------|----------|----------|---------------|:----------:|
| `reasoning.lifecycle.completed` | ReasoningEngine | DecisionEngine | Flat `{reasoningId, alternatives, ...}` | ✅ |
| `decision.lifecycle.initiated` | DecisionPipeline | LearningEngine | `entity.decision{}` + `decision{}` | ✅ |
| `decision.lifecycle.committed` | DecisionPipeline | (unused) | `entity.decision{}` + `decision{}` | ✅ |
| `learning.lifecycle.completed` | LearningPipeline | PredictionEngine | `entity.learning{}` + `learning{}` | ✅ (after VS1-014 fix) |
| `prediction.lifecycle.completed` | PredictionPipeline | RecommendationEngine | `entity.prediction{}` + `prediction{}` | ✅ (after VS1-014 fix) |
| `recommendation.lifecycle.completed` | RecommendationPipeline | PlanningEngine | `entity.recommendation{}` + `recommendation{}` | ✅ |
| `planning.lifecycle.completed` | PlanningPipeline | ExecutionEngine | `entity.plan{}` + `plan{}` | ✅ (after VS1-017 fix) |
| `execution.lifecycle.completed` | ExecutionPipeline | (terminal) | `entity.execution{}` + `execution{}` | ✅ |

### Upstream Chain (Observation → Reasoning)

| Event | Producer | Consumer | Payload Shape | businessId |
|-------|----------|----------|---------------|:----------:|
| `observation.lifecycle.verified` | ObservationPipeline | PatternEngine | `entity.observation{}` | ✅ |
| `pattern.lifecycle.detected` | PatternPipeline | MemoryEngine | `entity.pattern{}` | ✅ |
| `memory.lifecycle.consolidated` | MemoryPipeline | KnowledgeEngine | `entity.memory{}` | ✅ |
| `knowledge.lifecycle.created` | KnowledgePipeline | AttentionEngine | `entity.knowledge{}` | ✅ |
| `attention.lifecycle.resolved` | AttentionPipeline | ReasoningEngine | `entity.attention{}` | ✅ |

---

## DETERMINISTIC ID CHAIN

```
reasoningId (input)
  → dec-{reasoningId}          (DecisionResult.id)
    → learn-{dec-id}            (LearningEntity.id)
      → pred-{learn-id}          (PredictionEntity.id)
        → rec-{pred-id}           (RecommendationEntity.id)
          → plan-{rec-id}          (PlanningEntity.id)
            → exec-{plan-id}        (ExecutionEntity.id)
```

**Property:** Given a `reasoningId`, ALL 6 downstream entity IDs are computable without any runtime state.

---

## LIFECYCLE STATE CROSS-REFERENCE

| Engine | Stages Count | Terminal States | Active States | Max Depth |
|--------|:-----------:|:---------------:|:-------------:|:---------:|
| Observation | 7 | COMPLETED, FAILED, DEPRECATED, CORRECTED | PENDING, IN_PROGRESS, VERIFIED | 7 |
| Pattern | 4 | MATURE, DECAYING | EMERGING, STRENGTHENING | 4 |
| Evidence | 6 | CONSOLIDATED, ARCHIVED | INITIATED, COLLECTED, ANALYZED, CORROBORATED | 6 |
| Memory | 4 | CONSOLIDATED, ARCHIVED | RAW, PROCESSED | 4 |
| Knowledge | 5 | COMPLETED, ARCHIVED | INITIATED, PROCESSED, VALIDATED | 5 |
| Attention | 5 | RESOLVED, ARCHIVED | QUEUED, PRIORITIZED, COMPETED | 5 |
| Reasoning | 5 | COMPLETED | INITIATED, ANALYZING, EVALUATING, FORMULATING | 5 |
| Decision | 14 | ACCEPTED, REJECTED, ARCHIVED, RETIRED | CANDIDATE, CONTEXT_READY, ALTERNATIVES_BUILT, RISK_EVALUATED, OPPORTUNITY_EVALUATED, COST_EVALUATED, HUMAN_IMPACT_EVALUATED, REVERSIBILITY_EVALUATED, CONFIDENCE_VERIFIED, PROPOSAL_BUILT, WAITING_HUMAN_REVIEW, MODIFIED | 14 |
| Learning | 6 | COMPLETED, FAILED | INITIATED, OBSERVATION_COLLECTED, OUTCOME_ANALYZED, PATTERN_DERIVED, KNOWLEDGE_UPDATED | 6 |
| Prediction | 6 | COMPLETED, FAILED | INITIATED, DATA_COLLECTED, MODEL_APPLIED, CONFIDENCE_EVALUATED, PREDICTION_READY | 6 |
| Recommendation | 6 | COMPLETED, FAILED, ARCHIVED | INITIATED, ANALYZED, PRIORITIZED, OPTIMIZED, READY | 6 |
| Planning | 7 | COMPLETED, FAILED, ARCHIVED | INITIATED, ANALYZED, PLAN_GENERATED, OPTIMIZED, VALIDATED, READY | 7 |
| Execution | 6 | COMPLETED, FAILED, ARCHIVED, CANCELLED | INITIATED, QUEUED, PREPARING, RUNNING, VERIFYING | 6 |

---

## METRICS CROSS-REFERENCE

| Engine | Counters | Averages | Stage Tracking | Snapshot |
|--------|----------|----------|:--------------:|:--------:|
| Observation | Ingestion, verification, quality failure counts; source telemetry | Source reliability ratios | ✅ | ✅ |
| Pattern | Patterns detected by type | Confidence per pattern | ✅ | ✅ |
| Evidence | Evidence collected/corroborated | Confidence | ✅ | ✅ |
| Memory | Memories created/consolidated/archived | Confidence | ✅ | ✅ |
| Knowledge | Knowledge created/archived | Quality score | ✅ | ✅ |
| Attention | Items queued/prioritized/resolved | Priority distribution | ✅ | ✅ |
| Reasoning | Reasoning cycles completed | Confidence, alternatives | ✅ | ✅ |
| Decision | Proposals created/accepted/rejected | Confidence, alternatives | ✅ | ✅ |
| Learning | Cycles completed/failed | Confidence, patterns derived | ✅ | ✅ |
| Prediction | Predictions completed/failed | Confidence, probability | ✅ | ✅ |
| Recommendation | Recommendations completed/archived/failed | Confidence, priority | ✅ | ✅ |
| Planning | Plans completed/archived/failed | Confidence, steps | ✅ | ✅ |
| Execution | Executions completed/failed/cancelled | Confidence, duration | ✅ | ✅ |
| Runtime (global) | Events published/delivered, dead letters, memory usage | Uptime | ✅ | ✅ |

---

## VALIDATOR BACKWARD COMPATIBILITY MATRIX

| Engine | `extractFromXxx` | Handles `entity.*` | Handles flat `*` | Validated in tests |
|--------|:----------------:|:------------------:|:----------------:|:------------------:|
| Decision | N/A (subscribe handler in Engine) | ✅ (via `resolveAlternatives`) | ✅ (flat reasoning event) | ✅ |
| Learning | `extractFromDecisionEvent` | ✅ | ✅ | ✅ (VS1-013 test 3) |
| Prediction | `extractFromLearningEvent` | ✅ | ✅ | ✅ (VS1-014) |
| Recommendation | `extractFromPredictionEvent` | ✅ | ✅ | ✅ (VS1-015 test 3) |
| Planning | `extractFromRecommendationEvent` | ✅ | ✅ | ✅ (VS1-016 test 3) |
| Execution | `extractFromPlanEvent` | ✅ | ✅ | ✅ (VS1-017 test 3) |

---

## TEST COVERAGE MATRIX

| Engine | Test Files | VS Tests | E2E Tests | Unit Tests | Total Pass | Total Fail |
|--------|:----------:|:--------:|:---------:|:----------:|:----------:|:----------:|
| Observation | 7 | 0 | 2 | 5 | ✅ | 0 |
| Pattern | 3 | 2 | 2 | 1 | ✅ | 0 |
| Evidence | **0** | 0 | 0 | 0 | **N/A** | **N/A** |
| Memory | 3 | 1 | 1 | 2 | ✅ | 0 |
| Knowledge | 0 | 0 | 0 | 0 | *indirect* | 0 |
| Attention | 2 | 0 | 0 | 2 | ⚠️ | **6** |
| Reasoning | 1 | 0 | 0 | 1 | ✅ | 0 |
| Decision | 1 | 1 | 1 | 0 | ✅ | 0 |
| Learning | 1 | 1 | 1 | 0 | ✅ | 0 |
| Prediction | 1 | 1 | 1 | 0 | ✅ | 0 |
| Recommendation | 1 | 1 | 1 | 0 | ✅ | 0 |
| Planning | 1 | 1 | 1 | 0 | ✅ | 0 |
| Execution | 1 | 1 | 1 | 0 | ✅ | 0 |

**Total Passing (all VS1 e2e):** 14/14
**Total Passing (all engine tests):** 205/211 (6 Attention failures)

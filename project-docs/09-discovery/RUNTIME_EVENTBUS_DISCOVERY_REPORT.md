# Runtime EventBus Discovery Report

**VS1-010 — Runtime Event Contract Discovery**

**Date:** 2026-06-28
**Author:** Chief Product Architect (Agentic)
**Status:** Discovery Complete
**Scope:** All `src/core/runtime/` + 13 cognitive engines in `src/core/engines/*/`

---

## Executive Summary

The Runtime EventBus is a simple in-memory publish-subscribe system. It supports priority-ordered dispatch, dead letter capture, and a bounded event history (1000 events). However, it lacks tracing, correlation, typed envelopes, replay, persistence, and namespace isolation. Each of the 13 cognitive engines defines its own event schema independently, resulting in 11 distinct payload envelope shapes across the codebase. The implicit orchestration pipeline (Observation → Pattern → Evidence → Memory → Knowledge → Attention → Reasoning → Decision → Learning → Prediction → Recommendation → Planning → Execution) relies entirely on event pub/sub ordering, which is not guaranteed beyond subscriber priority level.

---

## 1. EventBus Architecture

### 1.1 Core Implementation (`src/core/runtime/EventBus.ts`)

| Property | Value |
|----------|-------|
| Subscription model | In-memory `Map<string, Set<Subscriber>>` |
| Dispatch order | Priority-sorted (CRITICAL > HIGH > NORMAL > LOW > BACKGROUND) |
| History limit | 1000 events (configurable via `eventHistoryLimit`) |
| History eviction | FIFO on every `emit()` when over limit |
| Dead letters | Array of `{event, subscriber, error, timestamp}` |
| Event ID format | `evt_<sequential counter>` |
| Timestamp source | `Clock.now()` → `new Date().toISOString()` |
| Correlation support | None |
| Namespace isolation | None |

### 1.2 CognitiveEvent Envelope

```typescript
interface CognitiveEvent {
  id: string;        // "evt_N" sequential, no domain prefix
  type: string;      // event name string (e.g. "memory.lifecycle.consolidated")
  source: string;    // emitter identifier (e.g. "MemoryEngine")
  timestamp: string; // ISO 8601
  payload: unknown;  // raw payload — no structure guarantees
}
```

**CRITICAL: `emit()` passes `payload` directly to subscriber handlers — the `CognitiveEvent` envelope is stripped.** Subscribers never see `id`, `source`, or `timestamp` of the wrapper event.

### 1.3 Priority Levels (5 tiers)

| Priority | Purpose |
|----------|---------|
| CRITICAL | Lifecycle transitions, emergencies |
| HIGH | Pipeline state changes, high-urgency operations |
| NORMAL | Standard domain events (default) |
| LOW | Metrics, non-critical updates |
| BACKGROUND | Audit, archival, maintenance |

Default priority is `NORMAL` unless specified via overloaded `emit()` signature.

---

## 2. Event Inventory — 13 Engines + Runtime

### 2.1 Runtime Events (6 events, `src/core/runtime/RuntimeEvents.ts`)

| Event Name | Emitter | Subscribers | Payload Shape |
|---|---|---|---|
| `runtime.engine_state_change` | Individual engines on start() | ? | `{engine, from, to}` |
| `runtime.emergency` | Runtime | AttentionEngine | `{entity?.sourceId, sourceId, priority, reason}` |
| `runtime.context_change` | Runtime | AttentionEngine | `{loadLevel}` |
| `runtime.started` | Runtime.boot() | ? | `{version, timestamp}` |
| `runtime.shutting_down` | Runtime.stop() | ? | `{reason, timestamp}` |
| `runtime.order_received` | Runtime | ? | `{order}` (unused stub) |

### 2.2 Observation Engine (11 events)

**Events:** `observation.lifecycle.*` (potential_detected, candidate_verified, context_assigned, historical_committed, pattern_evidence_linked, knowledge_evidence_linked, archived) + `observation.quality.*` (deprecated, corrected) + `observation.pipeline.*` (verification_failed, quality_failed)

**Payload Envelope (ObservationPipeline.ts:322-333):**
```typescript
{ entity, observation, operation, timestamp, version }
```

**Consumers:**
- `observation.lifecycle.historical_committed` → `MemoryEngine`, `PatternEngine`

**Emission Source:** `ObservationPipeline.commitHistorical()`

### 2.3 Pattern Engine (16 events)

**Events:** `pattern.lifecycle.*` (potential_detected, candidate_evaluated, emerging_confirmed, supported_established, validated_confirmed, strengthening_observed, weakening_observed, deprecated, historical_archived, pattern_updated, pattern_conflict, pattern_merged) + `pattern.discovery.*` (correlation_found, trend_detected, anomaly_detected, sequence_discovered)

**Payload Envelope (PatternPipeline.ts:371-381):**
```typescript
{ entity: { pattern }, pattern, operation, timestamp, version }
```

**Consumers:**
- `*` (8 lifecycle+discovery events) → `MemoryEngine`
- `supported_established`, `validated_confirmed` → `EvidenceEngine`

---

### 2.4 Evidence Engine (21 events)

**Events:** `evidence.lifecycle.*` (candidate_created, collecting_started, supporting_established, conflicting_detected, weighted_calculated, validated_confirmed, rejected, historical_archived, archived) + `evidence.evaluation.*` (started, completed, failed) + `evidence.contradiction.*` (detected, resolved) + `evidence.relationship.discovered` + `evidence.metrics.updated`

**Payload Envelope (EvidencePipeline.ts:289-320):**
```typescript
{
  entity: { evidence },
  operation, evidenceId, patternId, patternName,
  stage, score, confidence,
  supportingCount, contradictingCount,
  timestamp, version
}
```

**Consumers:**
- `evidence.lifecycle.validated_confirmed` → `MemoryEngine`
- `evidence.evaluation.completed` → `MemoryEngine`

---

### 2.5 Memory Engine (27 events)

**Events:** `memory.lifecycle.*` (9 stages) + `memory.operation.*` (11 operations) + `memory.metrics.updated`

**Payload Envelope (MemoryPipeline.ts:386-398):**
```typescript
{ entity: { memory }, memory, operation, timestamp, version }
```

**Consumers:**
- `memory.lifecycle.consolidated` → `KnowledgeEngine`
- `memory.lifecycle.long_term_promoted` → `KnowledgeEngine`
- `memory.lifecycle.semantic_established` → `KnowledgeEngine`

---

### 2.6 Knowledge Engine (24 events)

**Events:** `knowledge.lifecycle.*` (10 stages) + `knowledge.operation.*` (8 operations) + `knowledge.metrics.updated`

**Payload Envelope (KnowledgePipeline.ts:391-403):**
```typescript
{ entity: { knowledge }, knowledge, operation, timestamp, version }
```

**Consumers:**
- `knowledge.lifecycle.validated` → `AttentionEngine`

---

### 2.7 Attention Engine (29 events)

**Events:** `attention.lifecycle.*` (9 stages) + `attention.operation.*` (11 operations) + `attention.budget.updated` + `attention.context.changed` + `attention.metrics.updated`

**Payload Envelope (AttentionPipeline.ts:495-506):**
```typescript
{ entity: { attention }, attention, operation, timestamp, version }
```

**Consumers:**
- `attention.operation.prioritized` → `ReasoningEngine`

---

### 2.8 Reasoning Engine (32 events)

**Events:** `reasoning.lifecycle.*` (17 stages) + `reasoning.operation.*` (8 operations) + `reasoning.metrics.updated`

**Payload Envelope (ReasoningPipeline.ts:390-410):**
```typescript
{ entity: { reasoning }, reasoning, operation, timestamp, version }
```

**Consumers:**
- `reasoning.lifecycle.completed` → `DecisionEngine`

---

### 2.9 Decision Engine (8 events)

**Events:** `decision.lifecycle.*` (initiated, evaluating, committed, archived) + `decision.operation.*` (initiated, approved, rejected, executed)

**Payload Envelope (DecisionPipeline.ts:27-55):**
```typescript
{ entity: { decision }, decision, operation, timestamp, version: 1 }
```

**Consumers:**
- `decision.lifecycle.initiated` → `LearningEngine`

---

### 2.10 Minimal Engines (3 events each)

**Learning** (4 events): `learning.lifecycle.*` (initiated, completed, accepted, failed)
**Prediction** (3 events): `prediction.lifecycle.*` (initiated, completed, failed)
**Recommendation** (3 events): `recommendation.lifecycle.*` (initiated, completed, failed)
**Planning** (3 events): `planning.lifecycle.*` (initiated, completed, failed)
**Execution** (3 events): `execution.lifecycle.*` (initiated, completed, failed)

All use minimal inline envelopes:
```typescript
{ entity: { ... }, operation, <domain>Id, <source>Id, timestamp, version: 1 }
```

**Subscription Chain:**
- `Learning.LIFECYCLE_INITIATED` also subscribes to `Decision.LIFECYCLE_INITIATED`
- `Prediction` ← `Learning.LIFECYCLE_COMPLETED`
- `Recommendation` ← `Prediction.LIFECYCLE_COMPLETED`
- `Planning` ← `Recommendation.LIFECYCLE_COMPLETED`
- `Execution` ← `Planning.LIFECYCLE_COMPLETED`

---

## 3. Implicit Orchestration Pipeline

```
Observation ──→ Pattern ──→ Evidence ──→ Memory ──→ Knowledge ──→ Attention
                             │              │
                             └←── Pattern ──┘
                                  (Memory also subscribes to Observation + Evidence directly)

Attention → Reasoning → Decision → Learning → Prediction → Recommendation → Planning → Execution
```

This pipeline is implicit. There is no orchestrator, no DAG, no sequencing guarantee. The pipeline order is determined by:
1. Event dispatch within EventBus (priority-ordered, then insertion order for same priority)
2. Engine registration order in Runtime bootstrap
3. setInterval polling intervals (Observation, Pattern, Memory, Attention all have polling loops)

---

## 4. Payload Envelope Inconsistency

There are 11 distinct payload envelope patterns across the codebase:

| Engine | Top-Level Fields | Entity Nesting | Domain Fields |
|--------|-----------------|----------------|---------------|
| Runtime | flat `{engine, from, to}` | None | Domain-specific |
| Observation | `entity`, `observation`, `operation`, `timestamp`, `version` | Full object | None at top |
| Pattern | `entity: {pattern}`, `pattern`, `operation`, `timestamp`, `version` | Nested | None at top |
| Memory | `entity: {memory}`, `memory`, `operation`, `timestamp`, `version` | Nested | None at top |
| Knowledge | `entity: {knowledge}`, `knowledge`, `operation`, `timestamp`, `version` | Nested | None at top |
| Evidence | `entity: {evidence}`, `operation`, `evidenceId`, `patternId`, `patternName`, `stage`, `score`, `confidence`, `supportingCount`, `contradictingCount`, `timestamp`, `version` | Nested + flat | 9 flat fields |
| Attention | `entity: {attention}`, `attention`, `operation`, `timestamp`, `version` | Nested | None at top |
| Reasoning | `entity: {reasoning}`, `reasoning`, `operation`, `timestamp`, `version` | Nested | None at top |
| Decision | `entity: {decision}`, `decision`, `operation`, `timestamp`, `version:1` | Nested | None at top |
| Execution | `entity: {execution}`, `operation`, `executionId`, `planId`, `planSummary`, `timestamp`, `version:1` | Nested + flat | 3 flat fields |
| Planning | `entity: {plan}`, `operation`, `planId`, `recommendationId`, `recommendationAction`, `timestamp`, `version:1` | Nested + flat | 3 flat fields |
| Learning | `entity: {learning}`, `operation`, `learningId`, `decisionId`, `decisionOutcome`, `timestamp`, `version:1` | Nested + flat | 3 flat fields |
| Prediction | `entity: {prediction}`, `operation`, `predictionId`, `learningId`, `learnedPattern`, `timestamp`, `version:1` | Nested + flat | 3 flat fields |
| Recommendation | `entity: {recommendation}`, `operation`, `recommendationId`, `predictionId`, `predictionForecast`, `timestamp`, `version:1` | Nested + flat | 3 flat fields |

This inconsistency forces every subscriber to use fragile deep-path extraction like:
```typescript
const pattern = ((p.entity as Record<string, unknown> | undefined)?.pattern as Record<string, unknown> | undefined) ??
  (p.pattern as Record<string, unknown> | undefined);
```

---

## 5. Subscriber Quality Analysis

### Error Handling Patterns

| Pattern | Count | Engines |
|---------|-------|---------|
| Audit log + rethrow | 2 | MemoryEngine (3 handlers) |
| Silently swallow | 10 | KnowledgeEngine, AttentionEngine, EvidenceEngine, ReasoningEngine, DecisionEngine, ExecutionEngine, PlanningEngine, LearningEngine, PredictionEngine, RecommendationEngine |
| No try/catch (sync handler) | 0 | — |

### Subscription Cleanup on Stop

| Engine | Unsubscribes on stop? |
|--------|----------------------|
| Observation | No subscriptions |
| Pattern | No |
| Memory | No |
| Knowledge | No |
| Evidence | No |
| Attention | No |
| Reasoning | No |
| Decision | No |
| Execution | No |
| Planning | No |
| Learning | No |
| Prediction | No |
| Recommendation | No |

**No engine unsubscribes from events when stopped.** This means stopped engines still receive and process events.

### Error Logging Quality

Only `MemoryEngine` captures contextual metadata (event name, entityId, businessId, error, stack) when a subscriber handler fails. All other engines either silently swallow errors or have empty catch blocks.

---

## 6. Missing Cross-Cutting Concerns

| Concern | Status | Risk |
|---------|--------|------|
| Correlation ID / Trace ID | Not present in any envelope | HIGH |
| Business ID propagation | Ad-hoc, field name varies (`businessId`, `business.id`, `business_id`) | HIGH |
| Event schema versioning | Version counter in some envelopes (incremented by `versions.length`) | MEDIUM |
| Deterministic replay | No event store, no offsets, no replay API | HIGH |
| Dead letter recovery | Dead letters collected but no replay interface | MEDIUM |
| Event TTL / retention | Fixed 1000-event FIFO; no time-based eviction | MEDIUM |
| Subscriber identity | Anonymous handler functions; no subscriber name/label | MEDIUM |
| Namespace isolation | All events in single bus; no domain-level filtering | LOW |
| Typed event contracts | Every engine defines own interface; no shared base type | MEDIUM |
| Event sourcing | Not used; events are fire-and-forget notifications | LOW (by design) |

---

## 7. File Reference Map

| Component | File | Lines |
|-----------|------|-------|
| EventBus | `src/core/runtime/EventBus.ts` | Full file |
| Runtime Events | `src/core/runtime/RuntimeEvents.ts` | Full file |
| Runtime Types | `src/core/runtime/RuntimeTypes.ts` | Full file |
| ObservationContracts | `src/core/engines/observation/ObservationContracts.ts` | Full file |
| Observation Events | `src/core/engines/observation/ObservationEvents.ts` | Full file |
| Pattern Events | `src/core/engines/pattern/PatternEvents.ts` | Full file |
| Evidence Events | `src/core/engines/evidence/EvidenceEvents.ts` | Full file |
| Memory Events | `src/core/engines/memory/MemoryEvents.ts` | Full file |
| Knowledge Events | `src/core/engines/knowledge/KnowledgeEvents.ts` | Full file |
| Attention Events | `src/core/engines/attention/AttentionEvents.ts` | Full file |
| Reasoning Events | `src/core/engines/reasoning/ReasoningEvents.ts` | Full file |
| Decision Events | `src/core/engines/decision/DecisionEvents.ts` | Full file |
| Execution Events | `src/core/engines/execution/ExecutionEvents.ts` | Full file |
| Planning Events | `src/core/engines/planning/PlanningEvents.ts` | Full file |
| Prediction Events | `src/core/engines/prediction/PredictionEvents.ts` | Full file |
| Learning Events | `src/core/engines/learning/LearningEvents.ts` | Full file |
| Recommendation Events | `src/core/engines/recommendation/RecommendationEvents.ts` | Full file |
| Observation Pipeline | `src/core/engines/observation/ObservationPipeline.ts:322-333` | Emit |
| Pattern Pipeline | `src/core/engines/pattern/PatternPipeline.ts:371-381` | Emit |
| Evidence Pipeline | `src/core/engines/evidence/EvidencePipeline.ts:289-320` | Emit |
| Memory Pipeline | `src/core/engines/memory/MemoryPipeline.ts:364-398` | Emit |
| Knowledge Pipeline | `src/core/engines/knowledge/KnowledgePipeline.ts:379-403` | Emit |
| Attention Pipeline | `src/core/engines/attention/AttentionPipeline.ts:486-506` | Emit |
| Reasoning Pipeline | `src/core/engines/reasoning/ReasoningPipeline.ts:390-410` | Emit |
| Memory Engine | `src/core/engines/memory/MemoryEngine.ts:156-339` | Subscriptions |
| Pattern Engine | `src/core/engines/pattern/PatternEngine.ts:118-165` | Subscriptions |
| Knowledge Engine | `src/core/engines/knowledge/KnowledgeEngine.ts:110-136` | Subscriptions |
| Evidence Engine | `src/core/engines/evidence/EvidenceEngine.ts:105-123` | Subscriptions |
| Attention Engine | `src/core/engines/attention/AttentionEngine.ts:133-218` | Subscriptions |
| Reasoning Engine | `src/core/engines/reasoning/ReasoningEngine.ts:120-130` | Subscriptions |
| Decision Engine | `src/core/engines/decision/DecisionEngine.ts:94-148` | Subscriptions |
| Execution Engine | `src/core/engines/execution/ExecutionEngine.ts:93-103` | Subscriptions |
| Planning Engine | `src/core/engines/planning/PlanningEngine.ts:93-103` | Subscriptions |
| Learning Engine | `src/core/engines/learning/LearningEngine.ts:94-112` | Subscriptions |
| Prediction Engine | `src/core/engines/prediction/PredictionEngine.ts:93-103` | Subscriptions |
| Recommendation Engine | `src/core/engines/recommendation/RecommendationEngine.ts:93-103` | Subscriptions |

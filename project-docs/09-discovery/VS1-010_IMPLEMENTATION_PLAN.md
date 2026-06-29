# VS1-010 Implementation Plan — Runtime Event Contract Standardization

**Date:** 2026-06-28
**Status:** Draft
**Effort Estimate:** 3-4 sprints (sequential, dependency-gated)

---

## Phase 1: Foundation (Sprint 1)

### P1-1: Add Correlation ID to CognitiveEvent

**Files:** `RuntimeTypes.ts`, `EventBus.ts`, `Runtime.ts`
**Change:**
```typescript
// RuntimeTypes.ts
interface CognitiveEvent {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  correlationId?: string;  // NEW
  businessId?: string;     // NEW
  payload: unknown;
}
```
- `EventBus.emit()`: accept optional `correlationId` and `businessId`, propagate into CognitiveEvent
- `Runtime.boot()`: generate correlationId for RUNTIME_STARTED
- `Runtime` entry points: accept optional correlationId from external stimulus

### P1-2: Pass Full CognitiveEvent Envelope to Subscribers

**Files:** `EventBus.ts`
**Change:** `emit()` passes `CognitiveEvent` instead of `event.payload` to subscribers.
- Subscriber signature changes from `(payload: unknown) => void` to `(event: CognitiveEvent) => void`
- All 26 subscriber handlers must be updated

### P1-3: Add EventBus.unsubscribeAll()

**Files:** `EventBus.ts`
**Change:** Add method `unsubscribeAll(source: string)` that removes all subscribers registered with a given source identifier.

### P1-4: Shared EngineEventEnvelope Type

**Files:** `ObservationContracts.ts` (or new `EventContracts.ts`)
**Change:** Define:
```typescript
interface EngineEventEnvelope<T> {
  correlationId?: string;
  businessId?: string;
  entity: T;
  operation: string;
  timestamp: string;
  version: number;
}
```

**Dependencies:** P1-1, P1-2

---

## Phase 2: Engine Payload Standardization (Sprint 2)

### P2-1: Standardize All emitEvent()/emitLifecycleEvent() Methods

**Files:** All pipeline files (ObservationPipeline, PatternPipeline, EvidencePipeline, MemoryPipeline, KnowledgePipeline, AttentionPipeline, ReasoningPipeline, DecisionPipeline, ExecutionPipeline, PlanningPipeline, LearningPipeline, PredictionPipeline, RecommendationPipeline)

**Change:** All emission sites must produce `EngineEventEnvelope`:
```typescript
{
  correlationId,     // propagated from input
  businessId,        // propagated from input
  entity: { ... },   // domain object
  operation,         // "CREATE" | "UPDATE" | "DELETE" | ...
  timestamp,
  version,
}
```
- Remove top-level flat fields (evidenceId, patternId, planId, etc.) — these belong in the entity object
- Remove duplicate entity nesting (`entity: { pattern }` AND `pattern: { ... }` — keep only `entity`)
- Evidence pipeline: flatten `entity: { evidence }` and remove top-level `evidenceId`, `patternId`, etc.

### P2-2: Standardize All Subscriber Unwrapping

**Files:** All engine `subscribeTo*()` methods
**Change:** Replace fragile deep-path extraction with typed entity access:
```typescript
// BEFORE:
const pattern = ((p.entity as Record<string, unknown> | undefined)?.pattern as Record<string, unknown> | undefined) ??
  (p.pattern as Record<string, unknown> | undefined);

// AFTER:
const event = p as EngineEventEnvelope<{ pattern: Pattern }>;
const pattern = event.entity.pattern;
```

### P2-3: Fix Event Namespace Inconsistency

**Files:** `LearningEvents.ts`
**Change:** Rename `decision.lifecycle.accepted` → `learning.lifecycle.accepted`

**Dependencies:** P1-4

---

## Phase 3: Reliability (Sprint 3)

### P3-1: Standardized Error Handling

**Files:** All engine subscriber methods
**Change:** Every catch block must:
1. Attempt to log to audit pipeline with payload context
2. Optionally record to recovery pipeline for retryable errors
3. Include `correlationId`, `eventName`, `engineName`, `entityId` in error context

Template:
```typescript
catch (error) {
  await this.auditPipeline?.recordLog(this.name, "subscribe_handler", {
    event: eventName,
    correlationId: (payload as CognitiveEvent).correlationId,
    entityId: entity?.id,
    businessId: entity?.businessId,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });
  // Optionally:
  await this.recoveryPipeline?.registerFailure(...);
}
```

### P3-2: Subscription Cleanup on Stop

**Files:** All engine `stop()` methods + EngineRegistry
**Change:**
- Each engine stores unsubscribe tokens from `EventBus.subscribe()`
- `stop()` calls all stored unsubscribe functions
- Add `this.eventBus?.unsubscribeAll(this.name)` as fallback after P1-3

### P3-3: Dead Letter Replay

**Files:** `EventBus.ts`
**Change:** Add:
```typescript
replayDeadLetters(eventName?: string): Promise<void>;
replaySingleDeadLetter(index: number): Promise<void>;
```

### P3-4: Time-Based Event Retention

**Files:** `EventBus.ts`
**Change:** Add `retentionMs` config. On emit, evict events older than `retentionMs` in addition to count-based eviction.

**Dependencies:** Phase 1

---

## Phase 4: Observability & Validation (Sprint 4)

### P4-1: Per-Event-Type Metrics

**Files:** `RuntimeMetrics.ts`, `EventBus.ts`
**Change:** Add `Map<string, { publishCount, deliverCount, lastTimestamp, avgLatencyMs }>` to RuntimeMetrics. Hook increment into EventBus.emit() and subscriber dispatch.

### P4-2: Auto-Source on EventBus

**Files:** `EventBus.ts`, all engine constructors
**Change:** EventBus accepts optional `source` in constructor. If set, auto-populates `CognitiveEvent.source` on emit.

### P4-3: ObservationEngine State Emission

**Files:** `ObservationEngine.ts`
**Change:** Add `ENGINE_STATE_CHANGE` emission in `start()`. Add subscription cleanup.

### P4-4: Discriminated Union Types

**Files:** `EventBus.ts`
**Change:** (Optional, low priority) Implement:
```typescript
type EventMap = {
  [MEMORY_EVENTS.LIFECYCLE_CONSOLIDATED]: MemoryEventEnvelope;
  [EVIDENCE_EVENTS.LIFECYCLE_VALIDATED_CONFIRMED]: EvidenceEventEnvelope;
  // ...
};
type HandlerMap = {
  [K in keyof EventMap]: (event: EventMap[K]) => void;
};
```

**Dependencies:** Phase 2

---

## Effort Summary

| Phase | Tasks | Est. Effort | Risk |
|-------|-------|-------------|------|
| 1 — Foundation | 4 | 5-7 days | Low |
| 2 — Standardization | 3 | 8-10 days | Medium (breaking) |
| 3 — Reliability | 4 | 5-7 days | Low |
| 4 — Observability | 4 | 3-5 days | Low |
| **Total** | **15** | **21-29 days** | |

---

## Breaking Changes

| Change | Impact | Mitigation |
|--------|--------|------------|
| Subscriber signature change (payload → CognitiveEvent) | All 26+ handlers | Codemod; Phase 1 migration |
| Envelope flattening | Evidence, Execution, Planning, Learning, Prediction, Recommendation emit sites | Audit each subscriber for field access changes |
| Event rename (`decision.lifecycle.accepted` → `learning.lifecycle.accepted`) | LearningEngine subscriber | Update only the constant reference |

---

## Migration Strategy

1. **Phase 1** can be deployed independently — event bus internals change but outward behavior preserved (backward-compatible subscriber wrappers)
2. **Phase 2** requires coordinated deployment — change all emit sites and subscriber sites in same PR
3. **Phases 3-4** are additive — no breaking changes

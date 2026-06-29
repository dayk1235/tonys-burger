# VS1-010 Runtime Event Contract — Gap Analysis

**Date:** 2026-06-28
**Status:** Complete
**Priority:** HIGH (blocking event-driven architecture correctness)

---

## Gap 1: CognitiveEvent Envelope Stripped on Dispatch

**Severity:** CRITICAL
**Location:** `src/core/runtime/EventBus.ts` — `emit()` method
**Description:** `EventBus.emit(CognitiveEvent)` stores the full envelope in history, but passes only `event.payload` to subscriber handlers. Subscribers never receive `event.id`, `event.type`, `event.source`, or `event.timestamp`.
**Impact:** Subscribers cannot trace event provenance, cannot correlate events, cannot detect duplicates by event ID.
**Fix:** Pass the full `CognitiveEvent` envelope to subscribers (add `event.source`, `event.id`, `event.timestamp` to the argument).
**Dependencies:** All 26 subscriber handler signatures across 12 engines.

---

## Gap 2: No Correlation ID or Trace ID

**Severity:** CRITICAL
**Location:** `src/core/runtime/RuntimeTypes.ts` — `CognitiveEvent` interface
**Description:** The `CognitiveEvent` type has no `correlationId`, `traceId`, or `businessId` field. The only identifier is `id` (sequential `evt_N`). End-to-end tracking through the 10-stage pipeline is impossible.
**Impact:** Cannot trace a single stimulus (order/event) through Observation → Pattern → Evidence → Memory → Knowledge → Attention → Reasoning → Decision → Execution. Debugging production issues requires log correlation across 13+ services with no shared ID.
**Fix:** Add optional `correlationId` and `businessId` to `CognitiveEvent`. Propagate from Runtime entry points through all pipeline stages.
**Dependencies:** Gap 1 (envelope must be passed through), Runtime entry points (`Runtime.boot`, `Runtime.receiveInput`).

---

## Gap 3: No Typed Event Envelope Contracts

**Severity:** HIGH
**Location:** All `*Events.ts` files across 13 engines
**Description:** Each engine defines its own envelope type. There is no shared base type or interface that guarantees `{eventName, timestamp, source, payload}` or `{correlationId, businessId, entity}`. Evidence adds 9 flat fields on top of `entity`. The minimal engines (Decision, Execution, etc.) use ad-hoc inline shapes.
**Impact:** Every subscriber must perform unsafe casts and deep-path traversals to extract data. TypeScript's type safety is entirely bypassed with `as unknown as Record<string, unknown>` patterns.
**Fix:** Define a shared `EngineEventEnvelope<T>` generic type. All engine envelope factories must conform. This is a breaking change across all 13 engines.
**Dependencies:** Gap 4, Gap 5.

---

## Gap 4: No Cross-Engine Payload Shape Standard

**Severity:** HIGH
**Location:** All `emitEvent()` / `emitLifecycleEvent()` methods in pipeline files
**Description:** Payload shapes differ across engines. Some wrap entity under `entity: {engineType: object}`, others promote fields to top level. The `entity` wrapper key changes per engine (`entity: {pattern}`, `entity: {memory}`, `entity: {evidence}`, `entity: {knowledge}`, etc.).
**Impact:** The MemoryEngine subscriber (`MemoryEngine.ts:155-339`) must attempt 3+ different extraction strategies per event type to handle envelope variations across Observation, Pattern, and Evidence events.
**Fix:** Standardize all envelope emissions to use `{ correlationId, businessId, entity, operation, timestamp, version }` where `entity` contains the engine-specific domain object.
**Dependencies:** Gap 3.

---

## Gap 5: Subscriber Error Handling Inconsistency

**Severity:** HIGH
**Location:** All engine `start()` → `subscribeTo*()` methods
**Description:** MemoryEngine audit-logs errors with metadata. KnowledgeEngine, AttentionEngine, EvidenceEngine, ReasoningEngine, DecisionEngine, ExecutionEngine, PlanningEngine, LearningEngine, PredictionEngine, and RecommendationEngine silently swallow errors with empty `catch {}` blocks.
**Impact:** Silent failures in 10 of 12 subscriber engines. Pipeline failures go undetected. RecoveryPipeline never triggered.
**Fix:** All catch blocks must: (1) log to audit pipeline, (2) optionally record to recovery pipeline, (3) include payload context.
**Dependencies:** Gap 2 (correlation ID needed in error context).

---

## Gap 6: No Subscription Cleanup on Engine Stop

**Severity:** HIGH
**Location:** All engine `stop()` methods
**Description:** Zero engines unsubscribe from EventBus when stopped. The EventBus has no `unsubscribeAll(source)` method. The `EventBus.subscribe()` returns an unsubscribe function, but no engine stores it.
**Impact:** Stopped engines continue processing events. If restarted, they subscribe again, creating duplicate handlers. Memory consumption grows linearly with restart cycles.
**Fix:** (a) Add `EventBus.unsubscribeAll(source)` method. (b) Store unsubscribe tokens on engine instance. (c) Call unsubscribe in each engine's `stop()`.
**Dependencies:** None — self-contained fix.

---

## Gap 7: Implicit Pipeline Ordering — No Orchestration Guarantee

**Severity:** HIGH
**Location:** Cross-engine (no orchestrator exists)
**Description:** The 10-stage pipeline (Observation → … → Execution) is implicit. No DAG, no sequencing, no ordering guarantee. Event delivery order within same priority is insertion order. Engine registration order in `RuntimeBootstrap.ts` determines actual execution order.
**Impact:** Events may arrive out of order. A Decision may be Initiated before the Pattern that triggered it is fully processed. The 60-second polling intervals on Observation, Pattern, Memory, and Attention create race windows.
**Fix:** Two options: (a) Add explicit pipeline orchestrator with stage sequencing, (b) Make each engine idempotent and add ordering metadata (sequence number, causal dependency).
**Dependencies:** Gap 2, Gap 3.

---

## Gap 8: No Dead Letter Replay

**Severity:** MEDIUM
**Location:** `src/core/runtime/EventBus.ts` — `getDeadLetters()`
**Description:** Dead letters are collected but there is no `replayDeadLetters()` or `retry()` API. Events that failed to process are lost unless manually inspected.
**Impact:** System cannot self-heal from transient subscriber errors. Manual operator intervention required for dead letter recovery.
**Fix:** Add `replayDeadLetters(eventName)`, `replaySingleDeadLetter(index)` methods.
**Dependencies:** None.

---

## Gap 9: No Time-Based Event Retention

**Severity:** MEDIUM
**Location:** `src/core/runtime/EventBus.ts` — `addToHistory()`
**Description:** Event history eviction is purely count-based (FIFO at 1000). No TTL, no time-based eviction, no query interface for recent events by type or source.
**Impact:** Old events cannot be pruned by time even if memory is high. Cannot query "events from last 5 minutes".
**Fix:** Add `retentionMs` config, time-based eviction, indexed query by event type + time range.
**Dependencies:** None.

---

## Gap 10: ObservationEngine Lacks Runtime Event Emission

**Severity:** MEDIUM
**Location:** `src/core/engines/observation/ObservationEngine.ts:39-47`
**Description:** ObservationEngine is the only engine that does not emit `RUNTIME_EVENTS.ENGINE_STATE_CHANGE` in its `start()` method. It also has no subscriber setup at all.
**Impact:** Runtime cannot track ObservationEngine state transitions through the EventBus. ObservationEngine is invisible to the runtime's event-driven state tracking.
**Fix:** Add `ENGINE_STATE_CHANGE` emission in `ObservationEngine.start()`. Add unsubscribe tracking.
**Dependencies:** Gap 6.

---

## Gap 11: No Event Schema Validation

**Severity:** MEDIUM
**Location:** All pipeline emit functions
**Description:** Events are emitted with ad-hoc payloads assembled via object literals. There is no runtime validation that emitted events conform to their declared types. The `createXxxEventEnvelope()` factory functions in Memory, Knowledge, Attention, Evidence, Reasoning are optional — pipelines call this.eventBus.emit() directly with custom objects.
**Impact:** Silent schema drift. A code change to an emission site may break all subscribers of that event without any compile-time or test-time warning.
**Fix:** Enforce use of envelope factory functions. Optionally add Zod/zod validation in EventBus.emit() for event type registration + validation.
**Dependencies:** Gap 3, Gap 4.

---

## Gap 12: Event Names Not Used as Discriminated Unions

**Severity:** LOW
**Location:** All subscriber handlers
**Description:** `EventBus.subscribe(eventName, handler)` type-binds by event name string, but payload is typed as `unknown`. There is no discriminated union mapping event name → payload type.
**Impact:** TypeScript cannot infer payload type from event name. All handlers must cast `as Record<string, unknown>`.
**Fix:** Use TypeScript template literal types and mapped types to create `EventMap → HandlerMap` type-safe subscription API.
**Dependencies:** Gap 3, Gap 4.

---

## Gap 13: CognitiveEvent.source Based on `emit()` Parameter, Not Automated

**Severity:** LOW
**Location:** `src/core/runtime/EventBus.ts`
**Description:** The `source` field of `CognitiveEvent` is passed explicitly in the `emit()` parameter. There is no automatic source detection, no validation that source matches the calling engine's identity.
**Impact:** An engine could misrepresent its identity when emitting. Audit trails could be inaccurate.
**Fix:** Inject engine identity into EventBus on construction. Auto-populate `source` in EventBus.emit().
**Dependencies:** None.

---

## Gap 14: No Event Naming Convention Enforcement

**Severity:** LOW
**Location:** All `*Events.ts` files
**Description:** Event names follow loose `{domain}.{category}.{name}` convention but there is no validation against a registry. The `decision.lifecycle.accepted` event is defined in `LearningEvents.ts:4` — it uses the `decision.` prefix instead of `learning.`.
**Impact:** Inconsistency in namespacing. Potential collisions or confusion. The misplaced event (`decision.lifecycle.accepted` in LearningEvents) could cause subscription mismatches.
**Fix:** Audit all event names for prefix consistency. Add validation in EventBus that event names match a registered namespace for the engine.
**Dependencies:** None.

---

## Gap 15: No Event Production Metrics

**Severity:** LOW
**Location:** `src/core/runtime/RuntimeMetrics.ts`
**Description:** RuntimeMetrics tracks `eventPublishCount` and `eventDeliveredCount` but not per-event-type breakdown, per-source breakdown, or delivery latency.
**Impact:** No observability into which events dominate traffic, which sources are most active, or delivery performance.
**Fix:** Add per-event-type counters and latency histograms to RuntimeMetrics.
**Dependencies:** None.

---

## Gap Severity Summary

| Gap | Severity | Effort | Depends On | Category |
|-----|----------|--------|-----------|----------|
| 1 — Envelope stripped | CRITICAL | Small | — | Schema |
| 2 — No correlation ID | CRITICAL | Medium | Gap 1 | Tracing |
| 3 — No typed contract | HIGH | Large | Gaps 4, 5 | Schema |
| 4 — Payload inconsistency | HIGH | Large | Gap 3 | Schema |
| 5 — Error handling | HIGH | Medium | Gap 2 | Reliability |
| 6 — No unsubscribe | HIGH | Small | — | Lifecycle |
| 7 — No orchestration | HIGH | X-Large | Gaps 2, 3 | Architecture |
| 8 — No dead letter replay | MEDIUM | Small | — | Recovery |
| 9 — No time-based retention | MEDIUM | Small | — | Data Mgmt |
| 10 — ObservationEngine missing emit | MEDIUM | Trivial | Gap 6 | Lifecycle |
| 11 — No schema validation | MEDIUM | Medium | Gaps 3, 4 | Quality |
| 12 — No discriminated unions | LOW | Medium | Gaps 3, 4 | Types |
| 13 — No auto-source | LOW | Trivial | — | Security |
| 14 — Naming convention issue | LOW | Trivial | — | Quality |
| 15 — No per-event metrics | LOW | Small | — | Observability |

**Total: 15 gaps (2 CRITICAL, 4 HIGH, 4 MEDIUM, 5 LOW)**

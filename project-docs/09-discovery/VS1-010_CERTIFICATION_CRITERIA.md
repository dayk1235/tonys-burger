# VS1-010 Certification Criteria — Runtime Event Contract

**Date:** 2026-06-28
**Status:** Draft

---

## Tier 1: Event Envelope Integrity (P0 — Blocking)

| # | Criterion | Verification Method | Current Status |
|---|-----------|-------------------|----------------|
| C1 | EventBus.emit() passes the full CognitiveEvent envelope (id, type, source, timestamp, correlationId, businessId, payload) to subscriber handlers | Unit test: subscriber receives all fields | ❌ FAIL — envelope stripped |
| C2 | All CognitiveEvent instances carry a non-null correlationId | Runtime integration test | ❌ FAIL — no correlationId field |
| C3 | EngineEventEnvelope shape is identical across all 13 engines (entity, operation, timestamp, version) | TypeScript type check + snapshot test | ❌ FAIL — 11 different shapes |
| C4 | Event names follow `{domain}.{category}.{name}` convention without cross-domain prefix pollution | Lint rule or regex audit | ❌ FAIL — `decision.lifecycle.accepted` in LearningEvents |
| C5 | All subscriber handlers have proper try/catch with audit pipeline logging | Code review + test coverage | ❌ FAIL — 10 engines silently swallow |

---

## Tier 2: Lifecycle Integrity (P1 — Required)

| # | Criterion | Verification Method | Current Status |
|---|-----------|-------------------|----------------|
| C6 | Engine.stop() unsubscribes all event handlers | Integration test: stop engine, emit event, verify handler not called | ❌ FAIL — no engine unsubscribes |
| C7 | Engine state changes are always emitted on start/stop | Unit test per engine | ❌ FAIL — ObservationEngine missing |
| C8 | Dead letters are replayable via EventBus API | Integration test | ❌ FAIL — no replay API |
| C9 | Event history eviction respects both count limit AND time-based TTL | Unit test | ❌ FAIL — no TTL |
| C10 | Cumulative event delivery is monotonically increasing (no duplicate subscriptions) | Test: start/stop/start engine, verify single handler invocation | ❌ FAIL — no unsubscribe means duplicates on restart |

---

## Tier 3: Tracing & Debugging (P2 — Important)

| # | Criterion | Verification Method | Current Status |
|---|-----------|-------------------|----------------|
| C11 | An end-to-end pipeline trace (Observation → Pattern → … → Execution) can be reconstructed for a single stimulus using correlationId | Integration test: follow correlationId through all stages | ❌ FAIL — no correlationId |
| C12 | RuntimeMetrics reports per-event-type publish and delivery counts | Unit test | ❌ FAIL — only aggregate counts |
| C13 | Failed subscriber handlers include correlationId, eventName, entityId, and businessId in audit log | Test: inject handler failure, inspect audit record | ❌ FAIL — only MemoryEngine captures context |
| C14 | Subscribers can access the full CognitiveEvent metadata (id, source, timestamp) | Unit test | ❌ FAIL — only payload received |

---

## Tier 4: Quality & Maintenance (P3 — Nice to Have)

| # | Criterion | Verification Method | Current Status |
|---|-----------|-------------------|----------------|
| C15 | Emitted events conform to a shared TypeScript discriminated union (event name → payload type) | TypeScript compile check | ❌ FAIL — no discriminated union |
| C16 | Event source is automatically populated from engine identity (not manually passed) | Code review | ❌ FAIL — manual source parameter |
| C17 | Per-event-type latency metrics are available | Integration test | ❌ FAIL — no latency tracking |
| C18 | All event payloads are validated at emit time against a registered schema | Unit test | ❌ FAIL — no schema validation |

---

## Certification Summary

| Tier | Criteria | Pass | Fail | Blocking |
|------|----------|------|------|----------|
| T1 — Envelope Integrity (P0) | 5 | 0 | 5 | Yes |
| T2 — Lifecycle Integrity (P1) | 5 | 0 | 5 | Yes |
| T3 — Tracing & Debugging (P2) | 4 | 0 | 4 | No |
| T4 — Quality & Maintenance (P3) | 4 | 0 | 4 | No |
| **Total** | **18** | **0** | **18** | |

**Certification Status: NOT CERTIFIED — 0/18 criteria pass**

---

## Minimum Viable Certification (MVP)

To achieve MVP certification (Tier 1 + Tier 2 = 10 criteria):

1. Implement Phase 1 of implementation plan (Gaps 1, 2, 3, 6)
2. Standardize payload envelope across all engines (Gap 4)
3. Fix error handling in all subscriber catch blocks (Gap 5)
4. Add ObservationEngine state emission (Gap 10)

**Estimated effort: 2 sprints (13-17 days)**

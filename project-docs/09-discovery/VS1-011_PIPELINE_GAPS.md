# VS1-011 — Pipeline Gaps

---

## Critical Gaps

### GAP-001: Execution Pipeline Terminates in a Dead End
- **Severity:** CRITICAL
- **Evidence:** `src/core/engines/execution/ExecutionPipeline.ts:28-37`
- **Description:** `execution.lifecycle.initiated` has ZERO subscribers. No engine, service, or component consumes execution events. The pipeline ends here.
- **Impact:** No business action is ever taken. The entire cognitive pipeline produces nothing observable.

### GAP-002: No Persistence Layer
- **Severity:** CRITICAL
- **Evidence:** All repositories use `Map<string, Entity>` in memory
- **Description:** Observations, patterns, evidence, memories, knowledge, attention items, reasoning cases all exist only in memory. Runtime restart = complete data loss.
- **Impact:** Zero recovery capability. No audit trail survives restart.

### GAP-003: No Event Replay / Cold Start Recovery
- **Severity:** CRITICAL
- **Evidence:** `EventBus.ts` — history is bounded to 1000 events and only used for `getHistory()` queries, never replayed
- **Description:** When engines start, they subscribe to future events only. Past events are never replayed. On runtime restart, the entire pipeline must be re-triggered externally.

### GAP-004: Decision / Learning / Prediction / Recommendation / Planning / Execution Are Shells
- **Severity:** HIGH
- **Evidence:**
  - `DecisionPipeline.ts:16-70` — generates random proposal ID, emits event, returns
  - `LearningPipeline.ts:16-51` — generates random learning ID, emits event, returns
  - `PredictionPipeline.ts:16-51` — generates random prediction ID, emits event, returns
  - `RecommendationPipeline.ts:16-52` — generates random recommendation ID, emits event, returns
  - `PlanningPipeline.ts:16-52` — generates random plan ID, emits event, returns
  - `ExecutionPipeline.ts:16-52` — generates random execution ID, emits event, returns
- **Description:** These six engines contain no real processing logic. They are stubs that generate IDs and emit events. No alternatives are evaluated. No plans are created. No actions are executed.

### GAP-005: LearningEngine Self-Subscription Cycle Risk
- **Severity:** HIGH
- **Evidence:** `src/core/engines/learning/LearningEngine.ts:105-111`
- **Description:** LearningEngine subscribes to `LEARNING_EVENTS.LIFECYCLE_ACCEPTED` (`decision.lifecycle.accepted`) — an event that the same engine emits. The event's namespace is `decision.lifecycle.accepted` but it is defined in `LearningEvents.ts`. If this event is ever emitted, it triggers a recursive input cycle.
- **Note:** The event is currently never emitted (no code emits `LEARNING_EVENTS.LIFECYCLE_ACCEPTED`), so the cycle is latent.

### GAP-006: Pipeline Stage Order Mismatch
- **Severity:** HIGH
- **Evidence:**
  - Canonical order: `... → DECISION → PLANNING → EXECUTION → LEARNING → PREDICTION → RECOMMENDATION`
  - Actual event flow: `... → DECISION → LEARNING → PREDICTION → RECOMMENDATION → PLANNING → EXECUTION`
- **Sources:** `src/app/api/runtime/pipeline/route.ts:9-28` vs actual event subscription chain
- **Impact:** The pipeline status endpoint reports stages in a different order than the actual cognitive flow. This creates confusion about the real execution path.

### GAP-007: Evidence Engine's Pattern Event Trigger Gap
- **Severity:** HIGH
- **Evidence:** `src/core/engines/evidence/EvidenceEngine.ts:108-122`
- **Description:** EvidenceEngine subscribes to `pattern.lifecycle.supported_established` and `pattern.lifecycle.validated_confirmed`. However, PatternPipeline only emits these through explicit `advancePattern()` calls — auto-detection cycles produce `EMERGING_CONFIRMED` by default. EvidenceEngine may never be triggered by auto-detected patterns unless external code calls `advancePattern()`.

---

## Medium Gaps

### GAP-008: EventBus Subscribers Execute Synchronously
- **Evidence:** `EventBus.ts:50-61` — `for (const sub of sorted) { await sub.handler(payload); }`
- **Impact:** A slow subscriber blocks all other subscribers for the same event.

### GAP-009: No Backpressure or Rate Limiting
- **Evidence:** EventBus.emit() accepts and dispatches instantly. No queue depth limits.
- **Impact:** Rapid external requests (e.g., order flood) will queue up in the event bus indefinitely.

### GAP-010: Event Handler Errors Silently Swallowed Everywhere
- **Evidence:** Every engine's event subscription has try/catch with empty or audit-log-only error handling.
- **Impact:** Failures in cognitive processing are invisible unless explicitly audited.

### GAP-011: No Dashboard Integration
- **Evidence:** `src/features/dashboard/` — standalone services, no EventBus subscription
- **Impact:** Cognitive pipeline output never reaches the owner dashboard.

### GAP-012: Knowledge → Attention Gap via Memory Consolidation Timing
- **Evidence:** KnowledgeEngine subscribes to `memory.lifecycle.consolidated` which fires during the 60s Memory cycle
- **Impact:** Knowledge extraction is delayed up to 60 seconds after memory creation.

---

## Minor Gaps

### GAP-013: ObservationEventNames.CONTEXT_ASSIGNED has no subscribers (informational)
### GAP-014: Evidence `LIFECYCLE_VALIDATED_CONFIRMED` and `EVALUATION_COMPLETED` are both subscribed by MemoryEngine — potential duplicate processing
### GAP-015: Pattern pipeline generates up to 4 derived patterns (correlation, trend, anomaly, sequence) per cycle — all independently creating memory entries
### GAP-016: `runtime:order-received` event emitted but never subscribed
### GAP-017: `engine:state-change` events emitted but never subscribed
### GAP-018: `pattern.lifecycle.pattern_updated` emitted but never subscribed
### GAP-019: `evidence.lifecycle.weighted_calculated` emitted but never subscribed
### GAP-020: `evidence.contradiction.detected` emitted but never subscribed
### GAP-021: `standard.observation.lifecycle.archived` and `observation.quality.corrected` emitted but never subscribed

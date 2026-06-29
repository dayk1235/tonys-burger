# VS1-011 — End-to-End Cognitive Pipeline Discovery

**Date:** 2026-06-28
**Agent:** Chief Systems Architect
**Status:** Complete
**Scope:** Discovery only — no code modifications

---

## 1. Overview

This document presents the complete reverse-engineered execution graph of Flow OS (Restaurant OS cognitive layer). Every finding references real source code. No assumptions.

---

## 2. The Complete Execution Graph (DAG)

### 2.1 Primary Stimulus Path

```
Customer Request (HTTP POST /api/orders)
  │
  ▼
[Orders API Route]  src/app/api/orders/route.ts:214
  │  runtime.receive(canonicalEvent)
  ▼
[Runtime]  src/core/runtime/Runtime.ts:141
  │  Direct call to ObservationEngine.receiveInput()
  ▼
[ObservationEngine]  src/core/engines/observation/ObservationEngine.ts:66
  │  Pipeline: POTENTIAL → CANDIDATE → VERIFIED → CONTEXTUALIZED → HISTORICAL
  │  Emits: observation.lifecycle.historical_committed
  ▼
[EventBus]  src/core/runtime/EventBus.ts
  │  Fan-out to subscribers
  ├──────────────────────────────────────────────┐
  ▼                                              ▼
[PatternEngine]                            [MemoryEngine]
(subscribes to historical_committed)        (subscribes to historical_committed)
  │                                              │
  │ Pipeline: POTENTIAL → CANDIDATE →            │ Pipeline: Creates WORKING memory
  │   EMERGING → SUPPORTED → VALIDATED ...       │
  │ Emits: pattern.lifecycle.*                   │ 60s cycle: decay, consolidation
  ▼                                              ▼
[PatternEventBus events]                   [Memory internal lifecycle]
  │                                              │
  ├── pattern.lifecycle.supported_established    │ memory.lifecycle.consolidated
  ├── pattern.lifecycle.validated_confirmed      │ memory.lifecycle.long_term_promoted
  ├── pattern.discovery.trend_detected           │ memory.lifecycle.semantic_established
  ├── pattern.discovery.anomaly_detected         │
  ├── pattern.discovery.correlation_found        ▼
  └── pattern.discovery.sequence_discovered  [KnowledgeEngine]
        │                              (subscribes to consolidated/long_term/semantic)
        ▼                                     │
  [EvidenceEngine]                            │ Pipeline: CANDIDATE → EXTRACTED → VALIDATED
  (subscribes to supported_established,       │ Emits: knowledge.lifecycle.validated
   validated_confirmed)                       ▼
        │                              [AttentionEngine]
        ▼                           (subscribes to knowledge.lifecycle.validated)
  (Evidence processed,                       │
   stored in EvidenceMemory)                 │ Pipeline: OBSERVED → SCORED → QUEUED → FOCUSED
                                             │ 1s tick: scheduling, focus, interruption mgmt
  [MemoryEngine]                             │ Emits: attention.operation.prioritized
  (subscribes to evidence                    ▼
   validated/evaluation_completed)     [ReasoningEngine]
        │                           (subscribes to attention.operation.prioritized)
        ▼                                   │
  (Memory is created for evidence,           │ Pipeline: ACTIVATED → CONTEXT_BUILDING → ...
   also for observations and patterns)     │ → HYPOTHESIS_GENERATION → ... → COMPLETED
                                             │ Emits: reasoning.lifecycle.completed
                                             ▼
                                      [DecisionEngine]
                                   (subscribes to reasoning.lifecycle.completed)
                                             │
                                             │ Pipeline: Creates proposal, emits event
                                             │ Emits: decision.lifecycle.initiated
                                             ▼
                                      [LearningEngine]
                                   (subscribes to decision.lifecycle.initiated)
                                             │
                                             │ ALSO subscribes to own event: learning.lifecycle.accepted
                                             │ Emits: learning.lifecycle.initiated
                                             │ Emits: learning.lifecycle.completed
                                             ▼
                                      [PredictionEngine]
                                   (subscribes to learning.lifecycle.completed)
                                             │
                                             │ Emits: prediction.lifecycle.initiated
                                             │ Emits: prediction.lifecycle.completed
                                             ▼
                                    [RecommendationEngine]
                                (subscribes to prediction.lifecycle.completed)
                                             │
                                             │ Emits: recommendation.lifecycle.initiated
                                             │ Emits: recommendation.lifecycle.completed
                                             ▼
                                      [PlanningEngine]
                                (subscribes to recommendation.lifecycle.completed)
                                             │
                                             │ Emits: planning.lifecycle.initiated
                                             │ Emits: planning.lifecycle.completed
                                             ▼
                                      [ExecutionEngine]
                                   (subscribes to planning.lifecycle.completed)
                                             │
                                             │ Emits: execution.lifecycle.initiated
                                             │
                                             ▼
                                     ❌ NO CONSUMER
                                  (execution.lifecycle.initiated has no subscribers)
```

### 2.2 Alternative Stimulus Paths

```
2.2.1 Observation → Memory (direct, no Pattern)
  observation.lifecycle.historical_committed
  → MemoryEngine (also subscribes)
  → Creates memory directly from observation

2.2.2 Observation → Pattern → Memory (via pattern events)
  pattern.lifecycle.* events
  → MemoryEngine (subscribes to 8 pattern events)
  → Creates memory from pattern

2.2.3 Pattern → Evidence → Memory
  pattern.lifecycle.supported_established / validated_confirmed
  → EvidenceEngine → evaluation
  → MemoryEngine (subscribes to evidence validated/completed)

2.2.4 Memory → Knowledge → Attention
  memory.lifecycle.consolidated / long_term_promoted / semantic_established
  → KnowledgeEngine → extraction → validation
  → AttentionEngine (subscribes to knowledge validated)
```

---

## 3. Pipeline Order Discrepancy

### Canonical Pipeline Order (from pipeline route)
```
OBSERVATION → PATTERN → EVIDENCE → MEMORY → KNOWLEDGE → ATTENTION
→ REASONING → DECISION → PLANNING → EXECUTION → LEARNING
→ PREDICTION → RECOMMENDATION → CONVERSATION → REFLECTION
→ COORDINATION → BUSINESS_PULSE → HUMAN_EXPERIENCE
```

### Actual Event-Driven Flow
```
OBSERVATION → PATTERN → EVIDENCE → MEMORY → KNOWLEDGE
→ ATTENTION → REASONING → DECISION → LEARNING → PREDICTION
→ RECOMMENDATION → PLANNING → EXECUTION
```

### CRITICAL FINDING
The canonical pipeline order puts **PLANNING before LEARNING** and **EXECUTION before PREDICTION**. The actual event flow is:

**DECISION → LEARNING → PREDICTION → RECOMMENDATION → PLANNING → EXECUTION**

This means Learning occurs BEFORE Planning in the actual execution, which is the correct cognitive ordering (learn from decisions before planning future actions). However, the `PipelineStage` enum and the `CANONICAL_PIPELINE` constant in the status route have the stages in a different order, which is a documentation/display inconsistency.

---

## 4. Engine Classification & Pipeline Position (from Manifests)

| Engine | Classification | Pipeline Position | Purpose |
|--------|---------------|-------------------|---------|
| ObservationEngine | Perception | OBSERVATION | Raw stimulus → verified observations |
| PatternEngine | Understanding | PATTERN | Detect patterns, trends, anomalies |
| EvidenceEngine | Validation | EVIDENCE | Validate and weight evidence |
| MemoryEngine | Storage | MEMORY | Create, consolidate, retrieve memories |
| KnowledgeEngine | Knowledge | KNOWLEDGE | Extract, validate, structure knowledge |
| AttentionEngine | Attention | ATTENTION | Prioritize, allocate focus |
| ReasoningEngine | Processing | REASONING | Generate hypotheses, build conclusions |
| DecisionEngine | Decision | DECISION | Evaluate alternatives, propose decisions |
| LearningEngine | Learning | LEARNING | Analyze decision outcomes |
| PredictionEngine | Prediction | PREDICTION | Generate forecasts |
| RecommendationEngine | Recommendation | RECOMMENDATION | Transform predictions → recommendations |
| PlanningEngine | Planning | PLANNING | Recommendations → execution plans |
| ExecutionEngine | Execution | EXECUTION | Dispatch and monitor actions |

---

## 5. Event Bus Connectivity

### Producers and Consumers

| Event | Producer | Consumers |
|-------|----------|-----------|
| `observation.lifecycle.historical_committed` | ObservationPipeline | PatternEngine, MemoryEngine |
| `pattern.lifecycle.supported_established` | PatternPipeline | EvidenceEngine, MemoryEngine |
| `pattern.lifecycle.validated_confirmed` | PatternPipeline | EvidenceEngine, MemoryEngine |
| `pattern.lifecycle.emerging_confirmed` | PatternPipeline | MemoryEngine |
| `pattern.lifecycle.strengthening_observed` | PatternPipeline | MemoryEngine |
| `pattern.discovery.trend_detected` | PatternPipeline | MemoryEngine |
| `pattern.discovery.anomaly_detected` | PatternPipeline | MemoryEngine |
| `pattern.discovery.correlation_found` | PatternPipeline | MemoryEngine |
| `pattern.discovery.sequence_discovered` | PatternPipeline | MemoryEngine |
| `evidence.lifecycle.validated_confirmed` | EvidencePipeline | MemoryEngine |
| `evidence.evaluation.completed` | EvidencePipeline | MemoryEngine |
| `memory.lifecycle.consolidated` | MemoryPipeline | KnowledgeEngine |
| `memory.lifecycle.long_term_promoted` | MemoryPipeline | KnowledgeEngine |
| `memory.lifecycle.semantic_established` | MemoryPipeline | KnowledgeEngine |
| `knowledge.lifecycle.validated` | KnowledgePipeline | AttentionEngine |
| `attention.operation.prioritized` | AttentionPipeline | ReasoningEngine |
| `reasoning.lifecycle.completed` | ReasoningPipeline | DecisionEngine |
| `decision.lifecycle.initiated` | DecisionPipeline | LearningEngine |
| `learning.lifecycle.completed` | LearningPipeline | PredictionEngine |
| `learning.lifecycle.accepted` | LearningPipeline | LearningEngine (SELF) |
| `prediction.lifecycle.completed` | PredictionPipeline | RecommendationEngine |
| `recommendation.lifecycle.completed` | RecommendationPipeline | PlanningEngine |
| `planning.lifecycle.completed` | PlanningPipeline | ExecutionEngine |

---

## 6. Polling Loops

| Engine | Interval | Method | Purpose |
|--------|----------|--------|---------|
| MemoryEngine | 60,000ms (1 min) | `processCycle()` | Decay, consolidation, forgetting |
| AttentionEngine | 1,000ms (1 sec) | `tick()` | Scheduling, focus, interruption mgmt |

---

## 7. Runtime State Machine

```
BOOTING → INITIALIZING → DISCOVERING → RESOLVING → READY → OPERATING
                                                              ├── DEGRADED
                                                              ├── STRESSED
                                                              └── RECOVERING → (back to OPERATING or DEGRADED)
                                  SHUTTING_DOWN → HALTED
```

---

## 8. Engine State Machine

```
INITIALIZED → REGISTERED → CONFIGURED → ACTIVATED → RUNNING
                                                     ├── IDLE
                                                     ├── SUSPENDED
                                                     ├── DEGRADED
                                                     ├── FAILING
                                                     └── RECOVERING → RUNNING
SHUTDOWN
```

---

## 9. Synchronization Points

1. **Runtime.receive()** — Single synchronous call to ObservationEngine. Blocks until observation created.
2. **EventBus.emit()** — Sequential subscriber execution (sorted by priority). No parallelism.
3. **MemoryEngine.processCycle()** — 60s timer. No coordination with other engines.
4. **AttentionEngine.tick()** — 1s timer. Drives scheduling independently.
5. **No explicit pipeline orchestration** — Engines fire events and hope subscribers receive them; no acknowledgment, no ordering guarantee.

---

## 10. Bottlenecks

1. **Sequential EventBus** — Subscribers run sequentially. A slow subscriber blocks all others for that event.
2. **No async fan-out** — All subscribers for the same event run in `for...of` loop.
3. **No backpressure** — Events are emitted without rate limiting or queue depth management.
4. **In-memory only** — No persistence layer. On restart, all observations, patterns, memories, knowledge, evidence, attention items are lost.
5. **No cold-start recovery** — Restarting engines don't replay past events.
6. **Dead letters swallowed** — EventBus errors are only logged to dead letters, never retried.

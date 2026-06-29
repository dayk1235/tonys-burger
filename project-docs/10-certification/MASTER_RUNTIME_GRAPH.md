# MASTER RUNTIME GRAPH — Flow OS Runtime Architecture

**Date:** 2026-06-28

---

## RUNTIME BOOT SEQUENCE

```
Runtime.boot()
  │
  ├── 1. BOOTING
  │     └── Initialize clock, configuration
  │
  ├── 2. INITIALIZING
  │     ├── Create EventBus
  │     ├── Create ContextBus
  │     ├── Create WorkingMemory
  │     ├── Create EngineRegistry
  │     ├── Create RuntimeRegistry
  │     ├── Create AuditPipeline
  │     ├── Create RecoveryPipeline
  │     ├── Create RuntimeScheduler
  │     ├── Create RuntimeMetrics
  │     └── Create RuntimeHealth
  │
  ├── 3. DISCOVERING
  │     └── (engine scan — configurable paths)
  │
  ├── 4. RESOLVING
  │     └── Resolve engine dependencies
  │
  └── 5. READY

Runtime.start()
  │
  ├── Auto-boot if not booted
  ├── Transition READY → OPERATING
  ├── Start RuntimeScheduler
  ├── Emit runtime:started
  └── Register engine state change handlers

Runtime.shutdown()
  ├── Stop RuntimeScheduler
  ├── Transition → SHUTTING_DOWN
  ├── Emit runtime:shutting-down
  └── Transition → HALTED
```

---

## RUNTIME SUBSYSTEM INTERACTIONS

```
                            Runtime
                              │
              ┌───────────────┼───────────────┐
              │               │               │
         EventBus         ContextBus     WorkingMemory
              │               │               │
              ├─── publish    ├─── query      ├─── store
              ├─── subscribe  ├─── set        ├─── retrieve
              └─── dead       └─── TTL        └─── subscribe
                   letters       eviction        eviction
              │               │               │
              └───────────────┼───────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
            EngineRegistry       RuntimeMetrics
                    │                   │
              ┌─────┼─────┐            └── snapshot()
              │     │     │
         Engine  Engine  Engine
         State   Health  Manifest
              │
     ┌────────┴────────┐
     │                  │
AuditPipeline    RecoveryPipeline
     │                  │
  recordLog       registerFailure
  stateChange     initiateRecovery
```

---

## EVENT FLOW DIAGRAM

```
EXTERNAL INGRESS (not implemented)
  │
  └─→ [Adapter Layer] ──→ Runtime.receive()
                             │
                             ↓
                      ObservationEngine
                             │
                             ↓ observation.lifecycle.*
                      PatternEngine
                             │
                             ↓ pattern.lifecycle.*
                      MemoryEngine
                             │
                             ↓ memory.lifecycle.*
                      KnowledgeEngine
                             │
                             ↓ knowledge.lifecycle.*
                      AttentionEngine
                             │
                             ↓ attention.lifecycle.*
                      ReasoningEngine
                             │
                             ↓ reasoning.lifecycle.completed
                      DecisionEngine
                             │
                             ├─→ decision.lifecycle.initiated
                             │       ↓
                             │  LearningEngine
                             │       ↓ learning.lifecycle.completed
                             │  PredictionEngine
                             │       ↓ prediction.lifecycle.completed
                             │  RecommendationEngine
                             │       ↓ recommendation.lifecycle.completed
                             │  PlanningEngine
                             │       ↓ planning.lifecycle.completed
                             │  ExecutionEngine
                             │
                             └─→ decision.lifecycle.committed (unused)
```

---

## RUNTIME STATE MACHINE

```
BOOTING ───→ INITIALIZING ───→ DISCOVERING ───→ RESOLVING ───→ READY ───→ OPERATING
   │              │                 │                 │            │           │
   └──→ HALTED ←─┴─────────────────┴─────────────────┴────────────┴───┐       │
                                                                       │       │
                                                                       ↓       ↓
                                                                   SHUTTING_DOWN
                                                                       │
                                                                       ↓
                                                                   HALTED
```

### Runtime States
| State | Active? | Description |
|-------|:-------:|-------------|
| BOOTING | ✅ | Infrastructure initialization |
| INITIALIZING | ✅ | Subsystem creation |
| DISCOVERING | ✅ | Engine discovery |
| RESOLVING | ✅ | Dependency resolution |
| READY | ✅ | Booted, waiting for start |
| OPERATING | ✅ | Fully operational |
| DEGRADED | ✅ | Partial failure mode |
| STRESSED | ✅ | Under load |
| RECOVERING | ✅ | Recovery in progress |
| SHUTTING_DOWN | ✅ | Graceful shutdown |
| HALTED | ❌ | Terminal |

---

## ENGINE STATE MACHINE

```
INITIALIZED ──→ REGISTERED ──→ CONFIGURED ──→ ACTIVATED ──→ RUNNING ←── SUSPENDED
      │             │              │              │         │    │         │
      │             │              │              │         │    │         │
      └─────── SHUTDOWN ←──────────┴──────────────┴─────────┴────┴─────────┘
                                                               │
                                                          DEGRADED ←── RECOVERING
                                                               │         │
                                                               └── FAILING
```

### Engine States
| State | Active? | Description |
|-------|:-------:|-------------|
| INITIALIZED | ✅ | Created |
| REGISTERED | ✅ | Registered in registry |
| CONFIGURED | ✅ | Configuration applied |
| ACTIVATED | ✅ | Activated but not running |
| RUNNING | ✅ | Processing events |
| IDLE | ✅ | Running but no work |
| SUSPENDED | ✅ | Paused |
| DEGRADED | ✅ | Partial function |
| FAILING | ✅ | Error state, can recover |
| RECOVERING | ✅ | Recovery in progress |
| SHUTDOWN | ❌ | Terminal |

---

## RUNTIME->ENGINE->RUNTIME INTERACTION

```
Runtime.start()
  │
  └─→ For each registered engine:
        └─→ engine.start()
              ├── Subscribe to upstream events
              ├── Update EngineRegistry state
              ├── Emit ENGINE_STATE_CHANGE event
              └── Record audit (AuditPipeline)

Runtime.receive(event)
  │
  └─→ observationEngine.receiveInput(event)
        └─→ ObservationPipeline
              ├── Validate
              ├── Verify
              ├── Enrich context (ContextBus)
              ├── Grade quality
              ├── Store historically
              ├── Record metrics
              ├── Record audit (AuditPipeline)
              ├── Emit observation events (EventBus)
              └── Return result
```

---

## RUNTIME METRICS PIPELINE

```
Runtime.metrics.snapshot()
  │
  ├── activeEngines        ← EngineRegistry.count(RUNNING)
  ├── totalEngines         ← EngineRegistry.count()
  ├── eventsPublished      ← EventBus internal counter
  ├── eventsDelivered      ← EventBus internal counter
  ├── deadLetters          ← EventBus.deadLetters.length
  ├── memoryUsage          ← process.memoryUsage()
  ├── auditRecords         ← AuditPipeline.count()
  ├── failures             ← RecoveryPipeline.count()
  ├── recoveries           ← RecoveryPipeline count
  ├── uptimeMs             ← RuntimeClock.uptimeMs()
  └── runtimeState         ← RuntimeLifecycle current state
```

---

## AUDIT PIPELINE

```
engine.auditPipeline.recordLog(name, type, data)
  │
  └─→ AuditRecord created
        ├── id (auto-counter)
        ├── engineName
        ├── type
        ├── data
        ├── timestamp (RuntimeClock)
        └── retained for configurable period (default 24h)

engine.auditPipeline.recordStateChange(engine, from, to)
  │
  └─→ State change record stored
```

---

## RECOVERY PIPELINE

```
engine.recoveryPipeline.registerFailure(engine, severity, error)
  │
  └─→ FailureRecord created
        ├── id (auto-generated)
        ├── engineName
        ├── severity (CRITICAL|MAJOR|MINOR|WARNING)
        ├── error
        ├── timestamp
        └── recovered (boolean, default false)

engine.recoveryPipeline.initiateRecovery(failureId)
  │
  └─→ Runs recoveryAction
        ├── (uses registered RecoveryStrategy per engine)
        └── Can trigger cascading audit
```

---

## EVENTBUS ARCHITECTURE

```
EventBus.emit(eventName, payload)
  │
  ├── Sort subscribers by priority:
  │     CRITICAL > HIGH > NORMAL > LOW > BACKGROUND
  │
  ├── Execute each handler
  │     └── If handler throws → add to deadLetters
  │
  └── Append to history (ring buffer, max 1000)

EventBus.subscribe(eventName, handler, priority?)
  │
  └── Subscription created with priority level

EventBus.getDeadLetters()
  └── Returns all failed event+error pairs
```

---

## ENGINE STARTUP REGISTRATION ORDER

```
RuntimeSingleton.ts:
  1. ObservationEngine    (classification: PERCEPTION)
  2. PatternEngine        (classification: COGNITIVE)
  3. MemoryEngine         (classification: MEMORY)
  4. KnowledgeEngine      (classification: KNOWLEDGE)
  5. AttentionEngine      (classification: ATTENTION)
  6. ReasoningEngine      (classification: REASONING)
  7. DecisionEngine       (classification: DECISION)
  8. EvidenceEngine       (classification: EVIDENCE)
  9. LearningEngine       (classification: LEARNING)
  10. PredictionEngine    (classification: PREDICTION)
  11. RecommendationEngine (classification: RECOMMENDATION)
  12. PlanningEngine      (classification: PLANNING)
  13. ExecutionEngine     (classification: EXECUTION)
```

Each engine receives:
- `eventBus` — for pub/sub
- `auditPipeline` — for logging
- `recoveryPipeline` — for failure handling

Each engine has a manifest:
- `name`, `version`, `classification`, `pipelinePosition`
- `purpose` (human-readable description)
- `dependencies` (other engines it depends on)
- `resourceProfile` (CPU/memory estimates)
- `qualityThresholds` (critical/degraded thresholds)

---

## COMPONENT LIFECYCLE SUMMARY

```
            Engine           Runtime
              │                 │
          ┌───┴───┐        ┌───┴───┐
          │ start │        │ boot  │
          └───┬───┘        └───┬───┘
              │                 │
              ▼                 ▼
        Subscribes to     All subsystems
        upstream events   initialized
              │                 │
              ▼                 ▼
        Processes         All engines
        events via        registered and
        Pipeline          started
              │                 │
              ▼                 ▼
        Emits output      EventBus
        events            delivering
                          events
              │                 │
              ▼                 ▼
        Metrics           Runtime
        snapshots         snapshots
              │                 │
              ▼                 ▼
        Audit records     Health checks
        recorded          (30s interval)
```

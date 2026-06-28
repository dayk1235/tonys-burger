# RESTAURANT OS — Engine Implementation Standard

**Status:** Official Engineering Standard
**Adopted:** 2026-06-27
**Derived from:** 7 successful engine integrations (Observation, Pattern, Memory, Knowledge, Attention, Reasoning, Decision)

---

## Purpose

Every cognitive engine in Restaurant OS follows a uniform architecture. This standard exists to ensure:

- **Maintainability** — any engineer can open any engine and understand its structure immediately
- **Consistency** — the same file layout, the same contracts, the same integration pattern
- **Lower risk** — the pattern has been validated 7 times; deviations introduce unnecessary risk
- **Simple integration** — the Runtime registration pattern is fixed; no engine needs custom wiring
- **Repeatable validation** — every engine is validated by the same smoke test, audit, and report

---

## Standard Engine Structure

Every engine follows this directory and file structure:

```
src/core/engines/{engine-name}/
├── Types.ts              # Constants, enums, type definitions, input/output interfaces
├── Contracts.ts          # Subscriber, Query, Metrics interfaces
├── Errors.ts             # Error classes (base error + specific errors)
├── Validator.ts          # Input validation logic
├── Pipeline.ts           # Core processing pipeline
├── Engine.ts             # Main engine class (implements CognitiveEngine)
├── index.ts              # Barrel exports
```

### File Responsibilities

| File | Responsibility | Required |
|---|---|---|
| `Types.ts` | `ENGINE_NAME`, `ENGINE_CLASSIFICATION`, `ENGINE_CONTRACT_VERSION`, lifecycle stages, operation types, input/output interfaces | ✅ Yes |
| `Contracts.ts` | Interfaces for subscribers, queries, and metrics that the engine exposes to other engines | ✅ Yes |
| `Errors.ts` | Base `EngineError` class and domain-specific error types (`ValidationError`, `NotFoundError`, etc.) | ✅ Yes |
| `Validator.ts` | `validateInput(input)` method that parses raw `Record<string, unknown>` into typed engine input | ✅ Yes |
| `Pipeline.ts` | Core processing — orchestrates the engine's internal lifecycle, emits events, records audits | ✅ Yes |
| `Engine.ts` | Main class implementing `CognitiveEngine` — `start()`, `stop()`, `getState()`, `receiveInput()`, `subscribeToRuntimeEvents()` | ✅ Yes |
| `index.ts` | Barrel re-exports for all public types, classes, and constants | ✅ Yes |

### Engine Class Contract

```
class EngineName implements CognitiveEngine {
  readonly name: string;
  readonly classification: string;
  readonly contractVersion: string;

  constructor(eventBus?, auditPipeline?, recoveryPipeline?);

  start(): Promise<void>;
  stop(): Promise<void>;
  getState(): EngineState;           // "INITIALIZED" | "RUNNING" | ...
  receiveInput(input, options?): Promise<OperationResult>;

  getPipeline(): Pipeline;
  getMetrics(): Metrics;

  private subscribeToRuntimeEvents(): void;
}
```

### Manifest Definition

During Runtime registration, each engine must provide a manifest:

```ts
const ENGINE_MANIFEST: EngineManifestDefinition = {
  name: "EngineName",
  version: "1.0.0",
  classification: "Classification",   // Must exist in EngineClassification type
  pipelinePosition: "POSITION",       // Must exist in PipelineStage type
  purpose: "Description of the engine's role.",
  dependencies: [],
  resourceProfile: { memoryMB: 128, maxLatencyMs: 200, requiredStorageMB: 50 },
  qualityThresholds: { degraded: 0.7, critical: 0.4 },
};
```

---

## Runtime Integration

Every engine must follow this exact registration flow:

```
1. new EngineName(eventBus, auditPipeline, recoveryPipeline)
        ↓
2. runtime.registerEngine("EngineName", engine, ENGINE_MANIFEST)
        ↓
3. await engine.start()
        ↓
4. runtime.engineRegistry.updateState("EngineName", engine.getState() as EngineLifecycleState)
        ↓
5. await runtime.start()
        ↓
6. GET /api/runtime/status   → engine appears as RUNNING
   GET /api/runtime/pipeline  → pipeline stage appears as connected
```

### Registration Order

Engines must be registered in pipeline order (perception → cognition → decision):

```
ObservationEngine   (OBSERVATION)
PatternEngine       (PATTERN)
MemoryEngine        (MEMORY)
KnowledgeEngine     (KNOWLEDGE)
AttentionEngine     (ATTENTION)
ReasoningEngine     (REASONING)
DecisionEngine      (DECISION)
```

### Constructor Dependencies

| Param | Source | Purpose |
|---|---|---|
| `eventBus` | `runtime.eventBus` | Event-driven communication between engines |
| `auditPipeline` | `runtime.auditPipeline` | Record state changes and actions |
| `recoveryPipeline` | `runtime.recoveryPipeline` | Handle failures and cascading corrections |
| `contextBus` | `runtime.contextBus` | Query business context (ObservationEngine only) |

---

## Engineering Rules

1. **No modifications to other engines.** An engine integration touches only its own directory and `RuntimeSingleton.ts`.
2. **No Runtime modifications beyond registration.** The Runtime provides the EventBus, AuditPipeline, and RecoveryPipeline — engines consume, never modify.
3. **No adapters.** Engines communicate via the shared EventBus. No translation layers between engines.
4. **Shared EventBus.** All engines use the same `runtime.eventBus` instance. No private or isolated buses.
5. **Isolated responsibilities.** An engine does one thing: Observation perceives, Pattern detects, Memory stores, Knowledge structures, Attention prioritizes, Reasoning analyzes, Decision evaluates.
6. **Backward compatibility.** An engine integration must not change the behavior of any existing engine.
7. **One engine = one responsibility.** No engine may perform the function of another.

---

## Validation Workflow

Every new engine must complete the following mandatory cycle before being considered integrated:

```
Planning
    ↓
VS — Validation Sprint Task (integration)
    ↓
CV — Smoke Test (verification against running system)
    ↓
AUD — Audit (regression check)
    ↓
Closing Report
```

An engine is **not considered integrated** until this cycle is complete.

---

## Required Deliverables

Every engine integration must produce:

| Deliverable | Definition |
|---|---|
| Engine registered | `runtime.registerEngine()` called in `RuntimeSingleton.ts` |
| Runtime RUNNING | Engine state is `RUNNING` after `start()` |
| Visible in status endpoint | `GET /api/runtime/status` shows the engine |
| Visible in pipeline endpoint | `GET /api/runtime/pipeline` shows the stage as connected |
| Typecheck clean | `tsc --noEmit` passes |
| Existing tests pass | All pre-existing tests continue to pass |
| Smoke Test passed | CV executes against running system, HTTP 201 + all engines RUNNING |
| Audit passed | AUD confirms no regressions, all engines healthy |
| Closing Report | VS completion documented and filed |

---

## Historical Validation

This standard was used to successfully implement the following engines during Validation Sprint Zero and Validation Sprint One:

| Engine | Sprint | Validation Task |
|---|---|---|
| ObservationEngine | VS0 | VS0-001 |
| PatternEngine | VS0 | VS0-004 |
| MemoryEngine | VS0 | VS0-011 |
| KnowledgeEngine | VS1 | VS1-001 |
| AttentionEngine | VS1 | VS1-002 |
| ReasoningEngine | VS1 | VS1-003 |
| DecisionEngine | VS1 | VS1-004 |

**Combined results:** 7 engines, all RUNNING, all HEALTHY, all visible in Runtime endpoints. Zero critical regressions across both sprints.

---

## Final Statement

This document represents the official standard for implementing new cognitive engines in Restaurant OS.

It does not define future architecture. It documents the pattern validated by evidence across 7 successful integrations.

Every future cognitive engine must follow this standard. Deviations require architectural review and explicit approval.

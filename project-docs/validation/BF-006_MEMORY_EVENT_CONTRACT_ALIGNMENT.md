# BF-006 — Memory Event Contract Alignment

---

## Files Modified

| File | Change |
|---|---|
| `src/core/engines/memory/MemoryFactory.ts:79` | Store `businessId` in `metadata.attributes` so it's available when emitting lifecycle events |
| `src/core/engines/memory/MemoryPipeline.ts:357` | Changed `emitEvent()` signature from `MemoryEventPayload` to `Record<string, unknown>` |
| `src/core/engines/memory/MemoryPipeline.ts:369-382` | Restructured `emitLifecycleEvent()` payload to nested format compatible with `KnowledgeValidator.validateKnowledgeInput()` |

---

## Justification of Each Change

### 1. MemoryFactory.ts:79

**Problem:** `MemoryInput.businessId` was validated but never stored on the `Memory` object. When `emitLifecycleEvent()` later emitted the payload, `businessId` was unavailable.

**Fix:** Store `businessId` in `Memory.metadata.attributes` during creation. The `MemoryMetadata.attributes` field is a `Record<string, unknown>` designed for extensible metadata storage — this is its intended use.

### 2. MemoryPipeline.ts:357

**Problem:** `emitEvent()` was typed to `MemoryEventPayload`, a flat structure incompatible with the nested format needed for KnowledgeEngine compatibility. The typing forced all emitted events into the flat format.

**Fix:** Changed the parameter type to `Record<string, unknown>`. This is a private method — no external contract is affected. All existing callers continue to work because `MemoryEventPayload` is structurally compatible with `Record<string, unknown>`.

### 3. MemoryPipeline.ts:369-382

**Problem:** `emitLifecycleEvent()` emitted a flat payload:
```typescript
{ memoryId, name, category, stage, strength, confidence, recallScore, operation, timestamp }
```

`KnowledgeValidator.validateKnowledgeInput()` expects:
```typescript
{ memory: { id, identity: { patternId, name, category }, provenance: { sourceEvidenceIds, sourceObservationIds }, description, confidence }, businessId }
```

The flat format caused `validateKnowledgeInput()` to throw `"input must contain a memory object"` when the payload was delivered via EventBus → `KnowledgeEngine.subscribeToMemoryEvents()` → `receiveInput()`.

**Fix:** Restructured the payload to match the contract expected by `receiveInput()`.

---

## New EventBus Contract

The payload emitted by `emitLifecycleEvent()` (which covers all `memory.lifecycle.*` events) is now:

```typescript
{
  memory: {
    id: string,
    identity: {
      patternId: string,
      name: string,
      category: MemoryCategory,
    },
    provenance: {
      sourceEvidenceIds: string[],
      sourceObservationIds: string[],
    },
    description: string,
    confidence: number,
  },
  businessId: string,
}
```

This is exactly the format that `KnowledgeEngine.receiveInput()` → `KnowledgeValidator.validateKnowledgeInput()` expects.

---

## Why the Previous Contract Was Incompatible

The previous contract had two incompatibilities:

1. **Missing `memory` wrapper:** `validateKnowledgeInput()` accesses `input.memory` to extract identity, provenance, and description. The flat payload had all fields at the top level (`memoryId`, `name`, `category`, etc.), so `input.memory` was `undefined`.

2. **Missing fields:** The flat payload was missing `patternId`, `sourceEvidenceIds`, `description`, and `businessId` — all of which are required by `KnowledgeValidator.validateInput()`.

Both incompatibilities are resolved: the new payload wraps data in `{ memory: { ... } }` and includes all required fields extracted from the `Memory` object.

---

## Test Results

| Suite | Tests | Result |
|---|---|---|
| VS1-001 Memory → Knowledge | 1 (16 assertions) | ✅ |
| VS0-005 Contract Compliance | 1 | ✅ |
| VS0-007 Frequency Detection | 1 | ✅ |
| VS0-008 Pattern Full Cycle | 1 | ✅ |
| VS0-009 Pattern → Memory | 1 | ✅ |
| Runtime Observation Integration | 2 | ✅ |
| Memory unit tests | 52 | ✅ |

**TypeScript (`tsc --noEmit`):** 0 errors ✅

**Regressions:** 0

---

## Risks Found

| Risk | Severity | Description |
|---|---|---|
| **Category mapping mismatch** | 🟢 Baja | `MemoryCategory` ("SALES_PATTERN") and `KnowledgeCategory` ("GENERAL") are different types. The current flow passes the Memory category string into Knowledge, which accepts it as a generic string via type assertion. No immediate failure, but category semantics are not preserved. |
| **sourceObservationIds traceability** | 🟢 Baja | `KnowledgeValidator.validateKnowledgeInput()` reads only `sourceEvidenceIds` from provenance. `sourceObservationIds` is now included in the EventBus payload but not consumed at the Knowledge level. |

Neither risk was resolved per LAW_066 (Single Dead End) — only the contract alignment bug was fixed.

---

## Confirmation

- [x] Only this bug was corrected
- [x] Zero functional changes beyond payload format alignment
- [x] Zero modifications to: Runtime, ObservationEngine, PatternEngine, EventBus, KnowledgePipeline, KnowledgeValidator
- [x] `MemoryEventPayload` type remains unchanged (used by operation events via `emitEvent()`)
- [x] All existing subscribers to `memory.lifecycle.*` events receive the new format
- [x] No new events created
- [x] No business logic added
- [x] No inference logic added
- [x] No persistence added
- [x] No UI changes

---

*Bug Fix completed: 2026-06-27*

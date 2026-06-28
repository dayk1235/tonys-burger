# Restaurant OS — Adapter Layer

## Purpose

The Adapter Layer is the **only entry point** for external data entering the Restaurant OS Cognitive Pipeline.

Every external source — UberEats, Rappi, WhatsApp, POS, CSV Import, Direct API — must pass through an adapter before it becomes a Canonical Order Event consumable by ObservationEngine.

## Why It Exists

Without the Adapter Layer:

- Each new source would require changes to ObservationEngine
- Validation logic would be duplicated across engines
- Source-specific quirks would leak into the Cognitive Pipeline
- Adding a new platform would take weeks

With the Adapter Layer:

- One ObservationEngine integration, unchanged forever
- One validation rule set (the Canonical Order Event Spec)
- Unlimited source adapters, all producing the same output
- Adding a new platform = one adapter implementation

## Architecture

```
External Source
    │
    ▼
┌─────────────────────────────┐
│     Adapter Layer           │
│                             │
│  ┌───────────────────────┐  │
│  │   AdapterRegistry     │  │
│  │   discover(source)    │──┼──► UnsupportedSourceError
│  └───────────┬───────────┘  │
│              │              │
│              ▼              │
│  ┌───────────────────────┐  │
│  │  Source Adapter       │  │
│  │  (UberEats, Rappi…)   │  │
│  │                       │  │
│  │  1. canHandle(input)  │  │
│  │  2. validate(input)   │──┼──► ValidationError
│  │  3. transform(input)  │──┼──► TransformationError
│  │  4. normalize(output) │  │
│  └───────────┬───────────┘  │
│              │              │
│              ▼              │
│  ┌───────────────────────┐  │
│  │ CanonicalOrderEvent   │  │
│  │ (versioned, frozen)   │  │
│  └───────────┬───────────┘  │
└──────────────┼──────────────┘
               │
               ▼
     ┌─────────────────┐
     │ ObservationEngine│
     └────────┬─────────┘
              │
              ▼
      Cognitive Pipeline
  (13 engines, Observation → Execution)
```

## Responsibilities

| Component | Responsibility |
|---|---|
| **CanonicalOrderAdapter** (interface) | Contract that every adapter must implement |
| **AdapterRegistry** | Central registry — register, discover, inspect adapters |
| **Adapter Types** | Shared type definitions (input, output, validation, capabilities) |
| **Adapter Errors** | Typed error hierarchy (ValidationError, TransformationError, UnsupportedSourceError) |

## Lifecycle

```
1. External source sends raw data
       │
2. ObservationEngine (or entry point) calls AdapterRegistry.getForProvider(source)
       │
3. AdapterRegistry returns the matching adapter or throws UnsupportedSourceError
       │
4. Adapter.canHandle(input) — fast gate check
       │
5. Adapter.validate(input) — source-specific validation
       │
6. Adapter.transform(input, context) → CanonicalOrderEvent
       │
7. Adapter.normalize(output) — compute derived fields, apply defaults
       │
8. CanonicalOrderEvent enters ObservationEngine
       │
9. ObservationEngine sends the event into the Cognitive Pipeline
```

## Rules

| # | Rule |
|---|---|
| **R01** | Every adapter MUST implement `CanonicalOrderAdapter` |
| **R02** | Every adapter MUST be registered in `AdapterRegistry` before use |
| **R03** | Every adapter MUST produce a Canonical Order Event conforming to the frozen spec |
| **R04** | No adapter may modify the Runtime, Engines, or EventBus |
| **R05** | No adapter may call external APIs directly (delegates to execution layer) |
| **R06** | Validation errors must be reported, never silently corrected |
| **R07** | Transformation errors must include the failed step and original input |
| **R08** | Each source provider maps to exactly one adapter (1:1) |
| **R09** | Adapters may NOT be registered automatically — explicit registration required |
| **R10** | Adapters must declare capabilities honestly (used for runtime discovery) |

## How to Implement a New Adapter

1. Create a new file in `src/core/adapters/` (e.g. `uber-eats-adapter.ts`)
2. Implement the `CanonicalOrderAdapter` interface
3. Implement `canHandle()`, `validate()`, `transform()`, `normalize()`, `getMetadata()`
4. Map every source-specific field to the Canonical Order Event format
5. Register the adapter in `AdapterRegistry` at startup (via Runtime)
6. Verify with a Smoke Test (CV series)

### Example adapter structure

```typescript
import { CanonicalOrderAdapter } from "../contracts/CanonicalOrderAdapter";
import { AdapterInput, AdapterOutput, AdapterValidationResult, AdapterCapabilities, AdapterContext, AdapterStatistics, AdapterMetadata } from "../types";

export class UberEatsAdapter implements CanonicalOrderAdapter {
  readonly name = "uber-eats";
  readonly description = "Adapter for Uber Eats orders";

  canHandle(input: AdapterInput): boolean { /* ... */ }
  getCapabilities(): AdapterCapabilities { /* ... */ }
  validate(input: AdapterInput): Promise<AdapterValidationResult> { /* ... */ }
  transform(input: AdapterInput, context: AdapterContext): Promise<AdapterOutput> { /* ... */ }
  normalize(output: AdapterOutput): Promise<AdapterOutput> { /* ... */ }
  getMetadata(): AdapterMetadata { /* ... */ }
  getStatistics(): AdapterStatistics { /* ... */ }
}
```

## File Structure

```
src/core/adapters/
├── README.md                          ← This file
├── contracts/
│   └── CanonicalOrderAdapter.ts       ← Adapter contract interface
├── registry/
│   └── AdapterRegistry.ts             ← Central adapter registry
├── types/
│   └── index.ts                       ← Shared types
└── errors/
    └── index.ts                       ← Error classes
```

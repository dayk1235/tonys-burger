# Decision Engine

## Purpose

The Decision Engine is the single source of truth for all business recommendations in Restaurant OS.

It decouples the UI from data source implementation.

## Responsibilities

- Expose a minimal, stable public API for all decision-related data
- Normalize data into pure business types (no React, no UI coupling)
- Route data requests through an adapter layer
- Enable future replacement of demo data with real business data

## Public API

```
getDailyBrief()                → Recommendation[]
getDashboardData()             → DashboardData
getInsight(id: string)         → InsightData | null
getExperiment(id: string)      → ExperimentData | null
getExperimentLifecycle(id)     → ExperimentLifecycleData | null
```

## Architecture

```
UI Components
     ↓
Decision Engine
     ↓
Demo Adapter (current)  →  Future Adapter (real data)
     ↓
src/demo/dashboard-demo.ts
```

## Relationship with Other Engines

The Decision Engine is the first application engine.

Future engines (Recommendation Engine, Analytics Engine, etc.) will follow the same pattern:

- Engine types in `src/features/engines/<name>/types.ts`
- Adapter implementations in `src/features/engines/<name>/adapter/`
- Public API in `src/features/engines/<name>/engine.ts`

## Future Replacement

To replace demo data with real data:

1. Create a new adapter in `src/features/engines/decision/adapter/real-adapter.ts`
2. Import and call it from `src/features/engines/decision/engine.ts`
3. No UI changes required

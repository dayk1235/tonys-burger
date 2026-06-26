# Demo Adapter

## Purpose

The Demo Adapter is the current data source for the Decision Engine.

It reads simulated business data from `src/demo/dashboard-demo.ts` and returns normalized engine types.

## Future Replacement

When real data sources (APIs, databases, analytics pipelines) are available, replace this adapter with a new implementation that fulfills the same interface.

The Decision Engine and all UI components remain unchanged.

## Interface

The adapter must expose the following methods matching the engine's expectations:

- `getDailyBrief(): Recommendation[]`
- `getDashboardData(): DashboardData`
- `getInsight(id: string): InsightData | null`
- `getExperiment(id: string): ExperimentData | null`
- `getExperimentLifecycle(id: string): ExperimentLifecycleData | null`

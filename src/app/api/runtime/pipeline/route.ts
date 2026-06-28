import { NextResponse } from "next/server";
import { getRuntime } from "@/core/runtime/RuntimeSingleton";
import type { PipelineStage } from "@/core/runtime/RuntimeTypes";

/**
 * Canonical Cognitive Pipeline stages in load order.
 * Each stage reports "connected" when a registered engine occupies it.
 */
const CANONICAL_PIPELINE: PipelineStage[] = [
  "OBSERVATION",
  "PATTERN",
  "EVIDENCE",
  "MEMORY",
  "KNOWLEDGE",
  "ATTENTION",
  "REASONING",
  "DECISION",
  "PLANNING",
  "EXECUTION",
  "LEARNING",
  "PREDICTION",
  "RECOMMENDATION",
  "CONVERSATION",
  "REFLECTION",
  "COORDINATION",
  "BUSINESS_PULSE",
  "HUMAN_EXPERIENCE",
];

export async function GET(): Promise<NextResponse> {
  const runtime = await getRuntime();
  const state = runtime.getState();
  const snapshot = runtime.snapshot();
  const health = await runtime.healthCheck();

  const registeredEngines = runtime.engineRegistry.getAll();

  // Build engine map by pipeline position
  const engineByStage = new Map<PipelineStage, typeof registeredEngines[0]>();
  for (const engine of registeredEngines) {
    const stage = engine.metadata.identity.pipelinePosition;
    if (!engineByStage.has(stage)) {
      engineByStage.set(stage, engine);
    }
  }

  // Build pipeline status for every canonical stage
  const pipeline = CANONICAL_PIPELINE.map((stage) => {
    const engine = engineByStage.get(stage);
    return {
      stage,
      connected: engine !== undefined,
      engine: engine
        ? {
            name: engine.metadata.identity.name,
            state: engine.metadata.state,
            healthScore: engine.metadata.healthScore,
          }
        : null,
    };
  });

  // Compute summary
  const connectedCount = pipeline.filter((p) => p.connected).length;

  return NextResponse.json({
    runtimeState: state,
    timestamp: new Date().toISOString(),
    uptimeMs: snapshot.uptimeMs,
    health: {
      status: health.status,
      failures: health.failures.length,
      warnings: health.warnings,
    },
    engineCount: snapshot.totalEngineCount,
    connectedStages: connectedCount,
    totalStages: CANONICAL_PIPELINE.length,
    engines: registeredEngines.map((e) => ({
      name: e.metadata.identity.name,
      state: e.metadata.state,
      classification: e.metadata.identity.classification,
      pipelinePosition: e.metadata.identity.pipelinePosition,
      purpose: e.metadata.identity.purpose,
      healthScore: e.metadata.healthScore,
      qualityState: e.metadata.qualityState,
    })),
    pipeline,
  });
}

import { NextResponse } from "next/server";
import { getRuntime } from "@/core/runtime/RuntimeSingleton";

export async function GET(): Promise<NextResponse> {
  const runtime = await getRuntime();
  const state = runtime.getState();
  const snapshot = runtime.snapshot();

  const registeredEngines = runtime.engineRegistry.getAll().map((e) => ({
    name: e.metadata.identity.name,
    state: e.metadata.state,
    classification: e.metadata.identity.classification,
    pipelinePosition: e.metadata.identity.pipelinePosition,
    healthScore: e.metadata.healthScore,
  }));

  const health = await runtime.healthCheck();

  return NextResponse.json({
    runtimeState: state,
    engineCount: snapshot.totalEngineCount,
    registeredEngines,
    uptime: snapshot.uptimeMs,
    health: {
      status: health.status,
      lastHealthCheck: health.lastHealthCheck,
    },
  });
}

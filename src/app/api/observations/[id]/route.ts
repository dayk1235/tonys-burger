import { NextResponse } from "next/server";
import { getRuntime } from "@/core/runtime/RuntimeSingleton";
import { ObservationEngine } from "@/core/engines/observation/ObservationEngine";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  const runtime = await getRuntime();

  const engine = runtime.runtimeRegistry.getEngine("ObservationEngine") as ObservationEngine | undefined;
  if (!engine) {
    return NextResponse.json({ error: "ObservationEngine not found" }, { status: 500 });
  }

  const pipeline = engine.getPipeline();
  const observation = pipeline.getObservationById(id);

  if (!observation) {
    return NextResponse.json({ error: "Observation not found" }, { status: 404 });
  }

  return NextResponse.json({ observation });
}

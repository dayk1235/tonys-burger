import { NextResponse } from "next/server";
import { jsonAnalyticsProvider } from "@/lib/analytics/json-provider";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { events } = body as { events: unknown[] };

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: "events array required" }, { status: 400 });
    }

    for (const event of events) {
      jsonAnalyticsProvider.track(event as never);
    }

    return NextResponse.json({ tracked: events.length });
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
}

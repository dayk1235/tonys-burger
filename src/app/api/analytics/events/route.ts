import { NextResponse } from "next/server";
import { jsonAnalyticsProvider } from "@/lib/analytics/json-provider";

export async function GET(): Promise<NextResponse> {
  const events = jsonAnalyticsProvider.getStoredEvents();
  return NextResponse.json(events);
}

export async function DELETE(): Promise<NextResponse> {
  jsonAnalyticsProvider.clearEvents();
  return NextResponse.json({ cleared: true });
}

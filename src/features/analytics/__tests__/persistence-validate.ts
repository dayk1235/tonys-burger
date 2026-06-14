import { jsonAnalyticsProvider } from "@/lib/analytics/json-provider";
import { generateReport } from "@/features/insights/insights-engine";
import type { AnalyticsEvent } from "@/features/analytics/types";

const SAMPLE_EVENTS: AnalyticsEvent[] = [
  { event_name: "page_view", timestamp: 1000, session_id: "s1", device_type: "mobile", metadata: { url: "/", referrer: "direct" } },
  { event_name: "section_view", timestamp: 1100, session_id: "s1", device_type: "mobile", metadata: { section: "hero" } },
  { event_name: "burger_view", timestamp: 1200, session_id: "s1", device_type: "mobile", metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" } },
  { event_name: "whatsapp_click", timestamp: 1300, session_id: "s1", device_type: "mobile", metadata: { source: "floating" } },
  { event_name: "page_view", timestamp: 2000, session_id: "s2", device_type: "desktop", metadata: { url: "/", referrer: "google" } },
  { event_name: "section_view", timestamp: 2100, session_id: "s2", device_type: "desktop", metadata: { section: "hero" } },
  { event_name: "section_view", timestamp: 2200, session_id: "s2", device_type: "desktop", metadata: { section: "featured-burgers" } },
  { event_name: "burger_view", timestamp: 2300, session_id: "s2", device_type: "desktop", metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" } },
  { event_name: "burger_view", timestamp: 2400, session_id: "s2", device_type: "desktop", metadata: { burger_id: "tony-classic", burger_name: "Tony Classic" } },
  { event_name: "cta_click", timestamp: 2500, session_id: "s2", device_type: "desktop", metadata: { label: "Pedir por WhatsApp", destination: "#cta" } },
];

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  PASS: ${message}`);
}

function run(): void {
  jsonAnalyticsProvider.clearEvents();
  console.log("\n=== ANALYTICS PERSISTENCE VALIDATION ===\n");

  // Step 1: Track events
  console.log("Step 1: Tracking events...");
  for (const event of SAMPLE_EVENTS) {
    jsonAnalyticsProvider.track(event);
  }

  const stored = jsonAnalyticsProvider.getStoredEvents();
  assert(stored.length === SAMPLE_EVENTS.length, `${SAMPLE_EVENTS.length} events stored (got ${stored.length})`);
  assert(stored[0].session_id === "s1", "First event session matches");
  assert(stored[3].event_name === "whatsapp_click", "WhatsApp click event stored correctly");

  // Step 2: Read from file (simulate restart)
  console.log("Step 2: Reading from file (survives restart)...");
  const afterRead = jsonAnalyticsProvider.getStoredEvents();
  assert(afterRead.length === SAMPLE_EVENTS.length, "Events survive read cycle");

  // Step 3: Generate insights
  console.log("Step 3: Generating insights from persisted events...");
  const report = generateReport(jsonAnalyticsProvider);

  assert(report.topProducts.length > 0, "Top products generated");
  assert(report.topProducts[0].name === "Doble Tony", "Doble Tony is top product");
  assert(report.topCtas.length > 0, "Top CTAs generated");
  assert(report.sectionPerformance.length > 0, "Section performance generated");
  assert(report.conversionPaths.length > 0, "Conversion paths generated");
  assert(report.engagementSummary.totalEvents === SAMPLE_EVENTS.length, "Engagement summary matches total events");

  console.log(`\nTop Product: ${report.engagementSummary.topProduct?.name} (${report.engagementSummary.topProduct?.percentage}%)`);
  console.log(`Top CTA: ${report.engagementSummary.topCta?.label} (${report.engagementSummary.topCta?.percentage}%)`);
  console.log(`Top Section: ${report.engagementSummary.topSection?.section} (${report.engagementSummary.topSection?.percentage}%)`);
  console.log(`Total Events: ${report.engagementSummary.totalEvents}`);
  console.log(`Unique Sessions: ${report.engagementSummary.uniqueSessions}`);

  // Step 4: Clear
  console.log("\nStep 4: Clearing events...");
  jsonAnalyticsProvider.clearEvents();
  const afterClear = jsonAnalyticsProvider.getStoredEvents();
  assert(afterClear.length === 0, "Events cleared successfully");

  console.log("\n=== ALL VALIDATIONS PASSED ===");
}

run();

import { generateReport } from "../insights-engine";
import { MockAnalyticsProvider, SAMPLE_EVENTS } from "./fixtures";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    process.stderr.write(`FAIL: ${message}\n`);
    process.exit(1);
  }
  process.stdout.write(`PASS: ${message}\n`);
}

function run(): void {
  const mock = new MockAnalyticsProvider(SAMPLE_EVENTS);
  const report = generateReport(mock);

  process.stdout.write("\n=== INSIGHTS VALIDATION ===\n\n");

  process.stdout.write("--- Top Products ---\n");
  for (const p of report.topProducts) {
    process.stdout.write(`  ${p.name}: ${p.views} views (${p.percentage}%)\n`);
  }

  process.stdout.write("\n--- Top CTAs ---\n");
  for (const c of report.topCtas) {
    process.stdout.write(`  ${c.label}: ${c.clicks} clicks (${c.percentage}%)\n`);
  }

  process.stdout.write("\n--- Section Performance ---\n");
  for (const s of report.sectionPerformance) {
    process.stdout.write(`  ${s.section}: ${s.views} views (${s.percentage}%)\n`);
  }

  process.stdout.write("\n--- Conversion Paths ---\n");
  for (const p of report.conversionPaths) {
    process.stdout.write(`  ${p.path.join(" → ")} (${p.count})\n`);
  }

  process.stdout.write("\n--- Engagement Summary ---\n");
  process.stdout.write(`  Total Events: ${report.engagementSummary.totalEvents}\n`);
  process.stdout.write(`  Unique Sessions: ${report.engagementSummary.uniqueSessions}\n`);
  if (report.engagementSummary.topProduct) {
    process.stdout.write(`  Top Product: ${report.engagementSummary.topProduct.name} (${report.engagementSummary.topProduct.percentage}%)\n`);
  }
  if (report.engagementSummary.topCta) {
    process.stdout.write(`  Top CTA: ${report.engagementSummary.topCta.label} (${report.engagementSummary.topCta.percentage}%)\n`);
  }
  if (report.engagementSummary.topSection) {
    process.stdout.write(`  Top Section: ${report.engagementSummary.topSection.section} (${report.engagementSummary.topSection.percentage}%)\n`);
  }

  process.stdout.write("\n--- Assertions ---\n");

  assert(report.topProducts.length === 4, "4 unique products identified");

  const topProduct = report.topProducts[0];
  assert(topProduct.name === "Doble Tony", `Top product is Doble Tony (got ${topProduct.name})`);
  assert(topProduct.views === 4, `Doble Tony has 4 views (got ${topProduct.views})`);

  assert(report.topCtas.length >= 3, "3+ CTA labels found");

  const topCta = report.topCtas[0];
  assert(topCta.clicks >= 2, `Top CTA has at least 2 clicks (got ${topCta.clicks})`);

  assert(report.sectionPerformance.length >= 4, "4+ sections tracked");

  const topSection = report.sectionPerformance[0];
  assert(topSection.views >= 1, `Top section has at least 1 view (got ${topSection.views})`);

  assert(report.conversionPaths.length >= 1, "At least 1 conversion path found");

  assert(report.engagementSummary.totalEvents === SAMPLE_EVENTS.length, `Total events match (${report.engagementSummary.totalEvents})`);
  assert(report.engagementSummary.uniqueSessions === 4, "4 unique sessions");

  process.stdout.write("\n=== ALL VALIDATIONS PASSED ===\n");
}

run();

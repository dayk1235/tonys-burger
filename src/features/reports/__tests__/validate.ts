import { generateReport } from "@/features/insights/insights-engine";
import { MockAnalyticsProvider, SAMPLE_EVENTS } from "@/features/insights/__tests__/fixtures";
import { generateDailyReport } from "../generators/daily";
import { generateWeeklyReport } from "../generators/weekly";
import { generateSummaryReport } from "../generators/summary";
import { toMarkdown } from "../formatters/markdown";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    process.stderr.write(`FAIL: ${message}\n`);
    process.exit(1);
  }
  process.stdout.write(`  PASS: ${message}\n`);
}

function run(): void {
  const mock = new MockAnalyticsProvider(SAMPLE_EVENTS);
  const insights = generateReport(mock);

  process.stdout.write("\n=== BUSINESS REPORTS VALIDATION ===\n");

  // Daily
  process.stdout.write("\n--- Daily Report (JSON) ---\n");
  const daily = generateDailyReport(insights);
  assert(daily.meta.period === "daily", "Daily report period correct");
  assert(daily.meta.businessName === "Tony's Burger", "Business name set");
  assert(daily.insights.topProducts.length > 0, "Daily includes top products");
  process.stdout.write(JSON.stringify(daily, null, 2));
  process.stdout.write("\n");

  process.stdout.write("\n--- Daily Report (Markdown) ---\n");
  const dailyMd = toMarkdown(daily);
  assert(dailyMd.startsWith("# Daily Report"), "Markdown starts with title");
  assert(dailyMd.includes("## Top Products"), "Markdown includes top products");
  assert(dailyMd.includes("## Summary"), "Markdown includes summary");
  process.stdout.write(dailyMd);

  // Weekly
  process.stdout.write("\n--- Weekly Report (JSON) ---\n");
  const weekly = generateWeeklyReport(insights);
  assert(weekly.meta.period === "weekly", "Weekly report period correct");
  assert(weekly.insights.engagementSummary.totalEvents === SAMPLE_EVENTS.length, "Weekly includes all events");
  process.stdout.write(JSON.stringify(weekly, null, 2));
  process.stdout.write("\n");

  process.stdout.write("\n--- Weekly Report (Markdown) ---\n");
  const weeklyMd = toMarkdown(weekly);
  assert(weeklyMd.startsWith("# Weekly Report"), "Weekly markdown starts correctly");
  assert(weeklyMd.includes("## Top CTAs"), "Weekly markdown includes CTAs");
  process.stdout.write(weeklyMd);

  // Summary
  process.stdout.write("\n--- Summary Report (JSON) ---\n");
  const summary = generateSummaryReport(insights);
  assert(summary.meta.period === "summary", "Summary report period correct");
  assert(summary.meta.dateRange === "All time", "Summary date range is all time");
  process.stdout.write(JSON.stringify(summary, null, 2));
  process.stdout.write("\n");

  process.stdout.write("\n--- Summary Report (Markdown) ---\n");
  const summaryMd = toMarkdown(summary);
  assert(summaryMd.startsWith("# Summary Report"), "Summary markdown starts correctly");
  assert(summaryMd.includes("## Conversion Paths"), "Summary markdown includes conversion paths");
  process.stdout.write(summaryMd);

  process.stdout.write("\n=== ALL REPORT VALIDATIONS PASSED ===\n");
}

run();

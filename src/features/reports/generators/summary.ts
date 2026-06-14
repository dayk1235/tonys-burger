import type { InsightsReport } from "@/features/insights/types";
import type { BusinessReport, ReportMeta } from "../types";

const BUSINESS_NAME = "Tony's Burger";

export function generateSummaryReport(insights: InsightsReport): BusinessReport {
  const meta: ReportMeta = {
    title: "Summary Report",
    period: "summary",
    generatedAt: new Date().toISOString(),
    businessName: BUSINESS_NAME,
    dateRange: "All time",
  };

  return { meta, insights };
}

import type { InsightsReport } from "@/features/insights/types";
import type { BusinessReport, ReportMeta } from "../types";

const BUSINESS_NAME = "Tony's Burger";

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function generateDailyReport(insights: InsightsReport): BusinessReport {
  const meta: ReportMeta = {
    title: "Daily Report",
    period: "daily",
    generatedAt: new Date().toISOString(),
    businessName: BUSINESS_NAME,
    dateRange: yesterday(),
  };

  return { meta, insights };
}

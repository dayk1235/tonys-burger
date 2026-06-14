import type { InsightsReport } from "@/features/insights/types";
import type { BusinessReport, ReportMeta } from "../types";

const BUSINESS_NAME = "Tony's Burger";

function lastWeekRange(): string {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return `${start.toISOString().split("T")[0]} — ${end.toISOString().split("T")[0]}`;
}

export function generateWeeklyReport(insights: InsightsReport): BusinessReport {
  const meta: ReportMeta = {
    title: "Weekly Report",
    period: "weekly",
    generatedAt: new Date().toISOString(),
    businessName: BUSINESS_NAME,
    dateRange: lastWeekRange(),
  };

  return { meta, insights };
}

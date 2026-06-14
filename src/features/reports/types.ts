import type { InsightsReport } from "@/features/insights/types";

export type ReportPeriod = "daily" | "weekly" | "summary";
export type ReportFormat = "json" | "markdown";

export interface ReportMeta {
  title: string;
  period: ReportPeriod;
  generatedAt: string;
  businessName: string;
  dateRange: string;
}

export interface BusinessReport {
  meta: ReportMeta;
  insights: InsightsReport;
}

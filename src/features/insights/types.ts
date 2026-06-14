import type { AnalyticsProvider } from "../analytics/types";

export type DataSource = Pick<AnalyticsProvider, "getStoredEvents">;

export interface TopProduct {
  id: string;
  name: string;
  views: number;
  percentage: number;
}

export interface TopCta {
  label: string;
  clicks: number;
  percentage: number;
}

export interface SectionPerformance {
  section: string;
  views: number;
  percentage: number;
}

export interface ConversionPath {
  path: string[];
  count: number;
}

export interface EngagementSummary {
  totalEvents: number;
  uniqueSessions: number;
  topProduct: TopProduct | null;
  topCta: TopCta | null;
  topSection: SectionPerformance | null;
}

export interface InsightsReport {
  topProducts: TopProduct[];
  topCtas: TopCta[];
  sectionPerformance: SectionPerformance[];
  conversionPaths: ConversionPath[];
  engagementSummary: EngagementSummary;
}

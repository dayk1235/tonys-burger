import type { DataSource, InsightsReport } from "./types";
import { getTopProducts } from "./generators/top-products";
import { getTopCtas } from "./generators/top-cta";
import { getSectionPerformance } from "./generators/section-performance";
import { getConversionPaths } from "./generators/conversion-path";
import { getEngagementSummary } from "./generators/engagement-summary";

export function generateReport(source: DataSource): InsightsReport {
  return {
    topProducts: getTopProducts(source),
    topCtas: getTopCtas(source),
    sectionPerformance: getSectionPerformance(source),
    conversionPaths: getConversionPaths(source),
    engagementSummary: getEngagementSummary(source),
  };
}

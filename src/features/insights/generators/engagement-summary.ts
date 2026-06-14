import type { DataSource, EngagementSummary } from "../types";
import { getTopProducts } from "./top-products";
import { getTopCtas } from "./top-cta";
import { getSectionPerformance } from "./section-performance";

export function getEngagementSummary(source: DataSource): EngagementSummary {
  const events = source.getStoredEvents();

  const totalEvents = events.length;
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;

  const topProducts = getTopProducts(source);
  const topCtas = getTopCtas(source);
  const sections = getSectionPerformance(source);

  return {
    totalEvents,
    uniqueSessions,
    topProduct: topProducts[0] ?? null,
    topCta: topCtas[0] ?? null,
    topSection: sections[0] ?? null,
  };
}

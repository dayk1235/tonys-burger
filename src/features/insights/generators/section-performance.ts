import type { AnalyticsEvent } from "../../analytics/types";
import type { DataSource, SectionPerformance } from "../types";

export function getSectionPerformance(source: DataSource): SectionPerformance[] {
  const events = source.getStoredEvents();

  const sectionViews = events.filter(
    (e): e is AnalyticsEvent & { metadata: { section: string } } =>
      e.event_name === "section_view" && typeof e.metadata.section === "string"
  );

  const counts = new Map<string, number>();

  for (const event of sectionViews) {
    const section = event.metadata.section;
    counts.set(section, (counts.get(section) ?? 0) + 1);
  }

  if (counts.size === 0) return [];

  const total = [...counts.values()].reduce((sum, c) => sum + c, 0);
  const sorted = [...counts.entries()]
    .map(
      ([section, views]): SectionPerformance => ({
        section,
        views,
        percentage: Math.round((views / total) * 100),
      })
    )
    .sort((a, b) => b.views - a.views);

  return sorted;
}

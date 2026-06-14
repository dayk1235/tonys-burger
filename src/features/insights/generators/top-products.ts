import type { AnalyticsEvent } from "../../analytics/types";
import type { DataSource, TopProduct } from "../types";

export function getTopProducts(source: DataSource): TopProduct[] {
  const events = source.getStoredEvents();
  const burgerViews = events.filter(
    (e): e is AnalyticsEvent & { metadata: { burger_id: string; burger_name: string } } =>
      e.event_name === "burger_view" &&
      typeof e.metadata.burger_id === "string" &&
      typeof e.metadata.burger_name === "string"
  );

  const counts = new Map<string, { name: string; views: number }>();

  for (const event of burgerViews) {
    const id = event.metadata.burger_id;
    const existing = counts.get(id);
    if (existing) {
      existing.views++;
    } else {
      counts.set(id, { name: event.metadata.burger_name, views: 1 });
    }
  }

  if (counts.size === 0) return [];

  const total = burgerViews.length;
  const sorted = [...counts.entries()]
    .map(
      ([id, data]): TopProduct => ({
        id,
        name: data.name,
        views: data.views,
        percentage: Math.round((data.views / total) * 100),
      })
    )
    .sort((a, b) => b.views - a.views);

  return sorted;
}

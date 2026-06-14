import type { AnalyticsEvent } from "../../analytics/types";
import type { DataSource, TopCta } from "../types";

export function getTopCtas(source: DataSource): TopCta[] {
  const events = source.getStoredEvents();

  const whatsappClicks = events.filter(
    (e): e is AnalyticsEvent & { metadata: { source: string } } =>
      e.event_name === "whatsapp_click" && typeof e.metadata.source === "string"
  );

  const ctaClicks = events.filter(
    (e): e is AnalyticsEvent & { metadata: { label: string; destination: string } } =>
      e.event_name === "cta_click" && typeof e.metadata.label === "string"
  );

  const counts = new Map<string, number>();

  for (const event of whatsappClicks) {
    const label = `WhatsApp (${event.metadata.source})`;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  for (const event of ctaClicks) {
    const label = event.metadata.label;
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  if (counts.size === 0) return [];

  const total = [...counts.values()].reduce((sum, c) => sum + c, 0);
  const sorted = [...counts.entries()]
    .map(
      ([label, clicks]): TopCta => ({
        label,
        clicks,
        percentage: Math.round((clicks / total) * 100),
      })
    )
    .sort((a, b) => b.clicks - a.clicks);

  return sorted;
}

import type { AnalyticsEvent } from "../../analytics/types";
import type { DataSource, ConversionPath } from "../types";

type EventSummary = {
  event_name: string;
  label: string;
  timestamp: number;
  session_id: string;
};

function summarizeEvent(e: AnalyticsEvent): EventSummary {
  let label = "";
  if (e.event_name === "whatsapp_click" && typeof e.metadata.source === "string") {
    label = `WhatsApp (${e.metadata.source})`;
  } else if (e.event_name === "cta_click" && typeof e.metadata.label === "string") {
    label = e.metadata.label;
  } else if (e.event_name === "menu_click" && typeof e.metadata.source === "string") {
    label = `Menu Click (${e.metadata.source})`;
  } else if (e.event_name === "page_view" && typeof e.metadata.url === "string") {
    label = e.metadata.url;
  } else if (e.event_name === "burger_view" && typeof e.metadata.burger_name === "string") {
    label = `Burger View (${e.metadata.burger_name})`;
  } else if (e.event_name === "section_view" && typeof e.metadata.section === "string") {
    label = `Section (${e.metadata.section})`;
  }
  return { event_name: e.event_name, label, timestamp: e.timestamp, session_id: e.session_id };
}

export function getConversionPaths(source: DataSource): ConversionPath[] {
  const events = source.getStoredEvents();

  const bySession = new Map<string, EventSummary[]>();

  for (const event of events) {
    const sessionId = event.session_id;
    const existing = bySession.get(sessionId) ?? [];
    existing.push(summarizeEvent(event));
    bySession.set(sessionId, existing);
  }

  for (const [, sessionEvents] of bySession) {
    sessionEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

  const pathCounts = new Map<string, number>();

  for (const [, sessionEvents] of bySession) {
    const whatsappIndex = sessionEvents.findIndex((e) => e.event_name === "whatsapp_click");
    if (whatsappIndex === -1) continue;

    const relevant = sessionEvents.slice(0, whatsappIndex + 1).reduce<string[]>((acc, e) => {
      if (e.event_name === "whatsapp_click") {
        acc.push("WhatsApp Click");
      } else if (e.event_name === "cta_click") {
        acc.push(`CTA: ${e.label}`);
      } else if (e.event_name === "menu_click") {
        acc.push(`Menu Click`);
      } else if (e.event_name === "burger_view") {
        acc.push(`Burger View`);
      } else if (e.event_name === "section_view") {
        acc.push(`Section: ${e.label.replace("Section (", "").replace(")", "")}`);
      } else if (e.event_name === "page_view") {
        acc.push("Page View");
      }
      return acc;
    }, []);

    if (relevant.length === 0) {
      relevant.push("WhatsApp Click");
    }

    const pathKey = relevant.join(" → ");
    pathCounts.set(pathKey, (pathCounts.get(pathKey) ?? 0) + 1);
  }

  const sorted = [...pathCounts.entries()]
    .map(
      ([path, count]): ConversionPath => ({
        path: path.split(" → "),
        count,
      })
    )
    .sort((a, b) => b.count - a.count);

  return sorted;
}

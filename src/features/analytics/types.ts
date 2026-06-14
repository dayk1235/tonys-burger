export type EventName =
  | "page_view"
  | "menu_click"
  | "whatsapp_click"
  | "cta_click"
  | "burger_view"
  | "section_view";

export interface AnalyticsEvent {
  event_name: EventName;
  timestamp: number;
  session_id: string;
  device_type: "desktop" | "tablet" | "mobile";
  metadata: Record<string, string | number | boolean | undefined>;
}

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  getStoredEvents(): AnalyticsEvent[];
  clearEvents(): void;
}

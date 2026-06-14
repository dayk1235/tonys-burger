import type { AnalyticsEvent, AnalyticsProvider } from "../../analytics/types";

export const SAMPLE_EVENTS: AnalyticsEvent[] = [
  {
    event_name: "page_view",
    timestamp: 1000,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { url: "/", referrer: "direct" },
  },
  {
    event_name: "section_view",
    timestamp: 1100,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { section: "hero" },
  },
  {
    event_name: "section_view",
    timestamp: 1200,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { section: "featured-burgers" },
  },
  {
    event_name: "burger_view",
    timestamp: 1300,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { burger_id: "tony-classic", burger_name: "Tony Classic" },
  },
  {
    event_name: "burger_view",
    timestamp: 1310,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" },
  },
  {
    event_name: "whatsapp_click",
    timestamp: 1400,
    session_id: "session-a",
    device_type: "mobile",
    metadata: { source: "floating" },
  },
  {
    event_name: "page_view",
    timestamp: 2000,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { url: "/", referrer: "google" },
  },
  {
    event_name: "section_view",
    timestamp: 2100,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { section: "hero" },
  },
  {
    event_name: "section_view",
    timestamp: 2200,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { section: "burger-assembly" },
  },
  {
    event_name: "burger_view",
    timestamp: 2300,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" },
  },
  {
    event_name: "burger_view",
    timestamp: 2310,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" },
  },
  {
    event_name: "cta_click",
    timestamp: 2400,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { label: "Pedir por WhatsApp", destination: "#cta" },
  },
  {
    event_name: "whatsapp_click",
    timestamp: 2500,
    session_id: "session-b",
    device_type: "desktop",
    metadata: { source: "cta-section" },
  },
  {
    event_name: "page_view",
    timestamp: 3000,
    session_id: "session-c",
    device_type: "mobile",
    metadata: { url: "/", referrer: "social" },
  },
  {
    event_name: "section_view",
    timestamp: 3100,
    session_id: "session-c",
    device_type: "mobile",
    metadata: { section: "hero" },
  },
  {
    event_name: "burger_view",
    timestamp: 3200,
    session_id: "session-c",
    device_type: "mobile",
    metadata: { burger_id: "veggie-deluxe", burger_name: "Veggie Deluxe" },
  },
  {
    event_name: "whatsapp_click",
    timestamp: 3300,
    session_id: "session-c",
    device_type: "mobile",
    metadata: { source: "hero" },
  },
  {
    event_name: "section_view",
    timestamp: 4000,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { section: "testimonials" },
  },
  {
    event_name: "burger_view",
    timestamp: 4100,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { burger_id: "tony-classic", burger_name: "Tony Classic" },
  },
  {
    event_name: "burger_view",
    timestamp: 4110,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { burger_id: "doble-tony", burger_name: "Doble Tony" },
  },
  {
    event_name: "menu_click",
    timestamp: 4200,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { source: "nav" },
  },
  {
    event_name: "burger_view",
    timestamp: 4300,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { burger_id: "inferno", burger_name: "Inferno" },
  },
  {
    event_name: "burger_view",
    timestamp: 4310,
    session_id: "session-d",
    device_type: "tablet",
    metadata: { burger_id: "inferno", burger_name: "Inferno" },
  },
];

export class MockAnalyticsProvider implements AnalyticsProvider {
  private events: AnalyticsEvent[];

  constructor(events: AnalyticsEvent[] = SAMPLE_EVENTS) {
    this.events = [...events];
  }

  track(event: AnalyticsEvent): void {
    this.events.push(event);
  }

  getStoredEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }
}

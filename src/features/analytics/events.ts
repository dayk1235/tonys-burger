import type { AnalyticsProvider } from "./types";
import { createEvent } from "./provider";

export function trackPageView(analytics: AnalyticsProvider): void {
  analytics.track(
    createEvent("page_view", {
      url: typeof window !== "undefined" ? window.location.pathname : "/",
      referrer: typeof window !== "undefined" ? document.referrer || undefined : undefined,
    })
  );
}

export function trackWhatsAppClick(
  analytics: AnalyticsProvider,
  source: "floating" | "hero" | "footer" | "assembly" | "cta-section" | "floating-cta"
): void {
  analytics.track(createEvent("whatsapp_click", { source }));
}

export function trackCtaClick(
  analytics: AnalyticsProvider,
  label: string,
  destination: string
): void {
  analytics.track(
    createEvent("cta_click", { label, destination })
  );
}

export function trackMenuClick(
  analytics: AnalyticsProvider,
  source: "nav" | "hero" | "assembly" | "section-header" | "desktop-nav" | "mobile-nav"
): void {
  analytics.track(createEvent("menu_click", { source }));
}

export function trackBurgerView(
  analytics: AnalyticsProvider,
  burgerId: string,
  burgerName: string
): void {
  analytics.track(
    createEvent("burger_view", { burger_id: burgerId, burger_name: burgerName })
  );
}

export function trackSectionView(
  analytics: AnalyticsProvider,
  sectionName: string
): void {
  analytics.track(createEvent("section_view", { section: sectionName }));
}

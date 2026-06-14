"use client";

import { useCallback } from "react";
import { useAnalytics } from "../provider";
import { trackWhatsAppClick, trackCtaClick, trackMenuClick } from "../events";

type ClickType =
  | { type: "whatsapp"; source: "floating" | "hero" | "footer" | "assembly" | "cta-section" | "floating-cta" }
  | { type: "cta"; label: string; destination: string }
  | { type: "menu"; source: "nav" | "hero" | "assembly" | "section-header" | "desktop-nav" | "mobile-nav" };

export function useClickTracking() {
  const analytics = useAnalytics();

  const handleClick = useCallback(
    (config: ClickType) => {
      switch (config.type) {
        case "whatsapp":
          trackWhatsAppClick(analytics, config.source);
          break;
        case "cta":
          trackCtaClick(analytics, config.label, config.destination);
          break;
        case "menu":
          trackMenuClick(analytics, config.source);
          break;
      }
    },
    [analytics]
  );

  return handleClick;
}

export { AnalyticsRootProvider, useAnalytics } from "./provider";
export { AnalyticsTracker } from "./analytics-tracker";
export type { AnalyticsEvent, AnalyticsProvider } from "./types";

export { usePageView } from "./hooks/usePageView";
export { useSectionView } from "./hooks/useSectionView";
export { useBurgerView } from "./hooks/useBurgerView";
export { useClickTracking } from "./hooks/useClickTracking";

export { trackWhatsAppClick, trackCtaClick, trackMenuClick } from "./events";

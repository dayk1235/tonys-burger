"use client";

import { usePageView } from "./hooks/usePageView";

export function AnalyticsTracker() {
  usePageView();
  return null;
}

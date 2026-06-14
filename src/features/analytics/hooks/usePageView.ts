"use client";

import { useEffect } from "react";
import { useAnalytics } from "../provider";
import { trackPageView } from "../events";

export function usePageView(): void {
  const analytics = useAnalytics();

  useEffect(() => {
    trackPageView(analytics);
  }, [analytics]);
}

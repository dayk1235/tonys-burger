"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "../provider";
import { trackBurgerView } from "../events";

export function useBurgerView<T extends HTMLElement>(
  burgerId: string,
  burgerName: string
) {
  const ref = useRef<T>(null!);
  const analytics = useAnalytics();
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          trackBurgerView(analytics, burgerId, burgerName);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [analytics, burgerId, burgerName]);

  return ref;
}

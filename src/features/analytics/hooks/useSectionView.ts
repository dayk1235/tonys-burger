"use client";

import { useEffect, useRef } from "react";
import { useAnalytics } from "../provider";
import { trackSectionView } from "../events";

export function useSectionView<T extends HTMLElement>(sectionName: string) {
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
          trackSectionView(analytics, sectionName);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [analytics, sectionName]);

  return ref;
}

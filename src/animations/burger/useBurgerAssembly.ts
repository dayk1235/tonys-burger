"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface BurgerStageData {
  id: string;
  name: string;
  description: string;
}

export function useBurgerAssembly<T extends HTMLElement>(
  stages: BurgerStageData[]
) {
  const sectionRef = useRef<T>(null!);
  const [activeStage, setActiveStage] = useState(() => {
    if (typeof window === "undefined") return -1;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return stages.length - 1;
    }
    return -1;
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const activeRef = { current: -1 };

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(
          Math.floor(progress * stages.length),
          stages.length - 1
        );
        const clamped = Math.max(-1, index);
        if (clamped !== activeRef.current) {
          activeRef.current = clamped;
          setActiveStage(clamped);
        }
      },
    });

    return () => {
      st.kill();
    };
  }, [stages.length]);

  return { sectionRef, activeStage };
}

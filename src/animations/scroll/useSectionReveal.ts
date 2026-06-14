"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SectionRevealOptions {
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
  start?: string;
  toggleActions?: string;
  scope?: "section" | "children" | "none";
}

export function useSectionReveal<T extends HTMLElement>(
  options: SectionRevealOptions = {}
) {
  const ref = useRef<T>(null!);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const {
      delay = 0,
      duration = 0.7,
      y = 40,
      start = "top 85%",
      toggleActions = "play none none none",
    } = options;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        ease: "power3.out",
        delay,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}

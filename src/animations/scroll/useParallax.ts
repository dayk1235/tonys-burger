"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ParallaxOptions {
  y?: number;
  start?: string;
  end?: string;
  scrub?: number;
}

export function useParallax<T extends HTMLElement>(
  options: ParallaxOptions = {}
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
      y = -15,
      start = "top bottom",
      end = "bottom top",
      scrub = 0.6,
    } = options;

    gsap.fromTo(
      el,
      { y: 0 },
      {
        y,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement ?? el,
          start,
          end,
          scrub,
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

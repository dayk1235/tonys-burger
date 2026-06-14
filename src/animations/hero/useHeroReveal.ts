"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useHeroReveal() {
  const containerRef = useRef<HTMLDivElement>(null!);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(
        [
          container.querySelector("[data-hero-badge]"),
          container.querySelector("[data-hero-headline]"),
          container.querySelector("[data-hero-subheadline]"),
          container.querySelector("[data-hero-cta]"),
          container.querySelector("[data-hero-trust]"),
          container.querySelector("[data-hero-image]"),
        ],
        { opacity: 1, y: 0 }
      );
      return;
    }

    tl.current = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.current
      .fromTo(
        container.querySelector("[data-hero-badge]"),
        { y: 12 },
        { y: 0, duration: 0.35 }
      )
      .fromTo(
        container.querySelector("[data-hero-headline]"),
        { y: 28 },
        { y: 0, duration: 0.45 },
        "-=0.12"
      )
      .fromTo(
        container.querySelector("[data-hero-subheadline]"),
        { y: 18 },
        { y: 0, duration: 0.35 },
        "-=0.18"
      )
      .fromTo(
        container.querySelector("[data-hero-cta]"),
        { y: 16 },
        { y: 0, duration: 0.3 },
        "-=0.12"
      )
      .fromTo(
        container.querySelector("[data-hero-trust]"),
        { y: 14 },
        { y: 0, duration: 0.3 },
        "-=0.12"
      )
      .fromTo(
        container.querySelector("[data-hero-image]"),
        { y: 22, scale: 0.98 },
        { y: 0, scale: 1, duration: 0.55, ease: "power2.out" },
        "-=0.18"
      );

    return () => {
      if (tl.current) tl.current.kill();
    };
  }, []);

  return containerRef;
}

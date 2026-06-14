"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * useGsapAnimation — Reusable GSAP Animation Hook
 *
 * This is the foundation for all GSAP animations in the project.
 * It provides:
 * - Safe registration of GSAP plugins
 * - Cleanup on unmount
 * - Standardized animation configuration
 *
 * Usage:
 *   const animation = useGsapAnimation();
 *   // Use animation.timeline() or animation.fromTo() etc.
 *
 * PLACEHOLDER: This hook is ready for animation work but
 * no animations have been implemented yet.
 */

export interface AnimationConfig {
  /** Duration in seconds */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** Delay in seconds */
  delay?: number;
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapAnimation() {
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup all GSAP animations on unmount
      if (timeline.current) {
        timeline.current.kill();
      }
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  const createTimeline = useCallback((vars?: gsap.TimelineVars) => {
    timeline.current = gsap.timeline(vars);
    return timeline.current;
  }, []);

  const fadeIn = useCallback(
    (element: string | Element, config?: AnimationConfig) => {
      return gsap.fromTo(
        element,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: config?.duration ?? 0.6,
          ease: config?.ease ?? "power2.out",
          delay: config?.delay ?? 0,
        }
      );
    },
    []
  );

  const fadeInUp = useCallback(
    (element: string | Element, config?: AnimationConfig) => {
      return gsap.fromTo(
        element,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: config?.duration ?? 0.8,
          ease: config?.ease ?? "power3.out",
          delay: config?.delay ?? 0,
        }
      );
    },
    []
  );

  const scaleIn = useCallback(
    (element: string | Element, config?: AnimationConfig) => {
      return gsap.fromTo(
        element,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: config?.duration ?? 0.5,
          ease: config?.ease ?? "back.out(1.7)",
          delay: config?.delay ?? 0,
        }
      );
    },
    []
  );

  return {
    createTimeline,
    fadeIn,
    fadeInUp,
    scaleIn,
    gsap,
  };
}

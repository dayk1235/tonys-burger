"use client";

import { motion } from "framer-motion";
import { getMotionConfig, useMotionContext, parseEasing } from "@design-system";

/* ─── Types ──────────────────────────────────── */

type AnimationRole = "enter" | "notification" | "update";

interface AnimatedSectionProps {
  children: React.ReactNode;
  /** Motion role from design system Ambient Motion System */
  role?: AnimationRole;
  /** Stagger delay based on position in sequence (0–1 scale) */
  delay?: number;
  /** Optional className forwarded to the motion element */
  className?: string;
  /** HTML element to render as (default: section) */
  as?: "section" | "div" | "article";
  /** Whether to use scroll-triggered (whileInView) vs on-mount animation */
  trigger?: "scroll" | "mount";
  /** Optional aria label */
  "aria-label"?: string;
}

/* ─── AnimatedSection ─────────────────────────── */

/**
 * A scroll-aware section wrapper that respects the design system
 * Ambient Motion System. Every section entrance uses consistent
 * motion roles from `getMotionConfig("enter")`.
 *
 * - Scroll-triggered by default (whileInView), creating a narrative
 *   reading flow as the owner scrolls through the dashboard.
 * - Respects reduced motion preferences via `useMotionContext`.
 * - Uses the DS easing curve and duration for every entrance.
 */
export function AnimatedSection({
  children,
  role = "enter",
  delay = 0,
  className,
  as = "section",
  trigger = "scroll",
  "aria-label": ariaLabel,
}: AnimatedSectionProps) {
  const { animationsEnabled, durationScale } = useMotionContext();
  const config = getMotionConfig(role);

  const duration = parseFloat(config.duration) / 1000 * durationScale;
  const easing = parseEasing(config.easing);
  const effectiveDelay = delay * durationScale;

  const motionProps = {
    initial: animationsEnabled ? { opacity: 0, y: 10 } : undefined,
    animate: { opacity: 1, y: 0 },
    transition: {
      duration,
      ease: easing,
      delay: effectiveDelay,
    },
    className,
    "aria-label": ariaLabel,
  };

  const MotionTag = motion[as as keyof typeof motion] as React.ElementType;

  if (trigger === "scroll") {
    return (
      <MotionTag
        {...motionProps}
        initial={animationsEnabled ? { opacity: 0, y: 10 } : undefined}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration,
          ease: easing,
          delay: effectiveDelay,
        }}
        className={className}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag {...motionProps}>
      {children}
    </MotionTag>
  );
}

/**
 * Demo — Experience Progress Indicator
 *
 * Subtle progress indicator displayed during the demo.
 * Shows current moment label and total steps.
 */

"use client";

import { motion } from "framer-motion";

const MOMENT_LABELS = [
  "Welcome",
  "Your Business",
  "Building Understanding",
  "Initial Assessment",
  "First Learnings",
  "Business Memory",
  "Sources of Truth",
  "First Recommendation",
  "Growth Timeline",
  "Closing",
];

interface ExperienceProgressProps {
  current: number;
  total: number;
}

export function ExperienceProgress({ current, total }: ExperienceProgressProps) {
  const label = MOMENT_LABELS[current - 1] ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 flex justify-center"
    >
      <div className="mt-6 flex items-center gap-3 rounded-full border border-border/40 bg-bg/60 px-4 py-1.5 backdrop-blur-md">
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted/50">
          {label}
        </span>
        <span className="text-[10px] text-text-muted/30">·</span>
        <span className="text-[10px] text-text-muted/50">
          {current} of {total}
        </span>
      </div>
    </motion.div>
  );
}

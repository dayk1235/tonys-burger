"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/localization";

/**
 * Design System Imports
 */
import {
  getMotionConfig,
  useMotionContext,
  parseEasing,
} from "@design-system";

/* ─── Props ──────────────────────────────────── */

interface HealthSummaryProps {
  summary: string;
  /** When true, shows a loading skeleton */
  loading?: boolean;
}

/* ─── Loading Skeleton ───────────────────────── */

function HealthSummarySkeleton() {
  const { t } = useTranslation();
  return (
    <div aria-busy={true} aria-label={t("common.loading")}>
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-bg-surface-alt" />
    </div>
  );
}

/* ─── Empty State ────────────────────────────── */

function HealthSummaryEmpty() {
  const { t } = useTranslation();
  return (
    <div className="h-5" aria-label={t("dashboard.health.emptySummary")} />
  );
}

/* ─── HealthSummary Component ────────────────── */

export function HealthSummary({ summary, loading = false }: HealthSummaryProps) {
  const { animationsEnabled, durationScale } = useMotionContext();

  /* Early returns */
  if (loading) return <HealthSummarySkeleton />;
  if (!summary) return <HealthSummaryEmpty />;

  /**
   * One thought, one sentence.
   * Cognitive Behavioral System: reduce cognitive load by showing only what matters.
   */
  const firstSentence = summary.split(".")[0] + ".";

  /* Derive motion config from design system Motion Roles */
  const enterConfig = getMotionConfig("enter");

  return (
    <motion.p
      initial={animationsEnabled ? { opacity: 0, y: 6 } : undefined}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: parseFloat(enterConfig.duration) * durationScale,
        ease: parseEasing(enterConfig.easing),
        delay: 0.1 * durationScale,
      }}
      className="font-sans text-base leading-relaxed text-text-muted sm:text-lg"
    >
      {firstSentence}
    </motion.p>
  );
}

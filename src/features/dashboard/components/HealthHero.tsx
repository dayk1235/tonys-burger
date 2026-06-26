"use client";

import { motion } from "framer-motion";
import type { HealthData } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

/**
 * Design System Imports
 * Every primitive, token, and role comes from here.
 * No hardcoded colors, spacing, or motion values.
 */
import {
  Box,
  semantic,
  getMotionConfig,
  useMotionContext,
  parseEasing,
  getStackClasses,
  getRoleClasses,
} from "@design-system";

/* ─── Health State Visuals ───────────────────── */
/**
 * Derived from design system semantic color tokens.
 * No hardcoded color values — all come from @design-system/tokens/colors.
 */
const STATE_VISUALS: Record<string, { hex: string; label: string }> = {
  excellent: { hex: semantic.success, label: "excellent" },
  healthy: { hex: semantic.success, label: "healthy" },
  stable: { hex: semantic.warning, label: "stable" },
  "needs-attention": { hex: semantic.warning, label: "needsAttention" },
  critical: { hex: semantic.error, label: "critical" },
};

/** Convert kebab-case state names to camelCase for dictionary key lookup */
function stateToKey(state: string): string {
  return state.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/* ─── Props ──────────────────────────────────── */

interface HealthHeroProps {
  health: HealthData;
  /** When true, shows a loading skeleton instead of health data */
  loading?: boolean;
  /** When true, shows an empty state instead of health data */
  empty?: boolean;
}

/* ─── Loading Skeleton ───────────────────────── */

function HealthHeroSkeleton() {
  const { t } = useTranslation();
  return (
    <Box aria-busy={true} aria-label={t("dashboard.health.loading")}>
      <div className={getStackClasses({ direction: "vertical", gap: "4" })} aria-hidden="true">
        <div className="flex items-baseline gap-5">
          <div className="h-20 w-32 animate-pulse rounded-lg bg-bg-surface-alt sm:h-24 lg:h-28" />
          <div className="h-8 w-28 animate-pulse rounded-full bg-bg-surface-alt" />
        </div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-bg-surface-alt" />
      </div>
    </Box>
  );
}

/* ─── Empty State ────────────────────────────── */

function HealthHeroEmpty() {
  const { t } = useTranslation();
  return (
    <Box className={getStackClasses({ direction: "vertical", gap: "3" })} role="status">
      <p className="font-heading text-2xl font-semibold text-text-primary opacity-40">
        --
      </p>
      <p className="font-sans text-base leading-relaxed text-text-muted">
        {t("dashboard.health.empty")}
      </p>
    </Box>
  );
}

/* ─── HealthHero Component ───────────────────── */

export function HealthHero({ health, loading = false, empty = false }: HealthHeroProps) {
  const { t } = useTranslation();
  const { animationsEnabled, durationScale } = useMotionContext();

  /* Early returns for loading and empty states */
  if (loading) return <HealthHeroSkeleton />;
  if (empty || !health) return <HealthHeroEmpty />;

  /* Derive motion config from design system Motion Roles */
  const enterConfig = getMotionConfig("enter");

  const visuals = STATE_VISUALS[health.state] ?? STATE_VISUALS.healthy;
  const stateKey = stateToKey(health.state);
  const stateLabel = t(`health.states.${stateKey}`);

  return (
    <Box
      className={getStackClasses({ direction: "vertical", gap: "4" })}
      role="region"
      aria-label={`Restaurant health: ${health.score} — ${stateLabel}`}
      data-material="business-glass"
    >
      {/* ─── Score + State Badge ──────────────── */}
      <div className="flex items-baseline gap-5">
        {/* Health Score — 'display' typography role for the primary metric */}
        <motion.span
        initial={animationsEnabled ? { opacity: 0, scale: 0.95 } : undefined}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: parseFloat(enterConfig.duration) * durationScale,
          ease: parseEasing(enterConfig.easing),
          delay: 0.02 * durationScale,
        }}
          className={`${getRoleClasses("display")} text-7xl leading-none tracking-tight text-text-primary sm:text-8xl lg:text-9xl`}
        >
          {health.score}
        </motion.span>

        {/* State Badge — 'subheading' typography role, semantic colors from DS tokens */}
        <motion.span
        initial={animationsEnabled ? { opacity: 0, x: -8 } : undefined}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: parseFloat(enterConfig.duration) * durationScale * 0.67,
          ease: parseEasing(enterConfig.easing),
          delay: 0.08 * durationScale,
        }}
          className={`${getRoleClasses("subheading")} text-sm sm:text-base inline-flex items-center rounded-full border px-4 py-1.5`}
          style={{
            color: visuals.hex,
            backgroundColor: `${visuals.hex}1A`,
            borderColor: `${visuals.hex}33`,
          }}
        >
          {stateLabel}
        </motion.span>
      </div>

      {/* ─── Tagline (Meaning Before Metrics) — 'body' typography role */}
      <motion.p
        initial={animationsEnabled ? { opacity: 0, y: 4 } : undefined}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: parseFloat(enterConfig.duration) * durationScale * 0.67,
          ease: parseEasing(enterConfig.easing),
          delay: 0.1 * durationScale,
        }}
        className={`${getRoleClasses("body")} leading-relaxed text-text-secondary sm:text-lg`}
      >
        {t(`health.taglines.${stateKey}`)}
      </motion.p>

      {/* ─── Freshness Indicator — 'caption' typography role */}
      <motion.p
        initial={animationsEnabled ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }}
        transition={{
          duration: parseFloat(enterConfig.duration) * durationScale * 0.67,
          ease: parseEasing(enterConfig.easing),
          delay: 0.14 * durationScale,
        }}
        className={`${getRoleClasses("caption")} text-text-muted/40`}
      >
        {t("health.refreshed", { time: health.refreshedAt })}
      </motion.p>
    </Box>
  );
}

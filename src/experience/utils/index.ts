/**
 * Experience — Utilities
 *
 * Time-based auto detection and resolution utilities.
 * Auto mode determines the experience using local time.
 *
 * Default time ranges:
 *   06:00 → 18:00  = morning
 *   18:00 → 06:00  = focus
 *
 * Time ranges should be configurable.
 */

import type { ExperienceMode, TimeRangeConfig } from "../types";

export const DEFAULT_TIME_RANGES: TimeRangeConfig = {
  morningStart: 6,
  morningEnd: 18,
};

/**
 * Determine whether the current local time falls within morning hours.
 * SSR-safe: returns true (default) when `Date` is unavailable.
 */
export function isMorningTime(timeRange?: TimeRangeConfig): boolean {
  if (typeof Date === "undefined") return true; // SSR default

  const { morningStart, morningEnd } = timeRange ?? DEFAULT_TIME_RANGES;
  const hour = new Date().getHours();

  if (morningStart < morningEnd) {
    // Standard range: e.g. 06:00 - 18:00
    return hour >= morningStart && hour < morningEnd;
  } else {
    // Wrapped range: e.g. 22:00 - 06:00 (overnight)
    return hour >= morningStart || hour < morningEnd;
  }
}

/**
 * Resolve the experience mode based on local time.
 * Returns "morning" or "focus" — never "auto".
 */
export function resolveAutoMode(timeRange?: TimeRangeConfig): ExperienceMode {
  return isMorningTime(timeRange) ? "morning" : "focus";
}

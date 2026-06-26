/**
 * Living Background — Scene Definitions
 *
 * Each scene defines semantic atmosphere values.
 * Never CSS values directly — only warmth, brightness, depth, contrast.
 *
 * The LivingBackground component translates these to visual styles.
 *
 * Adding a scene:
 *   1. Add a SceneId to types/index.ts
 *   2. Add the scene definition here
 *   3. Add a time range in DEFAULT_SCENE_RANGES
 *   4. No existing code needs to change
 */

import type { SceneDefinition, SceneId, SceneTimeRange } from "../types";

export const SCENES: Record<SceneId, SceneDefinition> = {
  /**
   * Morning — 06:00 – 09:00
   * Cool, rising warmth. Fresh start. Gentle amber hint.
   */
  "morning": {
    id: "morning",
    atmosphere: {
      warmth: 1.0,
      brightness: 0.8,
      depth: 0.4,
      contrast: 0.6,
      motion: "soft",
      label: "Morning",
    },
  },

  /**
   * Lunch — 11:00 – 13:00
   * Bright, neutral. High energy. Clean light.
   */
  "lunch": {
    id: "lunch",
    atmosphere: {
      warmth: 1.2,
      brightness: 1.0,
      depth: 0.5,
      contrast: 0.8,
      motion: "still",
      label: "Lunch",
    },
  },

  /**
   * Afternoon — 14:00 – 17:00
   * Warm, mellow. Golden undertone. Relaxed.
   */
  "afternoon": {
    id: "afternoon",
    atmosphere: {
      warmth: 1.5,
      brightness: 0.9,
      depth: 0.6,
      contrast: 0.7,
      motion: "soft",
      label: "Afternoon",
    },
  },

  /**
   * Golden Hour — 17:00 – 19:00
   * Very warm, golden. Rich atmosphere. Transitional.
   */
  "golden-hour": {
    id: "golden-hour",
    atmosphere: {
      warmth: 2.0,
      brightness: 0.7,
      depth: 1.0,
      contrast: 1.2,
      motion: "soft",
      label: "Golden Hour",
    },
  },

  /**
   * Night — 19:00 – 22:00
   * Dark, cool. Deep atmosphere. Calm and professional.
   */
  "night": {
    id: "night",
    atmosphere: {
      warmth: 0.4,
      brightness: 0.3,
      depth: 1.6,
      contrast: 1.4,
      motion: "soft",
      label: "Night",
    },
  },

  /**
   * Closing — 22:00 – 06:00
   * Deep, minimal. Lowest energy. Almost no atmosphere.
   */
  "closing": {
    id: "closing",
    atmosphere: {
      warmth: 0.2,
      brightness: 0.15,
      depth: 2.0,
      contrast: 1.8,
      motion: "still",
      label: "Closing",
    },
  },
};

/**
 * Default time ranges for automatic scene detection.
 * Ranges cover all 24 hours with no gaps.
 * Wrapped ranges (startHour > endHour) span midnight.
 * Ordered for deterministic matching — standard ranges first,
 * wrapped ranges last to avoid premature matching.
 */
export const DEFAULT_SCENE_RANGES: SceneTimeRange[] = [
  { startHour: 6, endHour: 11, sceneId: "morning" },
  { startHour: 11, endHour: 14, sceneId: "lunch" },
  { startHour: 14, endHour: 17, sceneId: "afternoon" },
  { startHour: 17, endHour: 19, sceneId: "golden-hour" },
  { startHour: 19, endHour: 22, sceneId: "night" },
  // Closing wraps from 22:00 through midnight to 06:00
  { startHour: 22, endHour: 6, sceneId: "closing" },
];

/**
 * Check if a given hour falls within a time range.
 * Supports wrapped ranges (e.g., 22:00 – 06:00).
 */
function hourInRange(hour: number, startHour: number, endHour: number): boolean {
  if (startHour <= endHour) {
    // Standard range: e.g. 06:00 – 11:00
    return hour >= startHour && hour < endHour;
  }
  // Wrapped range: e.g. 22:00 – 06:00 (overnight)
  return hour >= startHour || hour < endHour;
}

/**
 * Resolve the current scene based on local time.
 * SSR-safe: returns "morning" (default) when Date is unavailable.
 * Time ranges are processed in order; the first matching range wins.
 */
export function resolveScene(sceneRanges?: SceneTimeRange[]): SceneId {
  if (typeof Date === "undefined") return "morning";

  const ranges = sceneRanges ?? DEFAULT_SCENE_RANGES;
  const hour = new Date().getHours();

  for (const range of ranges) {
    if (hourInRange(hour, range.startHour, range.endHour)) {
      return range.sceneId;
    }
  }

  // Fallback — should never be reached if ranges cover all 24 hours
  return "closing";
}

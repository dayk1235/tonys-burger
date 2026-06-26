/**
 * Living Background — useLivingBackground Hook
 *
 * Returns the current scene, atmosphere values, and motion level.
 *
 * Example API:
 *   const { sceneId, scene, motionLevel } = useLivingBackground();
 *
 *   sceneId       → "morning" | "lunch" | "afternoon" | "golden-hour" | "night" | "closing"
 *   scene         → { id, atmosphere: { warmth, brightness, depth, contrast, motion, label } }
 *   motionLevel   → "still" | "soft" | "medium" | "dynamic"
 *   parallaxEnabled → boolean
 *   setSceneOverride → (scene: SceneId | null) => void
 */

"use client";

import { useLivingBackgroundContext } from "../provider/LivingBackgroundProvider";

export function useLivingBackground() {
  return useLivingBackgroundContext();
}

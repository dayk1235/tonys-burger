/**
 * Living Background — Barrel Export
 *
 * Import from "@/features/living-background" in your components.
 */

export { LivingBackgroundProvider, useLivingBackgroundContext } from "./provider/LivingBackgroundProvider";
export { useLivingBackground } from "./hooks/useLivingBackground";
export { LivingBackground } from "./components/LivingBackground";
export type {
  SceneId,
  MotionLevel,
  AtmosphereValues,
  SceneDefinition,
  LivingBackgroundContextValue,
  ParallaxConfig,
} from "./types";
export { SCENES, DEFAULT_SCENE_RANGES, resolveScene } from "./scenes";

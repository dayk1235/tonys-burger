/**
 * Living Background — Type Definitions
 *
 * Defines the scene system, atmosphere values, and motion levels
 * for the Living Background Engine.
 *
 * All values are semantic — never CSS values directly.
 * The LivingBackground component translates these to visual styles.
 *
 * Future scenes are added by extending the SCENES record.
 * No existing code needs to change.
 */

/**
 * Time-of-day scenes.
 * Each scene represents a visual atmosphere period.
 */
export type SceneId =
  | "morning"
  | "lunch"
  | "afternoon"
  | "golden-hour"
  | "night"
  | "closing";

/**
 * Motion intensity levels.
 * The engine decides the level; components obey.
 *
 * Still   — No motion. Static backgrounds. Used when the owner is reading.
 * Soft    — Subtle ambient motion. Gentle pulse, slow drift. Default.
 * Medium  — Noticeable ambient motion. Used in demo/cinematic modes.
 * Dynamic — Full motion. Used in transitions, celebrations.
 */
export type MotionLevel = "still" | "soft" | "medium" | "dynamic";

/**
 * Semantic atmosphere values.
 * These describe the visual feeling — not CSS values.
 */
export interface AtmosphereValues {
  /** 0 = cold, 1 = neutral, 2 = warm */
  warmth: number;
  /** 0 = dark, 1 = neutral, 2 = bright */
  brightness: number;
  /** 0 = flat, 1 = normal, 2 = deep */
  depth: number;
  /** 0 = low, 1 = normal, 2 = high */
  contrast: number;
  /** Suggested motion level for this scene */
  motion: MotionLevel;
  /** Label for debugging and future UI */
  label: string;
}

/**
 * Scene definition.
 */
export interface SceneDefinition {
  id: SceneId;
  atmosphere: AtmosphereValues;
}

/**
 * Time range for automatic scene detection.
 */
export interface SceneTimeRange {
  startHour: number;
  endHour: number;
  sceneId: SceneId;
}

/**
 * Context value exposed by LivingBackgroundProvider.
 */
export interface LivingBackgroundContextValue {
  /** Current scene ID */
  sceneId: SceneId;
  /** Current scene definition with atmosphere values */
  scene: SceneDefinition;
  /** Current motion level */
  motionLevel: MotionLevel;
  /** Whether parallax effects are enabled */
  parallaxEnabled: boolean;
  /** Override the scene manually (null = auto) */
  setSceneOverride: (scene: SceneId | null) => void;
}

/**
 * Configuration for future parallax support.
 * Prepared but not implemented.
 */
export interface ParallaxConfig {
  mouse: boolean;
  scroll: boolean;
  touch: boolean;
  intensity: number;
}

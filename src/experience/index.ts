/**
 * Experience — Barrel Export
 *
 * Central export point for the experience module.
 * Import from "@/experience" in your components.
 */

export { ExperienceProvider, useExperienceContext } from "./provider/ExperienceProvider";
export { useExperience } from "./hooks/useExperience";
export type {
  ExperienceMode,
  ResolvableExperienceMode,
  ExperienceContextValue,
  TimeRangeConfig,
  ExperienceSetter,
} from "./types";
export { THEMES, getThemeCss } from "./themes";
export type { ThemeVariables } from "./themes";
export { DEFAULT_TIME_RANGES, resolveAutoMode, isMorningTime } from "./utils";
export { getStoredExperience, persistExperience, clearExperiencePreference } from "./storage";

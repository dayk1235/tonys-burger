/**
 * Experience — Storage / Persistence
 *
 * Persists the user's experience preference (morning, focus, auto)
 * to localStorage. SSR-safe: returns null when window is undefined.
 *
 * Follows the same pattern as localization/detection.ts
 * with the key prefix: restaurant-os:experience
 */

import type { ResolvableExperienceMode } from "../types";

const STORAGE_KEY = "restaurant-os:experience";

/**
 * Get the persisted experience preference.
 * Returns null if nothing is stored or if on the server.
 */
export function getStoredExperience(): ResolvableExperienceMode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "morning" || stored === "focus" || stored === "auto") {
    return stored;
  }
  return null;
}

/**
 * Persist the experience preference to localStorage.
 * SSR-safe: no-op when window is undefined.
 */
export function persistExperience(mode: ResolvableExperienceMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, mode);
}

/**
 * Remove the persisted preference (falls back to default).
 */
export function clearExperiencePreference(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

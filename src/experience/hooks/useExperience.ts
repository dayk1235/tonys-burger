/**
 * Experience — useExperience Hook
 *
 * Convenience hook that returns the current experience context.
 * Never exposes implementation details.
 *
 * Example API:
 *   const { experience, resolvedExperience, setExperience, isMorning, isFocus } = useExperience();
 *
 *   experience          → "morning" | "focus" | "auto" (user preference)
 *   resolvedExperience  → "morning" | "focus" (never "auto")
 *   setExperience()     → Set preference
 *   isMorning           → resolvedExperience === "morning"
 *   isFocus             → resolvedExperience === "focus"
 */

"use client";

import { useExperienceContext } from "../provider/ExperienceProvider";

export function useExperience() {
  return useExperienceContext();
}

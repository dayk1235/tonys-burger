/**
 * Experience — Provider
 *
 * React context provider that delivers the current experience,
 * resolves Auto mode, persists selection, and exposes the API
 * through React Context.
 *
 * SSR-safe: on the server, defaults to Morning. On hydration,
 * reads the persisted preference and resolves Auto mode.
 *
 * Changing the experience:
 * - Does NOT reload the page
 * - Does NOT reset component state
 * - Does NOT interrupt navigation
 * - Does NOT break animations
 *
 * It applies a CSS class to <html> and updates CSS custom properties
 * at the :root level. The browser handles the rest via CSS transitions.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type {
  ExperienceContextValue,
  ExperienceMode,
  ResolvableExperienceMode,
  TimeRangeConfig,
} from "../types";
import { DEFAULT_TIME_RANGES, resolveAutoMode } from "../utils";
import { getStoredExperience, persistExperience } from "../storage";
import { getThemeCss, THEMES } from "../themes";

const DEFAULT_EXPERIENCE: ResolvableExperienceMode = "auto";

const DEFAULT_CONTEXT: ExperienceContextValue = {
  experience: DEFAULT_EXPERIENCE,
  resolvedExperience: "morning",
  setExperience: () => {},
  isMorning: true,
  isFocus: false,
  timeRange: DEFAULT_TIME_RANGES,
  setTimeRange: () => {},
};

const ExperienceContext = createContext<ExperienceContextValue>(DEFAULT_CONTEXT);

interface ExperienceProviderProps {
  children: ReactNode;
}

/**
 * Apply theme CSS variables to the document root.
 * Uses a <style> element to set the CSS custom properties
 * on :root so the Tailwind @theme inline references resolve.
 */
function applyTheme(mode: ExperienceMode): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const theme = THEMES[mode];

  // Apply each CSS variable as a style on the root element
  root.style.setProperty("--exp-bg", theme.bg);
  root.style.setProperty("--exp-bg-surface", theme.bgSurface);
  root.style.setProperty("--exp-bg-surface-alt", theme.bgSurfaceAlt);
  root.style.setProperty("--exp-bg-elevated", theme.bgElevated);
  root.style.setProperty("--exp-text-primary", theme.textPrimary);
  root.style.setProperty("--exp-text-secondary", theme.textSecondary);
  root.style.setProperty("--exp-text-muted", theme.textMuted);
  root.style.setProperty("--exp-border", theme.border);
  root.style.setProperty("--exp-border-light", theme.borderLight);
  root.style.setProperty("--exp-shadow-sm", theme.shadowSm);
  root.style.setProperty("--exp-shadow-md", theme.shadowMd);
  root.style.setProperty("--exp-shadow-lg", theme.shadowLg);
  root.style.setProperty("--exp-shadow-xl", theme.shadowXl);
  root.style.setProperty("--exp-shadow-glow-primary", theme.shadowGlowPrimary);
  root.style.setProperty("--exp-shadow-glow-secondary", theme.shadowGlowSecondary);

  // Also set the experience class for any :root.experience-focus CSS rules
  root.classList.remove("experience-morning", "experience-focus");
  root.classList.add(`experience-${mode}`);
}

export function ExperienceProvider({ children }: ExperienceProviderProps) {
  const [experience, setExperienceState] = useState<ResolvableExperienceMode>(DEFAULT_EXPERIENCE);
  const [timeRange, setTimeRangeState] = useState<TimeRangeConfig>(DEFAULT_TIME_RANGES);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount (client-side only)
  useEffect(() => {
    const stored = getStoredExperience();
    const initial = stored ?? DEFAULT_EXPERIENCE;
    setExperienceState(initial);

    // Resolve and apply theme
    const resolved = initial === "auto" ? resolveAutoMode(timeRange) : initial;
    applyTheme(resolved);
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Refresh auto mode every minute
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      if (experience === "auto") {
        const resolved = resolveAutoMode(timeRange);
        applyTheme(resolved);
      }
    }, 60_000); // every minute

    return () => clearInterval(interval);
  }, [mounted, experience, timeRange]);

  const setExperience = useCallback((mode: ResolvableExperienceMode) => {
    setExperienceState(mode);
    persistExperience(mode);

    const resolved = mode === "auto" ? resolveAutoMode() : mode;
    applyTheme(resolved);
  }, []);

  const setTimeRange = useCallback((config: TimeRangeConfig) => {
    setTimeRangeState(config);
    // Re-resolve if in auto mode
    if (experience === "auto") {
      const resolved = resolveAutoMode(config);
      applyTheme(resolved);
    }
  }, [experience]);

  const resolvedExperience: ExperienceMode =
    experience === "auto" ? resolveAutoMode(timeRange) : experience;

  const value = useMemo<ExperienceContextValue>(
    () => ({
      experience,
      resolvedExperience,
      setExperience,
      isMorning: resolvedExperience === "morning",
      isFocus: resolvedExperience === "focus",
      timeRange,
      setTimeRange,
    }),
    [experience, resolvedExperience, setExperience, timeRange, setTimeRange],
  );

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperienceContext(): ExperienceContextValue {
  return useContext(ExperienceContext);
}

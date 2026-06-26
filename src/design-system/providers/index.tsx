/**
 * Design System — Provider
 *
 * Consolidates all design system Context providers into a single provider.
 * This is the only provider consumers need to wrap their application.
 *
 * Currently provides:
 * - Motion context (respects reduced motion preferences)
 *
 * Order: No dependencies currently, but designed for future expansion.
 */

"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useReducedMotion } from "../hooks";

/* ─── Motion Context ─────────────────────────── */

export interface MotionContextValue {
  /** Whether the user prefers reduced motion */
  prefersReducedMotion: boolean;
  /** Whether animations should be enabled */
  animationsEnabled: boolean;
  /** Duration scale factor (1 = normal, 0 = instant for reduced motion) */
  durationScale: number;
}

const MotionContext = createContext<MotionContextValue>({
  prefersReducedMotion: false,
  animationsEnabled: true,
  durationScale: 1,
});

export function useMotionContext(): MotionContextValue {
  return useContext(MotionContext);
}

/* ─── Design System Provider ─────────────────── */

export interface DesignSystemProviderProps {
  children: ReactNode;
}

/**
 * DesignSystemProvider — Wraps the application with design system context.
 *
 * @example
 * <DesignSystemProvider>
 *   <App />
 * </DesignSystemProvider>
 */
export function DesignSystemProvider({ children }: DesignSystemProviderProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionValue = useMemo<MotionContextValue>(
    () => ({
      prefersReducedMotion,
      animationsEnabled: !prefersReducedMotion,
      durationScale: prefersReducedMotion ? 0 : 1,
    }),
    [prefersReducedMotion],
  );

  return (
    <MotionContext.Provider value={motionValue}>
      {children}
    </MotionContext.Provider>
  );
}

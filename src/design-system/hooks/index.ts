/**
 * Design System — Hooks
 *
 * Reusable hooks that bridge the design system with React.
 * These hooks are generic — no business logic, no page-specific behavior.
 */

"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

/* ─── useMediaQuery ──────────────────────────── */

/**
 * useMediaQuery — Reactively matches a media query string.
 *
 * @param query - CSS media query string (e.g., "(min-width: 768px)")
 * @returns whether the media query currently matches
 *
 * @example
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ─── useReducedMotion ───────────────────────── */

/**
 * useReducedMotion — Detects whether the user prefers reduced motion.
 * Every animation in the design system must respect this preference.
 *
 * @example
 * const prefersReduced = useReducedMotion();
 * const shouldAnimate = !prefersReduced;
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/* ─── Responsive Breakpoints ─────────────────── */
export type ResponsiveBreakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const BREAKPOINT_MAP: Record<ResponsiveBreakpoint, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1440px)",
};

/**
 * useResponsive — Reactively matches a named breakpoint.
 *
 * @param breakpoint - Named breakpoint (sm | md | lg | xl | 2xl)
 * @returns whether the viewport is at least the given breakpoint
 *
 * @example
 * const isDesktop = useResponsive("lg");
 * const isTablet = useResponsive("md") && !useResponsive("lg");
 */
export function useResponsive(breakpoint: ResponsiveBreakpoint): boolean {
  const query = BREAKPOINT_MAP[breakpoint];
  return useMediaQuery(query);
}

/**
 * useViewport — Returns the current viewport dimensions.
 * Use sparingly — prefer useMediaQuery or useResponsive for most cases.
 *
 * @example
 * const { width, height } = useViewport();
 */
export function useViewport(): { width: number; height: number } {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  const getSnapshot = useCallback(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }), []);

  const getServerSnapshot = useCallback(() => ({
    width: 0,
    height: 0,
  }), []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ─── usePrefersColorScheme ──────────────────── */

export type ColorScheme = "light" | "dark" | "no-preference";

/**
 * usePrefersColorScheme — Detects the user's preferred color scheme.
 *
 * @example
 * const scheme = usePrefersColorScheme();
 */
export function usePrefersColorScheme(): ColorScheme {
  const isDark = useMediaQuery("(prefers-color-scheme: dark)");
  const isLight = useMediaQuery("(prefers-color-scheme: light)");

  if (isDark) return "dark";
  if (isLight) return "light";
  return "no-preference";
}

/* ─── useReducedData ─────────────────────────── */

/**
 * useReducedData — Detects whether the user prefers reduced data usage.
 * Can be used to disable auto-playing media or heavy data fetching.
 */
export function useReducedData(): boolean {
  return useMediaQuery("(prefers-reduced-data: reduce)");
}

/* ─── useStableCallback ──────────────────────── */

/**
 * useStableCallback — Returns a stable callback reference.
 * Useful for passing callbacks to child components without triggering re-renders.
 *
 * @example
 * const handleClick = useStableCallback(() => {
 *   console.log(count);
 * });
 */
import { useRef, useInsertionEffect } from "react";

export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  const ref = useRef(callback);

  useInsertionEffect(() => {
    ref.current = callback;
  }, [callback]);

  const stableRef = useRef((...args: any[]) => ref.current(...args));

  return stableRef.current as T;
}

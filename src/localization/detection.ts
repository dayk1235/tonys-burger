/**
 * Localization — Language Detection
 *
 * Detects the user's preferred language from browser settings,
 * allows manual override, and persists the choice.
 */

import type { LocaleCode } from "./types";
import { DEFAULT_LOCALE } from "./locales";

const STORAGE_KEY = "restaurant-os:locale";
const REGION_STORAGE_KEY = "restaurant-os:region";

/**
 * Map a browser language tag to a supported locale code.
 * Examples: "es-MX" → "es", "en-US" → "en", "es" → "es"
 */
function detectFromBrowser(): LocaleCode {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const lang = navigator.language?.toLowerCase() ?? "";

  if (lang.startsWith("es")) return "es";
  if (lang.startsWith("en")) return "en";

  return DEFAULT_LOCALE;
}

/**
 * Get the current locale, checking in order:
 * 1. Stored user preference
 * 2. Browser language
 * 3. Default
 */
export function getStoredLocale(): LocaleCode | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "es") return stored;
  return null;
}

export function getEffectiveLocale(): LocaleCode {
  return getStoredLocale() ?? detectFromBrowser();
}

export function persistLocale(locale: LocaleCode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, locale);
}

export function getStoredRegion(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REGION_STORAGE_KEY);
}

export function persistRegion(region: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REGION_STORAGE_KEY, region);
}

export function clearLocalePreference(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

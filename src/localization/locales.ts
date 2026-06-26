/**
 * Localization — Locale Definitions
 *
 * Each locale defines its code, display labels, supported regions,
 * and default region. Add new locales here without touching any
 * other file in the system.
 */

import type { LocaleDefinition, LocaleCode } from "./types";

export const LOCALES: Record<LocaleCode, LocaleDefinition> = {
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    regions: ["US"],
    defaultRegion: "US",
  },
  es: {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    regions: ["MX"],
    defaultRegion: "MX",
  },
};

export const LOCALE_LIST: LocaleDefinition[] = Object.values(LOCALES);

export const DEFAULT_LOCALE: LocaleCode = "en";

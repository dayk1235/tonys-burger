/**
 * Localization — Barrel Export
 *
 * Central export point for the localization module.
 * Import from "@/localization" in your components.
 */

export { LocalizationProvider, useLocalization } from "./provider/LocalizationProvider";
export { useTranslation } from "./hooks/useTranslation";
export type { LocaleCode, LocaleDefinition, LocaleConfig, NestedDict } from "./types";
export { LOCALES, LOCALE_LIST, DEFAULT_LOCALE } from "./locales";
export { getEffectiveLocale, getStoredLocale, persistLocale } from "./detection";
export {
  formatNumber,
  formatCurrency,
  formatDate,
  formatTime,
  formatRelativeTime,
} from "./formatter";

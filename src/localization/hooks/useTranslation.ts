/**
 * Localization — useTranslation Hook
 *
 * Convenience hook that returns the `t` function and current locale.
 * Use this in components instead of accessing context directly.
 */

"use client";

import { useLocalization } from "../provider/LocalizationProvider";

export function useTranslation() {
  const { t, locale, setLocale } = useLocalization();
  return { t, locale, setLocale };
}

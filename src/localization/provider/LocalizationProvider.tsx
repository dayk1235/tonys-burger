/**
 * Localization — Provider
 *
 * React context provider that delivers locale state,
 * translation function, and locale switching to the entire app.
 *
 * Always renders the context provider wrapper so child components
 * using useTranslation() never encounter a missing context — even
 * during SSR or the first client render before hydration.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { LocaleCode, NestedDict } from "../types";
import { DEFAULT_LOCALE } from "../locales";
import { getEffectiveLocale, persistLocale } from "../detection";
import { getDictionary } from "../dictionaries";
import { translate } from "../utils";

interface LocalizationContextValue {
  locale: LocaleCode;
  dict: NestedDict;
  setLocale: (locale: LocaleCode) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

const defaultDict = getDictionary(DEFAULT_LOCALE);

const DEFAULT_CONTEXT: LocalizationContextValue = {
  locale: DEFAULT_LOCALE,
  dict: defaultDict,
  setLocale: () => {}, // placeholder, replaced after mount
  t: (path: string, params?: Record<string, string | number>) =>
    translate(defaultDict, path, params),
};

const LocalizationContext = createContext<LocalizationContextValue>(DEFAULT_CONTEXT);

interface LocalizationProviderProps {
  children: ReactNode;
}

export function LocalizationProvider({ children }: LocalizationProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(DEFAULT_LOCALE);
  const [dict, setDict] = useState<NestedDict>(defaultDict);
  const [mounted, setMounted] = useState(false);

  // Initialize locale on mount (client-side only)
  useEffect(() => {
    const effective = getEffectiveLocale();
    setLocaleState(effective);
    setDict(getDictionary(effective));
    setMounted(true);
  }, []);

  // Update the HTML lang attribute when locale changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "es" ? "es-MX" : "en-US";
    }
  }, [locale]);

  const setLocale = useCallback((newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    setDict(getDictionary(newLocale));
    persistLocale(newLocale);
  }, []);

  const t = useCallback(
    (path: string, params?: Record<string, string | number>) => {
      return translate(dict, path, params);
    },
    [dict],
  );

  return (
    <LocalizationContext.Provider value={{ locale, dict, setLocale, t }}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization(): LocalizationContextValue {
  return useContext(LocalizationContext);
}

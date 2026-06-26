/**
 * Localization — Dictionary Registry
 *
 * Central registry for all locale dictionaries.
 * Adding a new language requires:
 * 1. Create a dictionary file (e.g., fr.ts)
 * 2. Import it here
 * 3. Add it to the DICTIONARIES map
 */

import type { LocaleCode, NestedDict } from "../types";
import en from "./en";
import es from "./es";

const DICTIONARIES: Record<LocaleCode, NestedDict> = {
  en,
  es,
};

export function getDictionary(locale: LocaleCode): NestedDict {
  return DICTIONARIES[locale] ?? DICTIONARIES.en;
}

export function hasDictionary(locale: LocaleCode): boolean {
  return locale in DICTIONARIES;
}

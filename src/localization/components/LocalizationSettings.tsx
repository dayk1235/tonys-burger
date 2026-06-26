/**
 * Localization — Settings Panel
 *
 * Compact settings panel for language, region, and timezone selection.
 * Accessible from the Topbar as a dropdown.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { useLocalization, type LocaleCode, LOCALE_LIST } from "@/localization";

export function LocalizationSettings() {
  const { locale, setLocale, t } = useLocalization();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const currentLocale = LOCALE_LIST.find((l) => l.code === locale);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={panelRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary"
        aria-label={t("settings.title")}
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{currentLocale?.nativeLabel ?? "EN"}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-border bg-bg-surface p-4 shadow-xl shadow-black/30"
          >
            <h3 className="mb-3 text-sm font-semibold text-text-primary">
              {t("settings.title")}
            </h3>

            {/* Language */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {t("settings.language")}
              </label>
              <div className="space-y-1">
                {/* Auto option */}
                <button
                  onClick={() => {
                    /* Detect browser locale and switch without page reload */
                    const browserLang = typeof navigator !== "undefined"
                      ? (navigator.language?.startsWith("es") ? "es" : "en")
                      : "en";
                    setLocale(browserLang as LocaleCode);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-bg-surface-alt ${
                    locale !== "en" && locale !== "es"
                      ? "bg-brand-primary/10 text-text-primary"
                      : "text-text-muted"
                  }`}
                >
                  <span>{t("settings.auto")}</span>
                  <span className="text-[11px] text-text-muted/50">
                    {typeof navigator !== "undefined"
                      ? navigator.language
                      : "—"}
                  </span>
                </button>

                {LOCALE_LIST.map((loc) => (
                  <button
                    key={loc.code}
                    onClick={() => {
                      setLocale(loc.code as LocaleCode);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-bg-surface-alt ${
                      locale === loc.code
                        ? "bg-brand-primary/10 text-text-primary"
                        : "text-text-muted"
                    }`}
                  >
                    <span>{loc.nativeLabel}</span>
                    <span className="text-[11px] text-text-muted/50">
                      {loc.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Region — placeholder */}
            <div className="mt-4 space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {t("settings.region")}
              </label>
              <div className="rounded-lg bg-bg-surface-alt px-3 py-2 text-sm text-text-muted/60">
                {t("settings.auto")}
                <span className="ml-2 text-[10px] text-text-muted/40">
                  {t("settings.comingSoon")}
                </span>
              </div>
            </div>

            {/* Timezone — placeholder */}
            <div className="mt-3 space-y-2">
              <label className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                {t("settings.timezone")}
              </label>
              <div className="rounded-lg bg-bg-surface-alt px-3 py-2 text-sm text-text-muted/60">
                {typeof Intl !== "undefined"
                  ? Intl.DateTimeFormat().resolvedOptions().timeZone
                  : "—"}
                <span className="ml-2 text-[10px] text-text-muted/40">
                  {t("settings.comingSoon")}
                </span>
              </div>
            </div>

            {/* Future settings — visual placeholders */}
            <div className="mt-4 border-t border-border pt-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-bg-surface-alt/50 px-2.5 py-2 text-center">
                  <p className="text-[10px] text-text-muted/40">{t("settings.currency")}</p>
                  <p className="text-[10px] text-text-muted/30">{t("settings.comingSoon")}</p>
                </div>
                <div className="rounded-lg bg-bg-surface-alt/50 px-2.5 py-2 text-center">
                  <p className="text-[10px] text-text-muted/40">{t("settings.measurementUnits")}</p>
                  <p className="text-[10px] text-text-muted/30">{t("settings.comingSoon")}</p>
                </div>
                <div className="rounded-lg bg-bg-surface-alt/50 px-2.5 py-2 text-center">
                  <p className="text-[10px] text-text-muted/40">{t("settings.dateFormat")}</p>
                  <p className="text-[10px] text-text-muted/30">{t("settings.comingSoon")}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

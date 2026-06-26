"use client";

import { useTranslation } from "@/localization";

export function MemoryInsight() {
  const { t } = useTranslation();
  return (
    <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 sm:p-8 space-y-4">
      <h3 className="text-sm font-semibold text-text-primary">{t("dashboard.memory.learning")}</h3>
      <div className="space-y-3 text-[15px] text-text-secondary">
        <p>{t("dashboard.memory.note1")}</p>
        <p>{t("dashboard.memory.note2")}</p>
        <p className="font-medium text-text-primary pt-2">
          {t("dashboard.memory.summary")}
        </p>
      </div>
    </div>
  );
}

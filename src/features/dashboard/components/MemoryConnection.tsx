"use client";

import { useTranslation } from "@/localization";

export function MemoryConnection() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[15px] leading-relaxed text-text-primary">
          {t("dashboard.memory.observation")}
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-light tracking-tight text-text-primary">
              {t("dashboard.memory.highConfidence")}
            </span>
            <span className="text-[15px] font-medium text-brand-primary">
              {t("dashboard.memory.memoryConfidence")}
            </span>
          </div>
        </div>
        <div className="space-y-3 pt-2">
          <p className="text-[15px] text-text-secondary">
            {t("dashboard.memory.comparison")}
          </p>
        </div>
      </div>
    </div>
  );
}

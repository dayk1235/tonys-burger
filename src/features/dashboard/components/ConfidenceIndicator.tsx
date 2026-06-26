"use client";

import { useTranslation } from "@/localization";

export function ConfidenceIndicator({ confidence = 87 }: { confidence?: number }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-light tracking-tight text-text-primary">
            {confidence}%
          </span>
          <span className="text-[15px] font-medium text-brand-primary">
            {t("dashboard.badges.highConfidence")}
          </span>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.badges.confidence")}
        </p>
        <ul className="space-y-2 text-[15px] text-text-secondary">
          <li className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-border" />
            {t("dashboard.memory.comparison")}
          </li>
          <li className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-border" />
            {t("dashboard.memory.observation")}
          </li>
          <li className="flex items-center gap-3">
            <span className="size-1.5 rounded-full bg-border" />
            {t("dashboard.memory.partialSuccess")}
          </li>
        </ul>
      </div>
    </div>
  );
}

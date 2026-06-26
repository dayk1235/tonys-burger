"use client";

import { ArrowDown } from "lucide-react";
import { useTranslation } from "@/localization";

export function DecisionTimeline() {
  const { t } = useTranslation();
  const TIMELINE_STEPS = [
    t("dashboard.insightDetail.timeline.observedPattern"),
    t("dashboard.insightDetail.timeline.comparedRecentHistory"),
    t("dashboard.insightDetail.timeline.comparedSimilarPeriods"),
    t("dashboard.insightDetail.timeline.detectedOpportunity"),
    t("dashboard.insightDetail.timeline.generatedRecommendation"),
  ];
  return (
    <div className="space-y-6 rounded-2xl bg-surface-secondary/50 p-6 sm:p-8 border border-border/50">
      <h3 className="text-sm font-medium text-text-primary uppercase tracking-wider">
        {t("dashboard.insightDetail.decisionProcess")}
      </h3>
      <div className="space-y-1">
        {TIMELINE_STEPS.map((step, index) => (
          <div key={index} className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <p className="text-[15px] leading-relaxed text-text-secondary">{step}</p>
            </div>
            {index < TIMELINE_STEPS.length - 1 && (
              <ArrowDown size={14} className="my-3 ml-2 text-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

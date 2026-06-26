"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp, Award } from "lucide-react";
import { InsightIcon } from "./InsightIcon";
import type { Recommendation } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface ActionSummaryProps {
  recommendation: Recommendation;
}

export function ActionSummary({ recommendation }: ActionSummaryProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="rounded-2xl border border-border bg-bg-surface p-5 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <InsightIcon icon={recommendation.icon} />
        <div className="min-w-0 flex-1 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">
              {t("insight.recommendedAction")}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{recommendation.title}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex items-start gap-2.5 rounded-xl bg-bg-surface-alt/50 p-3">
              <Target size={16} className="mt-0.5 shrink-0 text-brand-primary-light" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {t("dashboard.actionCenter.businessGoal")}
                </p>
                <p className="mt-0.5 text-sm text-text-primary">
                  {recommendation.description}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl bg-bg-surface-alt/50 p-3">
              <TrendingUp size={16} className="mt-0.5 shrink-0 text-emerald-400" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {t("dashboard.actionCenter.expectedBenefit")}
                </p>
                <p className="mt-0.5 text-sm text-text-primary">
                  {t("dashboard.insightDetail.expectedImpact")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 rounded-xl bg-bg-surface-alt/50 p-3">
              <Award size={16} className="mt-0.5 shrink-0 text-amber-400" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                  {t("dashboard.badges.priority")}
                </p>
                <p className="mt-0.5 text-sm text-text-primary capitalize">
                  {recommendation.priority}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

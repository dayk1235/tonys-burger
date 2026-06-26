"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { DemoBadge } from "./DemoBadge";
import { useTranslation } from "@/localization";

interface PredictionCardProps {
  impact: string;
}

export function PredictionCard({ impact }: PredictionCardProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("experiment.estimatedOutcome")}</h2>
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-bg-surface to-emerald-500/5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={22} />
          </div>
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-text-primary">{t("insight.improvement")}</h3>
              <DemoBadge />
            </div>
            <p className="text-2xl font-semibold tracking-tight text-emerald-400">
              {impact}
            </p>
            <p className="text-xs text-text-muted">{t("dashboard.insightDetail.basedOnDemo")}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

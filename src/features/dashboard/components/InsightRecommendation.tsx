"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/localization";

interface InsightRecommendationProps {
  action: string;
  className?: string;
}

export function InsightRecommendation({ action, className }: InsightRecommendationProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary-light">
          <Lightbulb size={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{t("insight.recommendedAction")}</h3>
            <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-400">
              {t("dashboard.badges.simulated")}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{action}</p>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./DemoBadge";
import { useTranslation } from "@/localization";

interface ImpactCardProps {
  impact: string;
  className?: string;
}

export function ImpactCard({ impact, className }: ImpactCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className={cn(
        "rounded-2xl border border-border bg-bg-surface p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          <TrendingUp size={18} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">{t("dashboard.insightDetail.expectedImpact")}</h3>
            <DemoBadge />
          </div>
          <p className="text-lg font-semibold tracking-tight text-emerald-400">
            {impact}
          </p>
          <p className="text-xs text-text-muted">
            {t("dashboard.insightDetail.basedOnDemo")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

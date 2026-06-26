"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/localization";

interface SuccessCriteriaProps {
  criteria: string[];
}

export function SuccessCriteria({ criteria }: SuccessCriteriaProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("experiment.successCriteria")}</h2>
      <div className="rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
        <div className="space-y-4">
          {criteria.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <span className="text-sm leading-relaxed text-text-secondary">{item}</span>
            </motion.div>
          ))}
        </div>
        <div className="mt-4">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
            {t("dashboard.experiment.simulationOnly")}
          </span>
        </div>
      </div>
    </motion.section>
  );
}

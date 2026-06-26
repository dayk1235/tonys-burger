"use client";

import { motion } from "framer-motion";
import { FlaskConical, Clock, Target, TrendingUp, CheckCircle2 } from "lucide-react";
import { DemoBadge } from "./DemoBadge";
import type { Experiment } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface ExperimentCardProps {
  experiment: Experiment;
}

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const { t } = useTranslation();
  const fields = [
    { icon: FlaskConical, label: t("experiment.name"), value: experiment.name },
    { icon: Target, label: t("experiment.objective"), value: experiment.objective },
    { icon: Clock, label: t("experiment.duration"), value: experiment.duration },
    { icon: TrendingUp, label: t("experiment.expectedImpact"), value: experiment.expectedImpact },
    { icon: CheckCircle2, label: t("experiment.status"), value: t("experiment.draft"), demo: true },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("experiment.suggested")}</h2>
      <div className="rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
        <div className="space-y-4">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-surface-alt text-text-muted">
                  <Icon size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-text-muted">{field.label}</p>
                    {field.demo && <DemoBadge />}
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-text-primary">{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

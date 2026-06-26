"use client";

import { motion } from "framer-motion";
import { DemoBadge } from "./DemoBadge";
import type { Experiment, ExperimentLifecycle } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface ExperimentHeaderProps {
  experiment: Experiment;
  lifecycle: ExperimentLifecycle;
}

export function ExperimentHeader({ experiment, lifecycle }: ExperimentHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-text-primary">
              {experiment.name}
            </h2>
            <DemoBadge />
          </div>
          <p className="text-sm leading-relaxed text-text-muted max-w-lg">
            {experiment.objective}
          </p>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400"
        >
          <span className="size-1.5 rounded-full bg-emerald-400" />
          {lifecycle.status}
        </motion.span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {t("dashboard.lifecycle.started")}
          </span>
          <p className="text-sm text-text-primary">{lifecycle.started}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {t("dashboard.lifecycle.expectedFinish")}
          </span>
          <p className="text-sm text-text-primary">{lifecycle.expectedFinish}</p>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
            {t("dashboard.lifecycle.owner")}
          </span>
          <p className="text-sm text-text-primary">{lifecycle.owner}</p>
        </div>
      </div>
    </div>
  );
}

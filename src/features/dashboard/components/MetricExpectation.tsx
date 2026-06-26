"use client";

import { motion } from "framer-motion";
import { DemoBadge } from "./DemoBadge";
import type { LifecycleMetric } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface MetricExpectationProps {
  metrics: LifecycleMetric[];
}

export function MetricExpectation({ metrics }: MetricExpectationProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("experiment.expectedMetrics")}
      </h3>

      <div className="grid gap-3 sm:grid-cols-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * index, duration: 0.35 }}
            className="rounded-2xl border border-border bg-bg-surface p-5"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
                {metric.label}
              </span>
              <DemoBadge />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-semibold tracking-tight text-text-primary">
                {metric.value}
              </span>
              <p className="text-xs text-text-muted/70">
                {t("experiment.target")}: {metric.target}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

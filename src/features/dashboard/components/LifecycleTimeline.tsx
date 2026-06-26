"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { LifecycleStage } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface LifecycleTimelineProps {
  stages: LifecycleStage[];
  currentStatus: string;
}

export function LifecycleTimeline({ stages, currentStatus }: LifecycleTimelineProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("dashboard.lifecycle.timelineLabel")}
      </h3>

      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

        <div className="space-y-0">
          {stages.map((stage, index) => {
            const isActive = stage.label === currentStatus;
            const isPast = stage.completed;

            return (
              <motion.div
                key={stage.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * index, duration: 0.35 }}
                className="relative flex items-start gap-4 pb-8 last:pb-0"
              >
                <div className="relative z-10 flex shrink-0 items-center justify-center">
                  {isPast ? (
                    <div className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20">
                      <Check size={14} className="text-emerald-400" />
                    </div>
                  ) : isActive ? (
                    <div className="flex size-6 items-center justify-center rounded-full border-2 border-brand-primary bg-bg-surface">
                      <div className="size-2 rounded-full bg-brand-primary" />
                    </div>
                  ) : (
                    <div className="size-6 rounded-full border border-border bg-bg-surface-alt" />
                  )}
                </div>

                <div className="flex flex-1 items-center justify-between gap-4 pt-0.5">
                  <span
                    className={`text-sm ${
                      isActive
                        ? "font-medium text-text-primary"
                        : isPast
                          ? "text-text-muted"
                          : "text-text-muted/60"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span
                    className={`text-xs ${
                      isActive ? "text-text-muted" : "text-text-muted/50"
                    }`}
                  >
                    {stage.date}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

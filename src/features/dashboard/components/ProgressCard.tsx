"use client";

import { motion } from "framer-motion";
import { DemoBadge } from "./DemoBadge";
import { useTranslation } from "@/localization";

interface ProgressCardProps {
  progress: number;
  note: string;
}

export function ProgressCard({ progress, note }: ProgressCardProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("dashboard.lifecycle.progress")}
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-border bg-bg-surface p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-4xl font-bold tracking-tight text-text-primary">
              {progress}%
            </span>
            <p className="text-sm text-text-muted">{t("dashboard.lifecycle.progress")}</p>
          </div>
          <DemoBadge />
        </div>

        <div className="mt-5">
          <div className="h-2 overflow-hidden rounded-full bg-bg-surface-alt">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-primary-hover"
            />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-text-muted/70">{note}</p>
      </motion.div>
    </div>
  );
}

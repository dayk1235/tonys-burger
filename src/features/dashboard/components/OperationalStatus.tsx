"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { IntegrationStatus } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface OperationalStatusProps {
  integrations: IntegrationStatus[];
}

const STATUS_ICONS = {
  connected: CheckCircle2,
  disconnected: AlertCircle,
  syncing: Clock,
};

const STATUS_COLORS = {
  connected: "text-emerald-400",
  disconnected: "text-red-400",
  syncing: "text-amber-400",
};

export function OperationalStatus({ integrations }: OperationalStatusProps) {
  const { t } = useTranslation();
  if (integrations.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("status.title")}
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap gap-2"
      >
        {integrations.map((integration) => {
          const Icon = STATUS_ICONS[integration.status];
          const color = STATUS_COLORS[integration.status];

          return (
            <div
              key={integration.platform}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-surface px-3 py-1.5 text-xs text-text-muted"
            >
              <Icon size={12} className={color} />
              {integration.platform}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

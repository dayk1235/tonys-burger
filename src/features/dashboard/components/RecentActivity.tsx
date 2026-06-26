"use client";

import { motion } from "framer-motion";
import type { ActivityItem } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface RecentActivityProps {
  items: ActivityItem[];
}

export function RecentActivity({ items }: RecentActivityProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("dashboard.home.recentActivity")}
      </h2>

      <div className="space-y-2">
        {items.slice(0, 5).map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.03, duration: 0.25 }}
            className="flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors hover:bg-bg-surface-alt/50"
          >
            <span className="text-sm text-text-primary">{item.label}</span>
            <span className="text-xs text-text-muted/60">{item.timestamp}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

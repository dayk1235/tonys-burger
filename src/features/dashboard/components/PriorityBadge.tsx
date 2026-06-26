"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "@/localization";

const PRIORITY_STYLES: Record<string, { className: string }> = {
  high: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  medium: {
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  low: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
};

interface PriorityBadgeProps {
  priority: "high" | "medium" | "low";
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const { t } = useTranslation();
  const style = PRIORITY_STYLES[priority];
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        style.className,
        className
      )}
      >
      <span
        className={cn(
          "size-1.5 rounded-full",
          priority === "high" && "bg-rose-400",
          priority === "medium" && "bg-amber-400",
          priority === "low" && "bg-emerald-400"
        )}
      />
      {priority === "high"
        ? t("dashboard.badges.highPriority")
        : priority === "medium"
          ? t("dashboard.badges.mediumPriority")
          : t("dashboard.badges.lowPriority")}
    </motion.span>
  );
}

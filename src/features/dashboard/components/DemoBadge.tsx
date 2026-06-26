"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/localization";

interface DemoBadgeProps {
  className?: string;
}

export function DemoBadge({ className }: DemoBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border border-amber-500/15 bg-amber-500/5 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-amber-300/75",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-amber-400/80" />
      {t("common.demo")}
    </span>
  );
}

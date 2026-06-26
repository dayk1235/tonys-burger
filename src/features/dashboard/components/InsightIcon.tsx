"use client";

import { Clock, TrendingUp, Users, MapPin, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  clock: Clock,
  "trending-up": TrendingUp,
  users: Users,
  "map-pin": MapPin,
};

const BG_MAP: Record<string, string> = {
  clock: "bg-amber-500/10 text-amber-400",
  "trending-up": "bg-indigo-500/10 text-indigo-400",
  users: "bg-violet-500/10 text-violet-400",
  "map-pin": "bg-emerald-500/10 text-emerald-400",
};

interface InsightIconProps {
  icon: string;
  className?: string;
}

export function InsightIcon({ icon, className }: InsightIconProps) {
  const Icon = ICON_MAP[icon];
  if (!Icon) return null;

  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-xl",
        BG_MAP[icon] ?? "bg-bg-surface-alt text-text-muted",
        className
      )}
    >
      <Icon size={18} />
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";
import { DemoBadge } from "./DemoBadge";

interface ComingSoonCardProps {
  title: string;
  iconId: string;
  description?: string;
}

const ICON_MAP: Record<string, keyof typeof Icons> = {
  "shopping-cart": "ShoppingCart",
  "utensils-crossed": "UtensilsCrossed",
  users: "Users",
  store: "Store",
  truck: "Truck",
  megaphone: "Megaphone",
  "bar-chart-3": "BarChart3",
  lightbulb: "Lightbulb",
  "file-text": "FileText",
  percent: "Percent",
  bot: "Bot",
  settings: "Settings",
};

export function ComingSoonCard({ title, iconId, description }: ComingSoonCardProps) {
  const iconName = ICON_MAP[iconId] ?? "LayoutDashboard";
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[iconName];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-bg-surface/50 p-8 text-center transition-all duration-300 hover:border-border-light"
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-bg-surface text-text-muted">
        {Icon && <Icon size={20} />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        {description && (
          <p className="text-xs text-text-muted">{description}</p>
        )}
      </div>
      <DemoBadge />
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Receipt,
  UserCheck,
  UserPlus,
  TrendingUp,
  ChartLine,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoBadge } from "./DemoBadge";
import { StatIndicator } from "./StatIndicator";
import type { Metric } from "@/features/engines/decision/types";

const ICON_MAP: Record<string, typeof DollarSign> = {
  "dollar-sign": DollarSign,
  "shopping-cart": ShoppingCart,
  receipt: Receipt,
  "user-check": UserCheck,
  "user-plus": UserPlus,
  "trending-up": TrendingUp,
  "chart-line": ChartLine,
  "heart-pulse": HeartPulse,
};

const COLOR_MAP: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

interface MetricCardProps {
  metric: Metric;
  index: number;
  variant?: "default" | "slim";
}

export function MetricCard({ metric, index, variant = "default" }: MetricCardProps) {
  const Icon = ICON_MAP[metric.icon] ?? DollarSign;
  const colorClass = COLOR_MAP[metric.color] ?? COLOR_MAP.emerald;

  if (variant === "slim") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-border bg-bg-surface/50 p-4"
      >
        <p className="text-xs text-text-muted/70">{metric.label}</p>
        <p className="mt-1 text-xl font-semibold tracking-tight text-text-primary">
          {metric.value}
        </p>
        <p className="mt-1 text-xs text-text-muted/50">{metric.subtitle}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative rounded-2xl border border-border bg-bg-surface p-5 transition-all duration-300 hover:border-border-light hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex items-start justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-xl border", colorClass)}>
          <Icon size={18} />
        </div>
        <DemoBadge />
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-sm text-text-muted">{metric.label}</p>
        <p className="text-2xl font-semibold tracking-tight text-text-primary">
          {metric.value}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StatIndicator change={metric.change} trend={metric.trend} />
        <span className="text-xs text-text-muted">{metric.subtitle}</span>
      </div>
    </motion.div>
  );
}

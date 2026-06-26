"use client";

import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface StatIndicatorProps {
  change: number;
  trend: "up" | "down" | "stable";
  className?: string;
}

export function StatIndicator({ change, trend, className }: StatIndicatorProps) {
  const abs = Math.abs(change);

  if (trend === "stable") {
    return (
      <span className={cn("inline-flex items-center gap-1 text-xs text-text-muted", className)}>
        <Minus size={12} />
        {abs}%
      </span>
    );
  }

  const isUp = trend === "up";
  return (
    <motion.span
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isUp ? "text-emerald-400" : "text-rose-400",
        className
      )}
    >
      {isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {abs}%
    </motion.span>
  );
}

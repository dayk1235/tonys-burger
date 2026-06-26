"use client";

import { motion } from "framer-motion";
import { PriorityBadge } from "./PriorityBadge";
import { DemoBadge } from "./DemoBadge";
import { BackNavigation } from "./BackNavigation";
import { InsightIcon } from "./InsightIcon";
import type { Recommendation } from "@/features/engines/decision/types";

interface InsightHeaderProps {
  recommendation: Recommendation;
}

export function InsightHeader({ recommendation }: InsightHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <BackNavigation />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <InsightIcon icon={recommendation.icon} />
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={recommendation.priority} />
            <DemoBadge />
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-text-primary sm:text-4xl">
          {recommendation.title}
        </h1>
      </div>
    </motion.div>
  );
}

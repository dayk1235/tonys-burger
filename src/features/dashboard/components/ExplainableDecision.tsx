"use client";

import { motion } from "framer-motion";
import { DecisionEvidence } from "./DecisionEvidence";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { DecisionTimeline } from "./DecisionTimeline";
import type { Insight } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface ExplainableDecisionProps {
  detail: Insight;
}

export function ExplainableDecision({ detail }: ExplainableDecisionProps) {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="mt-16 space-y-12"
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-light tracking-tight text-text-primary">
          {t("dashboard.insightDetail.title")}
        </h2>
        <p className="text-[15px] text-text-secondary">
          {t("dashboard.insightDetail.subtitle")}
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_300px]">
        <div className="space-y-16">
          <DecisionEvidence 
            whatHappened={detail.whatHappened}
            whyItMatters={detail.whyItMatters}
            recommendedAction={detail.recommendedAction}
          />
          <ConfidenceIndicator confidence={87} />
        </div>
        <div>
          <DecisionTimeline />
        </div>
      </div>
    </motion.section>
  );
}

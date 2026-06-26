"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/localization";

interface TradeoffCardProps {
  benefits: string[];
  risks: string[];
  confidence: "High" | "Medium" | "Low";
}

export function TradeoffCard({ benefits, risks, confidence }: TradeoffCardProps) {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-8 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 p-6 sm:p-8 space-y-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {t("dashboard.simulator.benefitsHeading")}
            </h4>
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-text-primary">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-primary" />
                  <span className="leading-relaxed">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              {t("dashboard.simulator.risksHeading")}
            </h4>
            <ul className="space-y-3">
              {risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-3 text-[15px] text-text-secondary">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500/50" />
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-brand-primary/10 grid gap-6 sm:grid-cols-[auto_1fr] items-center">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-text-primary">{confidence}</span>
            <span className="text-sm font-medium text-brand-primary">
              {t("dashboard.simulator.confidenceHeading")}
            </span>
          </div>
          <div className="text-[13px] text-text-muted sm:text-right uppercase tracking-wider font-medium">
            {t("dashboard.simulator.summary")}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

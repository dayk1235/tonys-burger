"use client";

import { motion } from "framer-motion";
import { Calendar, CheckSquare } from "lucide-react";
import { useTranslation } from "@/localization";

interface ReviewCardProps {
  date: string;
  objective: string;
  checklist: string[];
}

export function ReviewCard({ date, objective, checklist }: ReviewCardProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("dashboard.lifecycle.reviewDate")}
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-5 rounded-2xl border border-border bg-bg-surface p-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-primary/10">
            <Calendar size={18} className="text-brand-primary" />
          </div>
          <div>
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {t("dashboard.lifecycle.reviewDate")}
            </span>
            <p className="text-sm font-medium text-text-primary">{date}</p>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-text-primary">{objective}</p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <CheckSquare size={14} className="text-text-muted" />
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {t("dashboard.lifecycle.reviewChecklist")}
            </span>
          </div>
          <ul className="space-y-2">
            {checklist.map((item) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2.5 text-sm text-text-muted"
              >
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-border" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

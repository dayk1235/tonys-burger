"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { useTranslation } from "@/localization";

interface LearningGoalProps {
  goal: string;
}

export function LearningGoal({ goal }: LearningGoalProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("dashboard.lifecycle.learningGoal")}
      </h3>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/5 to-transparent p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <Lightbulb size={18} className="text-amber-400" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
              {t("dashboard.lifecycle.whatAreWeLearning")}
            </span>
            <p className="text-lg leading-relaxed tracking-tight text-text-primary">
              {goal}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

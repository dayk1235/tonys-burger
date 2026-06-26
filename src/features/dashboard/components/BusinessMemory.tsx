"use client";

import { motion } from "framer-motion";
import { MemoryEvent } from "./MemoryEvent";
import { MemoryConnection } from "./MemoryConnection";
import { MemoryInsight } from "./MemoryInsight";
import { useTranslation } from "@/localization";

export function BusinessMemory() {
  const { t } = useTranslation();
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="mt-16 space-y-12 border-t border-border/50 pt-16"
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-light tracking-tight text-text-primary">
          {t("dashboard.memory.title")}
        </h2>
        <p className="text-[15px] text-text-secondary">
          {t("dashboard.memory.subtitle")}
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_300px]">
        <div className="space-y-16">
          <MemoryConnection />
          <MemoryInsight />
        </div>
        <div>
          <MemoryEvent />
        </div>
      </div>
    </motion.section>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InsightSectionProps {
  title: string;
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function InsightSection({ title, children, index = 0, className }: InsightSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className={cn("space-y-4", className)}
    >
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      {children}
    </motion.section>
  );
}

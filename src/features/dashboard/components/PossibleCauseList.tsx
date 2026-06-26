"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PossibleCauseListProps {
  causes: string[];
  className?: string;
}

export function PossibleCauseList({ causes, className }: PossibleCauseListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {causes.map((cause, i) => (
        <motion.li
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
          className="flex items-start gap-3"
        >
          <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-bg-surface-alt text-[11px] font-medium text-text-muted">
            {i + 1}
          </span>
          <span className="text-sm leading-relaxed text-text-secondary">
            {cause}
          </span>
        </motion.li>
      ))}
    </ul>
  );
}

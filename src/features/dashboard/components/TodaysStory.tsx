"use client";

import { motion } from "framer-motion";
import type { ActivityItem } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface TodaysStoryProps {
  items: ActivityItem[];
}

const STORY_ICONS: Record<string, string> = {
  "act-1": "●",
  "act-2": "◆",
  "act-3": "◇",
  "act-4": "◈",
  "act-5": "▸",
  "act-6": "✦",
  "act-7": "◆",
  "act-8": "◇",
};

function getIcon(id: string): string {
  return STORY_ICONS[id] ?? "·";
}

export function TodaysStory({ items }: TodaysStoryProps) {
  const { t } = useTranslation();
  if (items.length === 0) return null;

  return (
    <section className="space-y-5">
      <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
        {t("story.title")}
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" aria-hidden="true" />

        <div className="space-y-0">
          {items.slice(0, 6).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3, ease: "easeOut" }}
              className="relative flex items-start gap-4 pb-5 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="relative z-10 mt-1.5 flex shrink-0 items-center justify-center">
                <div className="flex size-[14px] items-center justify-center">
                  <span className="text-[10px] text-text-muted/40">
                    {getIcon(item.id)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 items-center justify-between gap-4">
                <span className="text-sm leading-snug text-text-primary">
                  {item.label}
                </span>
                <span className="shrink-0 text-xs text-text-muted/50">
                  {item.timestamp}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

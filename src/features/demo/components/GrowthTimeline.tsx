"use client";

import { motion } from "framer-motion";

interface GrowthTimelineProps {
  onComplete: () => void;
}

const MILESTONES = [
  {
    time: "Day 1",
    label: "Today",
    desc: "Basic understanding from your input. Honest about what I do not know yet.",
    confidence: 34,
    active: true,
  },
  {
    time: "Week 1",
    label: "Patterns emerge",
    desc: "I have observed a full weekly cycle. I know your busy days and quiet days.",
    confidence: 55,
    active: false,
  },
  {
    time: "Month 1",
    label: "Deepening understanding",
    desc: "Costs, margins, traffic patterns, and team rhythms become clear.",
    confidence: 72,
    active: false,
  },
  {
    time: "Quarter 1",
    label: "Predictions begin",
    desc: "I can forecast with useful accuracy. Recommendations become specific.",
    confidence: 83,
    active: false,
  },
  {
    time: "Year 1",
    label: "Business companion",
    desc: "I know your business as well as anyone. I notice what others miss.",
    confidence: 92,
    active: false,
  },
];

export function GrowthTimeline({ onComplete }: GrowthTimelineProps) {
  return (
    <motion.div
      key="growth"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-24"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted/30"
      >
        Growth timeline
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl"
      >
        I get smarter every day.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="mb-10 text-base leading-relaxed text-text-secondary"
      >
        Not through code updates. Through observing your business. Every day adds to my understanding.
      </motion.p>

      <div className="space-y-4">
        {MILESTONES.map((m, i) => (
          <motion.div
            key={m.time}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: "easeOut" }}
            className={`relative rounded-2xl border p-5 transition-all duration-300 ${
              m.active
                ? "border-brand-primary/30 bg-brand-primary/5"
                : "border-border/30 bg-bg-surface/10"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold uppercase tracking-[0.1em] ${
                    m.active ? "text-brand-primary-light" : "text-text-muted"
                  }`}>
                    {m.time}
                  </span>
                  <span className="text-xs text-text-muted/40">·</span>
                  <span className="text-xs font-medium text-text-muted">{m.label}</span>
                </div>
                <p className={`mt-2 text-sm leading-relaxed ${
                  m.active ? "text-text-secondary" : "text-text-muted/60"
                }`}>
                  {m.desc}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className={`text-lg font-light ${
                  m.active ? "text-text-primary" : "text-text-muted/30"
                }`}>
                  {m.confidence}%
                </span>
                <p className="text-[10px] text-text-muted/30">confidence</p>
              </div>
            </div>

            {/* Connecting line */}
            {i < MILESTONES.length - 1 && (
              <div className="absolute -bottom-4 left-8 h-4 w-px bg-border/20" />
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 text-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          Finish experience
        </button>
      </motion.div>
    </motion.div>
  );
}

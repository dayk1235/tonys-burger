"use client";

import { motion } from "framer-motion";

interface BusinessUnderstandingProps {
  onComplete: () => void;
}

export function BusinessUnderstanding({ onComplete }: BusinessUnderstandingProps) {
  return (
    <motion.div
      key="understanding"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted/30"
      >
        Initial business understanding
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="flex items-baseline gap-5">
          <span className="text-7xl font-light tracking-tight text-text-primary sm:text-8xl">
            34%
          </span>
          <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-1.5 text-sm font-medium text-brand-primary-light">
            Learning
          </span>
        </div>

        <p className="text-lg leading-relaxed text-text-secondary">
          I have built a basic understanding of your business. I know your concept,
          your size, your team, your channels, and your priorities.
        </p>

        <div className="rounded-2xl border border-border bg-bg-surface/20 p-6">
          <p className="mb-3 text-sm font-semibold text-text-muted">Why not 100%?</p>
          <ul className="space-y-3 text-sm text-text-secondary/80">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>I have not observed a full day of operations yet. I need to see your actual sales, traffic, and ticket patterns — not just what you tell me, but what your business does.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>I have not connected to your sources of truth — your POS, your schedule, your inventory. Right now I rely on what you shared. Later I will verify and deepen.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>Every business has its own rhythm. I need weeks, not minutes, to learn your specific patterns.</span>
            </li>
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="mt-10 text-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          See what I learned so far
        </button>
      </motion.div>
    </motion.div>
  );
}

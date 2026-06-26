"use client";

import { motion } from "framer-motion";

interface BusinessMemoryProps {
  onComplete: () => void;
}

export function BusinessMemory({ onComplete }: BusinessMemoryProps) {
  return (
    <motion.div
      key="bmemory"
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
        Business memory
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-8"
      >
        <h2 className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl">
          Today, your business memory begins.
        </h2>

        <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
          Right now, I know very little about your business. But every day you use
          Restaurant OS, I learn more. Every transaction, every schedule change,
          every decision builds a permanent memory of how your business works.
        </p>

        <div className="rounded-2xl border border-border bg-bg-surface/20 p-6">
          <p className="mb-4 text-sm font-semibold text-text-muted">
            What memory means for you
          </p>
          <ul className="space-y-3 text-sm text-text-secondary/80">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>In one week, I will know your weekly rhythm — which days are busy, which are quiet.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>In one month, I will understand your costs, your margins, and your traffic patterns.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
              <span>In one year, I will know your business better than most spreadsheets ever could.</span>
            </li>
          </ul>
        </div>

        <p className="text-sm italic text-text-muted/50">
          The platform gets smarter. The data stays yours.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 text-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          How I learn about your business
        </button>
      </motion.div>
    </motion.div>
  );
}

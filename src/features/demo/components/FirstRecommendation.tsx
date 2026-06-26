"use client";

import { motion } from "framer-motion";

interface FirstRecommendationProps {
  onComplete: () => void;
}

export function FirstRecommendation({ onComplete }: FirstRecommendationProps) {
  return (
    <motion.div
      key="recommendation"
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
        First recommendation
      </motion.p>

      {/* Confidence indicator */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-text-muted">
          Confidence
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-light tracking-tight text-text-primary">
            72%
          </span>
          <span className="text-sm font-medium text-warning">
            Moderate
          </span>
        </div>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        className="mb-6 rounded-2xl border border-border bg-bg-surface/20 p-6 sm:p-8"
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-brand-primary-light">
          Recommendation
        </p>
        <h3 className="mb-3 text-xl font-semibold leading-snug tracking-tight text-text-primary">
          Focus on growing your afternoon off-peak traffic
        </h3>
        <p className="text-base leading-relaxed text-text-secondary">
          Fast casual restaurants like yours typically see a 30-40% drop in traffic
          between 2 PM and 5 PM. A small afternoon promotion could recover up to 15%
          of that lost revenue within the first month.
        </p>
      </motion.div>

      {/* Reasoning */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="space-y-3"
      >
        <p className="text-sm font-semibold text-text-muted">Why this recommendation</p>
        <ul className="space-y-2 text-sm text-text-secondary/80">
          <li className="flex gap-3">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
            <span><strong>Observation.</strong> Your stated priority is growing revenue — and afternoon off-peak is the most accessible growth opportunity for most restaurants.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
            <span><strong>Evidence.</strong> Based on your concept (fast casual) and your channels (in-person + delivery), afternoon promotions have produced consistent results for similar businesses.</span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-primary" />
            <span><strong>Uncertainty.</strong> I have not yet observed your actual traffic patterns. Once I connect to your POS, I can confirm whether this opportunity exists for you and by how much.</span>
          </li>
        </ul>
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
          How I grow smarter over time
        </button>
      </motion.div>
    </motion.div>
  );
}

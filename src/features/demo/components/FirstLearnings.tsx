"use client";

import { motion } from "framer-motion";

interface FirstLearningsProps {
  onComplete: () => void;
}

const CARD_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.3 + i * 0.25, ease: "easeOut" as const },
  }),
};

export function FirstLearnings({ onComplete }: FirstLearningsProps) {
  return (
    <motion.div
      key="learnings"
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
        First learnings
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10 text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl"
      >
        Here is what I understand so far
      </motion.h2>

      {/* What We Understand */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={CARD_VARIANTS}
        className="mb-4 rounded-2xl border border-success/20 bg-success/5 p-6"
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-success">
          What I understand
        </p>
        <p className="text-base leading-relaxed text-text-secondary">
          You run a fast casual restaurant with 6–15 team members. Customers order in-person and through delivery. Your priority is growing revenue. These facts give me enough to start thinking with you.
        </p>
      </motion.div>

      {/* What We Suspect */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={CARD_VARIANTS}
        className="mb-4 rounded-2xl border border-warning/20 bg-warning/5 p-6"
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-warning">
          What I suspect
        </p>
        <p className="text-base leading-relaxed text-text-secondary">
          Based on businesses like yours, you likely see the most traffic during lunch and dinner rushes, with a significant delivery channel. Your menu probably has 8–12 core items. But I need your actual data to confirm.
        </p>
      </motion.div>

      {/* What We Need to Learn */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={CARD_VARIANTS}
        className="mb-8 rounded-2xl border border-border bg-bg-surface/20 p-6"
      >
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
          What I still need to learn
        </p>
        <p className="text-base leading-relaxed text-text-secondary">
          Your actual sales data. Your costs. Your team schedules. Your customer patterns. Your inventory flow. Your seasonal rhythms. Your competition. In short — the things that make your business unique.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          How Restaurant OS remembers
        </button>
      </motion.div>
    </motion.div>
  );
}

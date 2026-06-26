"use client";

import { motion } from "framer-motion";

interface SourcesOfTruthProps {
  onComplete: () => void;
}

const SOURCES = [
  { name: "Point of Sale", desc: "Teaches me about your sales, traffic, and menu performance.", connected: false },
  { name: "Team Schedule", desc: "Teaches me who works when, and how staffing affects your business.", connected: false },
  { name: "Inventory System", desc: "Teaches me about your costs, waste, and supply chain.", connected: false },
  { name: "Bank Account", desc: "Teaches me about your cash flow, fees, and financial health.", connected: false },
  { name: "Your Knowledge", desc: "What you tell me directly — your goals, your observations, your decisions.", connected: true },
];

export function SourcesOfTruth({ onComplete }: SourcesOfTruthProps) {
  return (
    <motion.div
      key="sources"
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
        Sources of truth
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-4 text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl"
      >
        Every source teaches me something.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="mb-10 text-base leading-relaxed text-text-secondary"
      >
        I do not just connect to software. I learn from every source of truth you give me. Each one teaches me a different part of your business.
      </motion.p>

      <div className="space-y-3">
        {SOURCES.map((source, i) => (
          <motion.div
            key={source.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.12, ease: "easeOut" }}
            className="flex items-start gap-4 rounded-2xl border border-border/40 bg-bg-surface/20 p-5"
          >
            <div
              className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                source.connected
                  ? "border border-success/40 bg-success/10 text-success"
                  : "border border-border text-text-muted/30"
              }`}
            >
              {source.connected ? (
                <span className="text-xs">✓</span>
              ) : (
                <span className="text-xs">○</span>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                {source.name}
                {source.connected && (
                  <span className="ml-2 text-[10px] font-normal text-success">Connected</span>
                )}
              </p>
              <p className="mt-1 text-sm text-text-secondary/70">{source.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-center text-sm text-text-muted/50"
      >
        Connect your sources and I will learn faster.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 text-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          Show me what this means
        </button>
      </motion.div>
    </motion.div>
  );
}

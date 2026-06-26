"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ClosingMomentProps {
  onRestart: () => void;
}

export function ClosingMoment({ onRestart }: ClosingMomentProps) {
  const router = useRouter();

  return (
    <motion.div
      key="closing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-xs font-medium uppercase tracking-[0.2em] text-text-muted"
      >
        Experience complete
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl lg:text-4xl"
      >
        This is only day one.
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="mt-6 text-base leading-relaxed text-text-secondary"
      >
        Imagine what Restaurant OS will understand about your business
        after a week. A month. A year.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="mt-4 text-base leading-relaxed text-text-secondary"
      >
        The best time to start building your business memory is today.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="mt-12"
      >
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover"
        >
          See the dashboard
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-6"
      >
        <button
          onClick={onRestart}
          className="text-xs text-text-muted/50 underline underline-offset-2 transition-colors hover:text-text-muted"
        >
          Restart experience
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="fixed bottom-8 text-[10px] text-text-muted/20"
      >
        Restaurant OS understood your business.
      </motion.p>
    </motion.div>
  );
}

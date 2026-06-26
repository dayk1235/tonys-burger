"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface DemoWelcomeProps {
  onBegin: () => void;
}

export function DemoWelcome({ onBegin }: DemoWelcomeProps) {
  const router = useRouter();

  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-12 text-xs font-medium uppercase tracking-[0.2em] text-text-muted"
      >
        Restaurant OS
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        className="text-3xl font-semibold leading-tight tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
      >
        A business companion that learns.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
        className="mt-6 text-base leading-relaxed text-text-secondary"
      >
        Not a dashboard. Not another tool.
        <br />
        A thinking partner for your restaurant.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        className="mt-3 text-sm text-text-muted"
      >
        Estimated duration · 4–5 minutes
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
        className="mt-12"
      >
        <button
          onClick={onBegin}
          className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-8 text-sm font-semibold text-white transition-all duration-200 hover:bg-brand-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
        >
          Begin Experience
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="mt-6"
      >
        <button
          onClick={() => router.push("/")}
          className="text-xs text-text-muted/50 underline underline-offset-2 transition-colors hover:text-text-muted"
        >
          Exit Demo
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="fixed bottom-8 text-[10px] text-text-muted/20"
      >
        Use Space or &rarr; to advance &middot; Esc to exit
      </motion.p>
    </motion.div>
  );
}

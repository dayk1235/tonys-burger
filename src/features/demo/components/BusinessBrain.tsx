"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimate } from "framer-motion";

interface BusinessBrainProps {
  onComplete: () => void;
}

const THOUGHTS = [
  { text: "Connecting the dots...", delay: 0 },
  { text: "Mapping your menu structure", delay: 1800 },
  { text: "Identifying your busiest hours", delay: 3600 },
  { text: "Learning your pricing patterns", delay: 5400 },
  { text: "Building your business model", delay: 7200 },
];

export function BusinessBrain({ onComplete }: BusinessBrainProps) {
  const [scope, animate] = useAnimate();
  const currentThought = useRef(0);

  useEffect(() => {
    const runSequence = async () => {
      for (let i = 0; i < THOUGHTS.length; i++) {
        currentThought.current = i;
        const thought = THOUGHTS[i];
        if (i > 0) {
          await animate(`[data-thought="${i - 1}"]`, { opacity: 0 }, { duration: 0.3 });
        }
        await animate(`[data-thought="${i}"]`, { opacity: 1 }, { duration: 0.5, delay: thought.delay / 1000 - (i > 0 ? 0.3 : 0) });
      }
      await animate(`[data-thought="${THOUGHTS.length - 1}"]`, { opacity: 0 }, { duration: 0.3 });
      await new Promise((r) => setTimeout(r, 400));
      onComplete();
    };

    runSequence();
  }, [animate, onComplete]);

  return (
    <motion.div
      key="brain"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted/30"
      >
        Building your business brain
      </motion.p>

      <div ref={scope} className="relative flex items-center justify-center">
        {/* Pulsing circle */}
        <div className="absolute">
          <div className="h-24 w-24 animate-pulse rounded-full bg-brand-primary/10 sm:h-32 sm:w-32" />
          <div className="absolute inset-0 h-24 w-24 animate-ping rounded-full bg-brand-primary/5 sm:h-32 sm:w-32" style={{ animationDuration: "3s" }} />
        </div>

        {/* Thought stream */}
        <div className="ml-0 sm:ml-48">
          {THOUGHTS.map((thought, i) => (
            <p
              key={thought.text}
              data-thought={i}
              className="text-base leading-relaxed text-text-secondary sm:text-lg"
              style={{ opacity: 0 }}
            >
              {thought.text}
            </p>
          ))}
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 text-center text-[10px] text-text-muted/20"
      >
        Processing what you shared...
      </motion.p>
    </motion.div>
  );
}

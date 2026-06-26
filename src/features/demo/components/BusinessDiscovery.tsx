"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BusinessDiscoveryProps {
  onComplete: () => void;
}

const QUESTIONS = [
  {
    id: "concept",
    question: "What kind of restaurant do you run?",
    options: ["Fast casual", "Fine dining", "Cafe", "Bar", "Bakery", "Food truck"],
  },
  {
    id: "size",
    question: "How many locations do you operate?",
    options: ["One", "2–3", "4–10", "11+"],
  },
  {
    id: "staff",
    question: "How many people on your team?",
    options: ["1–5", "6–15", "16–30", "31+"],
  },
  {
    id: "channels",
    question: "How do your customers order?",
    options: ["In-person only", "In-person + delivery", "All channels", "Takeout focused"],
  },
  {
    id: "goal",
    question: "What matters most to you right now?",
    options: ["Growing revenue", "Controlling costs", "Building the team", "Saving time"],
  },
];

const ANSWERS = ["Fast casual", "One", "6–15", "In-person + delivery", "Growing revenue"];

export function BusinessDiscovery({ onComplete }: BusinessDiscoveryProps) {
  const [step, setStep] = useState(0);
  const current = QUESTIONS[step];

  const handleSelect = () => {
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      key="discovery"
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
        Tell me about your business
      </motion.p>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-8"
        >
          <h2 className="text-2xl font-semibold leading-tight tracking-tight text-text-primary sm:text-3xl">
            {current.question}
          </h2>

          <div className="space-y-3">
            {current.options.map((option, i) => (
              <button
                key={option}
                onClick={handleSelect}
                className="group flex w-full items-center rounded-xl border border-border/40 bg-bg-surface/20 px-6 py-4 text-left text-base text-text-secondary transition-all duration-200 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-text-primary"
              >
                <span className="mr-4 flex h-6 w-6 items-center justify-center rounded-full border border-border/40 text-xs text-text-muted/40 transition-colors group-hover:border-brand-primary/30 group-hover:text-brand-primary">
                  {ANSWERS[step] === option ? "✓" : i + 1}
                </span>
                {option}
              </button>
            ))}
          </div>

          <p className="text-xs text-text-muted/20">
            Question {step + 1} of {QUESTIONS.length}
          </p>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

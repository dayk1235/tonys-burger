/**
 * Demo — The First Five Minutes
 *
 * A story-driven narrative experience that introduces Restaurant OS
 * as a business companion that learns — not as a dashboard.
 *
 * 10 sequential moments:
 *   Welcome → Business Discovery → Business Brain → Initial Understanding →
 *   First Learnings → Business Memory → Sources of Truth →
 *   First Recommendation → Growth Timeline → Closing Moment
 *
 * Keyboard:
 *   Space or → advances (when appropriate)
 *   Esc exits to home
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  DemoWelcome,
  BusinessDiscovery,
  BusinessBrain,
  BusinessUnderstanding,
  FirstLearnings,
  BusinessMemory,
  SourcesOfTruth,
  FirstRecommendation,
  GrowthTimeline,
  ClosingMoment,
  ExperienceProgress,
} from "@/features/demo/components";

const TOTAL_MOMENTS = 10;

export default function DemoPage() {
  const router = useRouter();
  const [moment, setMoment] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const advance = useCallback(() => {
    if (moment < TOTAL_MOMENTS - 1) {
      setMoment((s) => s + 1);
      if (!hasStarted) setHasStarted(true);
    }
  }, [moment, hasStarted]);

  const exit = useCallback(() => {
    router.push("/");
  }, [router]);

  const restart = useCallback(() => {
    setMoment(0);
    setHasStarted(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        exit();
        return;
      }
      if (event.key === " " || event.key === "ArrowRight") {
        event.preventDefault();
        if (moment !== 1) advance();
        return;
      }
      if (event.key === "ArrowLeft") {
        setMoment((s) => Math.max(0, s - 1));
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [advance, exit, moment]);

  return (
    <div className="relative min-h-screen bg-bg">
      <AnimatePresence>
        {hasStarted && (
          <ExperienceProgress
            current={Math.min(moment + 1, TOTAL_MOMENTS)}
            total={TOTAL_MOMENTS}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {moment === 0 && (
          <DemoWelcome
            key="welcome"
            onBegin={() => {
              setHasStarted(true);
              setMoment(1);
            }}
          />
        )}

        {moment === 1 && (
          <BusinessDiscovery
            key="discovery"
            onComplete={advance}
          />
        )}

        {moment === 2 && (
          <BusinessBrain
            key="brain"
            onComplete={advance}
          />
        )}

        {moment === 3 && (
          <BusinessUnderstanding
            key="understanding"
            onComplete={advance}
          />
        )}

        {moment === 4 && (
          <FirstLearnings
            key="learnings"
            onComplete={advance}
          />
        )}

        {moment === 5 && (
          <BusinessMemory
            key="bmemory"
            onComplete={advance}
          />
        )}

        {moment === 6 && (
          <SourcesOfTruth
            key="sources"
            onComplete={advance}
          />
        )}

        {moment === 7 && (
          <FirstRecommendation
            key="recommendation"
            onComplete={advance}
          />
        )}

        {moment === 8 && (
          <GrowthTimeline
            key="growth"
            onComplete={advance}
          />
        )}

        {moment === 9 && (
          <ClosingMoment
            key="closing"
            onRestart={restart}
          />
        )}
      </AnimatePresence>

      {/* Bottom gradient fade for visual depth */}
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}

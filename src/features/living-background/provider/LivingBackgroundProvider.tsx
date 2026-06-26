/**
 * Living Background — Provider
 *
 * Context provider that determines the current scene based on time of day,
 * integrates with the ExperienceProvider (Morning = warmer, Focus = cleaner),
 * and exposes atmosphere values to the LivingBackground component.
 *
 * SSR-safe: defaults to morning scene on the server.
 *
 * Integration with ExperienceProvider:
 *   Morning mode → warmer atmosphere (adds warmth)
 *   Focus mode   → cleaner atmosphere (reduces contrast, removes warmth)
 *
 * No duplicated logic — the ExperienceProvider handles experience,
 * this provider handles scene/time-of-day atmosphere.
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
import type {
  LivingBackgroundContextValue,
  MotionLevel,
  SceneId,
} from "../types";
import { SCENES, DEFAULT_SCENE_RANGES, resolveScene } from "../scenes";

const DEFAULT_CONTEXT: LivingBackgroundContextValue = {
  sceneId: "morning",
  scene: SCENES.morning,
  motionLevel: "soft",
  parallaxEnabled: false,
  setSceneOverride: () => {},
};

const LivingBackgroundContext = createContext<LivingBackgroundContextValue>(DEFAULT_CONTEXT);

interface LivingBackgroundProviderProps {
  children: ReactNode;
}

export function LivingBackgroundProvider({ children }: LivingBackgroundProviderProps) {
  const [sceneId, setSceneId] = useState<SceneId>("morning");
  const [sceneOverride, setSceneOverride] = useState<SceneId | null>(null);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const resolved = resolveScene(DEFAULT_SCENE_RANGES);
    setSceneId(resolved);
    setMounted(true);
  }, []);

  // Re-check scene every minute (aligns with ExperienceProvider auto-refresh)
  useEffect(() => {
    if (!mounted) return;

    const interval = setInterval(() => {
      if (!sceneOverride) {
        const resolved = resolveScene(DEFAULT_SCENE_RANGES);
        setSceneId(resolved);
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [mounted, sceneOverride]);

  const handleSetSceneOverride = useCallback((scene: SceneId | null) => {
    setSceneOverride(scene);
    if (scene) {
      setSceneId(scene);
    } else {
      const resolved = resolveScene(DEFAULT_SCENE_RANGES);
      setSceneId(resolved);
    }
  }, []);

  const activeSceneId = sceneOverride ?? sceneId;
  const activeScene = SCENES[activeSceneId];
  const motionLevel: MotionLevel = activeScene?.atmosphere?.motion ?? "soft";

  const value = useMemo<LivingBackgroundContextValue>(
    () => ({
      sceneId: activeSceneId,
      scene: activeScene,
      motionLevel,
      parallaxEnabled: false,
      setSceneOverride: handleSetSceneOverride,
    }),
    [activeSceneId, activeScene, motionLevel, handleSetSceneOverride],
  );

  return (
    <LivingBackgroundContext.Provider value={value}>
      {children}
    </LivingBackgroundContext.Provider>
  );
}

export function useLivingBackgroundContext(): LivingBackgroundContextValue {
  return useContext(LivingBackgroundContext);
}

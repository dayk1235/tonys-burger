/**
 * Living Background — Main Component
 *
 * Renders the complete layered background for Restaurant OS.
 * Pure CSS — gradients, radial lights, noise overlays.
 * No images, no videos, no canvas, no Three.js.
 * 
 * V2: GSAP ScrollTrigger Integration
 * Transforms the static background into an atmospheric system that
 * reacts subtly to scroll position with parallax and living light drift.
 */

"use client";

import { useMemo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLivingBackground } from "../hooks/useLivingBackground";
import { useExperience } from "@/experience";
import { BackgroundLayer } from "./BackgroundLayer";

gsap.registerPlugin(ScrollTrigger);

/**
 * Translate semantic atmosphere values to CSS backgrounds.
 */

function getBaseGradient(atmosphere: {
  warmth: number;
  brightness: number;
  depth: number;
  contrast: number;
}): string {
  const isCool = atmosphere.warmth < 0.6;
  const isWarm = atmosphere.warmth > 1.4;

  const centerBrightness = Math.max(0, Math.min(0.15, atmosphere.brightness * 0.06));
  const edgeBrightness = Math.max(0, Math.min(0.04, centerBrightness * 0.3));

  let centerColor = `${centerBrightness + 0.04} ${centerBrightness + 0.02} ${centerBrightness + 0.06}`;
  let edgeColor = `${edgeBrightness} ${edgeBrightness} ${edgeBrightness + 0.01}`;

  if (isWarm) {
    centerColor = `${centerBrightness + 0.08} ${centerBrightness + 0.04} ${centerBrightness + 0.02}`;
    edgeColor = `${edgeBrightness + 0.02} ${edgeBrightness + 0.01} ${edgeBrightness}`;
  } else if (isCool) {
    centerColor = `${centerBrightness + 0.02} ${centerBrightness + 0.03} ${centerBrightness + 0.08}`;
    edgeColor = `${edgeBrightness} ${edgeBrightness} ${edgeBrightness + 0.02}`;
  }

  return `radial-gradient(ellipse 80% 60% at 50% 40%, rgb(${centerColor}) 0%, rgb(${edgeColor}) 100%)`;
}

function getSceneLight(atmosphere: {
  warmth: number;
  brightness: number;
}): string | null {
  if (atmosphere.warmth < 0.3 && atmosphere.brightness < 0.2) return null;

  const isWarm = atmosphere.warmth > 1.2;
  const intensity = Math.max(0.03, atmosphere.brightness * 0.04);

  if (isWarm) {
    return `radial-gradient(ellipse 40% 30% at 50% 50%, rgba(180, 120, 60, ${intensity}) 0%, transparent 80%)`;
  }

  return `radial-gradient(ellipse 40% 30% at 50% 50%, rgba(100, 120, 180, ${intensity * 0.6}) 0%, transparent 80%)`;
}

function getNoiseOverlay(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#n)" opacity="0.04"/>
  </svg>`;
  const encoded = encodeURIComponent(svg);
  return `url("data:image/svg+xml,${encoded}")`;
}

function getAtmosphereWash(atmosphere: {
  warmth: number;
  brightness: number;
  depth: number;
}): string | null {
  const intensity = Math.max(0.01, atmosphere.depth * 0.03);
  const isWarm = atmosphere.warmth > 1.4;
  const isDark = atmosphere.brightness < 0.3;

  if (isDark) {
    return `linear-gradient(180deg, rgba(10, 5, 15, ${intensity}) 0%, transparent 50%, rgba(0, 0, 0, ${intensity * 1.5}) 100%)`;
  }

  if (isWarm) {
    return `linear-gradient(180deg, rgba(180, 120, 50, ${intensity * 0.5}) 0%, transparent 40%, rgba(0, 0, 0, ${intensity}) 100%)`;
  }

  return null;
}

export function LivingBackground() {
  const { scene } = useLivingBackground();
  const { resolvedExperience } = useExperience();
  const { atmosphere } = scene;

  // Layer Refs for GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const depthRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const noiseRef = useRef<HTMLDivElement>(null);

  // Adjust atmosphere based on experience mode
  const adjustedAtmosphere = useMemo(() => {
    const adjusted = { ...atmosphere };

    if (resolvedExperience === "focus") {
      adjusted.warmth = Math.max(0, adjusted.warmth - 0.3);
      adjusted.contrast = Math.max(0, adjusted.contrast - 0.2);
      adjusted.depth = Math.max(0, adjusted.depth - 0.2);
    }

    return adjusted;
  }, [atmosphere, resolvedExperience]);

  const baseGradient = useMemo(() => getBaseGradient(adjustedAtmosphere), [adjustedAtmosphere]);
  const sceneLight = useMemo(() => getSceneLight(adjustedAtmosphere), [adjustedAtmosphere]);
  const noiseOverlay = useMemo(() => getNoiseOverlay(), []);
  const atmosphereWash = useMemo(() => getAtmosphereWash(adjustedAtmosphere), [adjustedAtmosphere]);

  const depthOpacity = useMemo(
    () => Math.max(0.3, Math.min(0.8, adjustedAtmosphere.depth * 0.3)),
    [adjustedAtmosphere]
  );

  // GSAP Animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Living Light Drift (Layer 2)
      if (lightRef.current) {
        gsap.to(lightRef.current, {
          x: "10vw",
          y: "5vh",
          duration: 40,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }

      // 2. Parallax on Scroll (Layer 1, Layer 5)
      // Moving background slightly as user scrolls down the page
      ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        animation: gsap.timeline()
          .to(baseRef.current, { y: -20, scale: 1.02, ease: "none" }, 0)
          .to(noiseRef.current, { y: -40, ease: "none" }, 0)
      });

      // 3. Section Spotlights (Layer 3 & 4 shifts)
      // Find all sections marked with data-atmosphere-section
      const sections = document.querySelectorAll("[data-atmosphere-section]");
      
      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            gsap.to(depthRef.current, { opacity: 1.2, duration: 1, ease: "power2.out" });
            gsap.to(washRef.current, { opacity: 0.8, filter: "blur(20px)", duration: 1.5, ease: "power2.out" });
          },
          onLeave: () => {
            gsap.to(depthRef.current, { opacity: 1, duration: 1, ease: "power2.out" });
            gsap.to(washRef.current, { opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" });
          },
          onEnterBack: () => {
            gsap.to(depthRef.current, { opacity: 1.2, duration: 1, ease: "power2.out" });
            gsap.to(washRef.current, { opacity: 0.8, filter: "blur(20px)", duration: 1.5, ease: "power2.out" });
          },
          onLeaveBack: () => {
            gsap.to(depthRef.current, { opacity: 1, duration: 1, ease: "power2.out" });
            gsap.to(washRef.current, { opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power2.out" });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [sceneLight, atmosphereWash]); // Re-run if light/wash exist

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none -z-50">
      {/* Layer 1: Base gradient */}
      <BackgroundLayer
        ref={baseRef}
        background={baseGradient}
        zIndex={-10}
        transitionDuration={1200}
        className="scale-105" // Pre-scale slightly to allow safe parallax panning
      />

      {/* Layer 2: Scene light */}
      {sceneLight && (
        <BackgroundLayer
          ref={lightRef}
          background={sceneLight}
          zIndex={-9}
          transitionDuration={1200}
          className="scale-110" // Pre-scale to allow drift
        />
      )}

      {/* Layer 3: Depth atmosphere (translates depth value) */}
      <BackgroundLayer
        ref={depthRef}
        background={`linear-gradient(180deg, transparent 0%, rgba(0,0,0,${depthOpacity}) 100%)`}
        zIndex={-8}
        transitionDuration={1200}
      />

      {/* Layer 4: Atmosphere wash */}
      {atmosphereWash && (
        <BackgroundLayer
          ref={washRef}
          background={atmosphereWash}
          zIndex={-7}
          blendMode="overlay"
          transitionDuration={1200}
        />
      )}

      {/* Layer 5: Subtle noise */}
      <BackgroundLayer
        ref={noiseRef}
        background={noiseOverlay}
        zIndex={-6}
        opacity={0.3}
        transitionDuration={2000}
        className="scale-105" // Pre-scale to allow safe parallax panning
      />
    </div>
  );
}

/**
 * Living Background — Background Layer
 *
 * Renders a single atmospheric layer: radial gradient, subtle light,
 * noise overlay, or atmospheric color wash.
 *
 * Each layer is pure CSS. No images, no video, no canvas.
 * Layers combine to create the full atmosphere.
 */

"use client";

import { CSSProperties, forwardRef } from "react";

interface BackgroundLayerProps {
  /** CSS background value */
  background: string;
  /** Opacity of this layer (0–1) */
  opacity?: number;
  /** Z-index for layer ordering */
  zIndex?: number;
  /** Blend mode */
  blendMode?: CSSProperties["mixBlendMode"];
  /** Transition duration in ms */
  transitionDuration?: number;
  /** Additional class names */
  className?: string;
}

export const BackgroundLayer = forwardRef<HTMLDivElement, BackgroundLayerProps>(
  (
    {
      background,
      opacity = 1,
      zIndex = 0,
      blendMode = "normal",
      transitionDuration = 800,
      className = "",
    },
    ref
  ) => {
  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed inset-0 ${className}`}
      style={{
        background,
        opacity,
        zIndex,
        mixBlendMode: blendMode,
        transition: `opacity ${transitionDuration}ms ease, background ${transitionDuration}ms ease`,
        willChange: "transform, opacity, background, filter",
      }}
      aria-hidden="true"
    />
  );
});

BackgroundLayer.displayName = "BackgroundLayer";

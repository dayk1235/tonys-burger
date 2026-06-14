"use client";

import Image from "next/image";

interface BurgerLayersVisualProps {
  activeStage: number;
  totalStages: number;
}

export function BurgerLayersVisual({
  activeStage,
  totalStages,
}: BurgerLayersVisualProps) {
  const visibleFraction =
    activeStage < 0
      ? 0
      : 0.35 + (activeStage / (totalStages - 1)) * 0.65;
  const clipInset = `${(1 - visibleFraction) * 100}%`;

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      {/* Plate silhouette */}
      <div
        className="absolute bottom-[6%] left-[10%] right-[10%] h-[10%] rounded-[50%]"
        style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        aria-hidden="true"
      />

      {/* Burger image with progressive reveal */}
      <div
        className="absolute inset-0 transition-[clip-path] duration-700 ease-out"
        style={{ clipPath: `inset(${clipInset} 0% 0% 0%)` }}
      >
        <Image
          src="/assets/demo/hero/hero-burger.webp"
          alt="Burger being assembled layer by layer"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Warm glow overlay - grows with progress */}
      {activeStage >= 0 && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            opacity: 0.12 * visibleFraction,
            background:
              "radial-gradient(circle at 50% 60%, #F4B400 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Stage counter */}
      <div className="absolute top-4 left-4">
        {activeStage >= 0 ? (
          <span className="text-brand-secondary font-mono text-sm tracking-wider">
            {String(activeStage + 1).padStart(2, "0")}/
            {String(totalStages).padStart(2, "0")}
          </span>
        ) : (
          <span className="text-text-muted font-mono text-sm tracking-wider">
            00/{String(totalStages).padStart(2, "0")}
          </span>
        )}
      </div>
    </div>
  );
}

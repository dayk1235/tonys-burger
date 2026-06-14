"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useCardHover<T extends HTMLElement>() {
  const cardRef = useRef<T>(null!);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const image = card.querySelector("[data-card-image]") as HTMLElement | null;
    const overlay = card.querySelector("[data-card-overlay]") as HTMLElement | null;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -4,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 12px 24px rgba(0,0,0,0.3)",
      });
      if (image) {
        gsap.to(image, { scale: 1.05, duration: 0.4, ease: "power2.out" });
      }
      if (overlay) {
        gsap.to(overlay, { opacity: 1, duration: 0.3, ease: "power2.out" });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      });
      if (image) {
        gsap.to(image, { scale: 1, duration: 0.4, ease: "power2.out" });
      }
      if (overlay) {
        gsap.to(overlay, { opacity: 0, duration: 0.3, ease: "power2.out" });
      }
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf(card);
      if (image) gsap.killTweensOf(image);
      if (overlay) gsap.killTweensOf(overlay);
    };
  }, []);

  return cardRef;
}

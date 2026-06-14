"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface NavbarState {
  isScrolled: boolean;
  headerRef: React.RefObject<HTMLElement | null>;
}

export function useNavbarScroll(): NavbarState {
  const headerRef = useRef<HTMLElement>(null!);
  const [isScrolled, setIsScrolled] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const el = headerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (!prefersReduced) {
      const navEl = el.querySelector("nav") as HTMLElement | null;
      if (navEl) {
        gsap.fromTo(
          navEl,
          { paddingTop: 16, paddingBottom: 16 },
          {
            paddingTop: 12,
            paddingBottom: 12,
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top -50px",
              end: "top -100px",
              scrub: 0.3,
            },
          }
        );
      }
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return { isScrolled, headerRef };
}

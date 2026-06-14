"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PLACEHOLDER } from "@/content/placeholders";
import { BUSINESS_CONFIG } from "@/config/business";
import { SectionContainer } from "@/components/ui/section-container";
import { CTACard } from "@/components/ui/cta-card";
import { MessageCircle } from "lucide-react";
import { useSectionView, useClickTracking } from "@/features/analytics";

export function CTASection() {
  const revealRef = useRef<HTMLDivElement>(null!);
  const sectionRef = useSectionView<HTMLDivElement>("cta");
  const trackClick = useClickTracking();
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.whatsapp.number}?text=${encodeURIComponent(BUSINESS_CONFIG.whatsapp.message)}`;

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <SectionContainer id="cta" background="brand" className="py-20 md:py-28">
      <div ref={sectionRef}>
        <div ref={revealRef}>
          <CTACard
            title={PLACEHOLDER.CTA_TITLE}
            description={PLACEHOLDER.CTA_DESCRIPTION}
            buttonLabel={PLACEHOLDER.CTA_BUTTON}
            icon={MessageCircle}
            variant="brand"
            buttonVariant="cta"
            onButtonClick={() => {
              trackClick({ type: "whatsapp", source: "cta-section" });
              window.open(whatsappUrl, "_blank", "noopener,noreferrer");
            }}
          />
        </div>
      </div>
    </SectionContainer>
  );
}

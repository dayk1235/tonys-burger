"use client";

import Image from "next/image";
import { PLACEHOLDER } from "@/content/placeholders";
import { useHeroReveal } from "@/animations";
import { useClickTracking, useSectionView } from "@/features/analytics";

const TRUST_INDICATORS = [
  { label: "Ingredientes frescos" },
  { label: "Carne angus 100%" },
  { label: "Negocio familiar" },
];

export function HeroSection() {
  const containerRef = useHeroReveal();
  const sectionRef = useSectionView<HTMLDivElement>("hero");
  const trackClick = useClickTracking();

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate overflow-hidden bg-bg pt-24"
      aria-label="Hero section"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_40%,rgba(212,134,42,0.12),transparent),linear-gradient(180deg,#0a0a0a_0%,#111111_60%,#090909_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/assets/demo/textures/charcoal-texture.webp')",
          backgroundRepeat: "repeat",
          backgroundSize: "256px",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-bg/80 to-transparent"
        aria-hidden="true"
      />

      <div
        data-hero-image
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_50%,rgba(244,180,0,0.2),transparent_28%),radial-gradient(circle_at_82%_72%,rgba(198,40,40,0.18),transparent_24%),linear-gradient(90deg,rgba(11,11,11,0.96)_0%,rgba(11,11,11,0.8)_28%,rgba(11,11,11,0.2)_58%,rgba(11,11,11,0.08)_100%)]" />
        <Image
          src={PLACEHOLDER.HERO_IMAGE_SRC}
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 object-contain object-right-bottom md:object-cover md:object-[82%_center] lg:object-[76%_center] xl:object-[73%_center]"
        />
        <div
          className="hero-flame absolute inset-x-[52%] bottom-[9%] z-10 h-[26%] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(244,180,0,0.52),rgba(198,40,40,0.18)_46%,transparent_78%)] blur-3xl md:inset-x-[58%] md:bottom-[8%] md:h-[30%]"
          aria-hidden="true"
        />
        <div
          className="hero-smoke-a absolute left-[40%] top-[16%] z-10 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.14),transparent_68%)] blur-3xl md:left-[52%] md:top-[14%] md:h-56 md:w-56"
          aria-hidden="true"
        />
        <div
          className="hero-smoke-b absolute left-[62%] top-[9%] z-10 h-52 w-52 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12),transparent_66%)] blur-3xl md:h-72 md:w-72"
          aria-hidden="true"
        />
        <div
          className="hero-smoke-c absolute right-[12%] top-[22%] z-10 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,198,87,0.16),transparent_66%)] blur-3xl md:h-64 md:w-64"
          aria-hidden="true"
        />
        <div
          className="hero-ember-a absolute bottom-[24%] left-[58%] z-10 size-1.5 rounded-full bg-brand-secondary shadow-[0_0_12px_rgba(244,180,0,0.95)] md:size-2"
          aria-hidden="true"
        />
        <div
          className="hero-ember-b absolute bottom-[30%] left-[71%] z-10 size-1.5 rounded-full bg-[#ffb84d] shadow-[0_0_12px_rgba(255,184,77,0.95)] md:size-2"
          aria-hidden="true"
        />
        <div
          className="hero-ember-c absolute bottom-[18%] left-[79%] z-10 size-1 rounded-full bg-[#ff6a3d] shadow-[0_0_10px_rgba(255,106,61,0.95)] md:size-1.5"
          aria-hidden="true"
        />
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto flex min-h-[calc(100svh-6rem)] max-w-container-max items-center px-4 py-12 md:px-6 lg:px-8 lg:py-16"
      >
        <div className="relative z-20 max-w-xl lg:max-w-[58%]">
          <p
            data-hero-badge
            className="mb-4 text-xs font-semibold uppercase tracking-[0.42em] text-brand-secondary/90"
          >
            Anuncio premium
          </p>
          <h1
            data-hero-headline
            className="max-w-[11ch] whitespace-pre-line font-heading text-[clamp(3.4rem,8vw,6.9rem)] leading-[0.9] tracking-[0.005em] text-text-primary drop-shadow-[0_14px_28px_rgba(0,0,0,0.45)] md:max-w-[12ch] md:text-[clamp(4rem,7.2vw,7.3rem)] lg:max-w-[11ch] xl:text-[clamp(4.6rem,6.4vw,7.8rem)]"
          >
            {PLACEHOLDER.HERO_TITLE}
          </h1>
          <p
            data-hero-subheadline
            className="mt-5 max-w-[36ch] font-sans text-[0.98rem] font-medium leading-[1.7] text-text-secondary/95 md:mt-6 md:max-w-[40ch] md:text-[1.05rem] lg:text-[1.1rem]"
          >
            {PLACEHOLDER.HERO_SUBTITLE}
          </p>

          <div
            data-hero-cta
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row"
          >
            <a
              href="#cta"
              onClick={() => trackClick({ type: "whatsapp", source: "hero" })}
              className="inline-flex h-14 items-center justify-center rounded-xl bg-brand-secondary px-10 font-sans text-base font-semibold text-bg shadow-glow-secondary transition-all duration-normal hover:bg-brand-secondary-hover hover:shadow-lg hover:shadow-brand-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:scale-[0.98]"
            >
              {PLACEHOLDER.HERO_CTA_PRIMARY}
            </a>
            <a
              href="#menu-preview"
              onClick={() => trackClick({ type: "menu", source: "hero" })}
              className="inline-flex h-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-10 font-sans text-base font-semibold text-text-primary transition-all duration-normal hover:border-brand-secondary/40 hover:bg-brand-secondary/10 hover:text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:scale-[0.98]"
            >
              {PLACEHOLDER.HERO_CTA_SECONDARY}
            </a>
          </div>

          <div
            data-hero-trust
            className="mt-12 flex flex-wrap gap-3"
            role="list"
            aria-label="Trust indicators"
          >
            {TRUST_INDICATORS.map((indicator) => (
              <div
                key={indicator.label}
                className="inline-flex items-center gap-3 border border-brand-secondary/20 px-4 py-2"
                role="listitem"
              >
                <span
                  className="size-2 rounded-full bg-brand-secondary shadow-[0_0_10px_rgba(212,134,42,0.55)]"
                  aria-hidden="true"
                />
                <span className="font-sans text-sm font-medium text-text-secondary">
                  {indicator.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { PLACEHOLDER } from "@/content/placeholders";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { InfoCard } from "@/components/ui/info-card";
import { Heart, Utensils, MapPin } from "lucide-react";
import { useSectionReveal } from "@/animations";
import { useSectionView } from "@/features/analytics";

const ABOUT_CARDS = [
  {
    icon: Heart,
    title: "Nuestra cocina",
    description: PLACEHOLDER.ABOUT_TEXT,
  },
  {
    icon: Utensils,
    title: "Ingredientes de verdad",
    description: "Carne angus, verduras del mercado, pan artesanal. Cosas sencillas, hechas bien.",
  },
  {
    icon: MapPin,
    title: "Aquí nomás",
    description: "Llegamos para quedarnos. Cocina honesta, buena comida y ganas de servirle bien a nuestra gente.",
  },
];

export function AboutSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });
  const sectionRef = useSectionView<HTMLDivElement>("about");

  return (
    <SectionContainer id="about" background="surface">
      <SectionHeader
        title={PLACEHOLDER.ABOUT_TITLE}
        eyebrow="Nuestra historia"
        align="left"
        withDivider
      />
      <div ref={sectionRef}>
        <div ref={revealRef} className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-surface-alt to-bg">
          <div
            className="pointer-events-none absolute h-72 w-72 rounded-full bg-brand-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <Image
            src={PLACEHOLDER.ABOUT_IMAGE_SRC}
            alt={PLACEHOLDER.ABOUT_IMAGE_ALT}
            fill
            className="relative z-10 object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="flex flex-col gap-4">
          {ABOUT_CARDS.map((card) => (
            <InfoCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
      </div>
    </SectionContainer>
  );
}

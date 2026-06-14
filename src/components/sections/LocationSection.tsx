"use client";

import { MapPin } from "lucide-react";
import { PLACEHOLDER } from "@/content/placeholders";
import { BUSINESS_CONFIG } from "@/config/business";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { LocationCard } from "@/components/ui/location-card";
import { useSectionReveal } from "@/animations";

export function LocationSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });

  return (
    <SectionContainer id="location" background="surface">
      <SectionHeader
        title={PLACEHOLDER.LOCATION_TITLE}
        withDivider
      />
      <div ref={revealRef} className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-bg-surface-alt to-bg">
          <div
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #F5F5F5 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            aria-hidden="true"
          />
          <div className="relative z-10 flex flex-col items-center gap-3">
            <MapPin size={32} className="text-brand-secondary" />
            <span className="font-heading text-lg tracking-wide text-text-muted">
              {PLACEHOLDER.LOCATION_MAP_PLACEHOLDER}
            </span>
          </div>
        </div>
        <LocationCard
          name={BUSINESS_CONFIG.locationName}
          address={BUSINESS_CONFIG.address.full}
          hours={BUSINESS_CONFIG.hours.detailed}
          phone={BUSINESS_CONFIG.phone}
        />
      </div>
    </SectionContainer>
  );
}

"use client";

import { PLACEHOLDER } from "@/content/placeholders";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { ReviewCard } from "@/components/ui/review-card";
import { useSectionReveal } from "@/animations";
import { useSectionView } from "@/features/analytics";

export function TestimonialsSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });
  const sectionRef = useSectionView<HTMLDivElement>("testimonials");

  return (
    <SectionContainer id="testimonials" background="default">
      <SectionHeader
        title={PLACEHOLDER.TESTIMONIALS_TITLE}
        subtitle={PLACEHOLDER.TESTIMONIALS_DESCRIPTION}
        withDivider
      />
      <div ref={sectionRef}>
        <div ref={revealRef} className="grid gap-6 md:grid-cols-3">
        {PLACEHOLDER.TESTIMONIALS.map((review) => (
          <ReviewCard
            key={review.name}
            name={review.name}
            text={review.text}
            rating={review.rating}
            date={review.date}
          />
        ))}
        </div>
      </div>
    </SectionContainer>
  );
}

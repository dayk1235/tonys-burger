"use client";

import { PLACEHOLDER } from "@/content/placeholders";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { GalleryCard } from "@/components/ui/gallery-card";
import { useSectionReveal, useParallax } from "@/animations";
import { useSectionView } from "@/features/analytics";

function GalleryItem({ image }: { image: typeof PLACEHOLDER.GALLERY_IMAGES[number] }) {
  const parallaxRef = useParallax<HTMLDivElement>({ y: -12, scrub: 0.5 });

  return (
    <div ref={parallaxRef}>
      <GalleryCard
        src={image.src}
        alt={image.alt}
        caption={image.caption}
        aspectRatio="square"
      />
    </div>
  );
}

export function GalleryPreviewSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });
  const sectionRef = useSectionView<HTMLDivElement>("gallery");

  return (
    <SectionContainer id="gallery" background="surface">
      <SectionHeader
        title={PLACEHOLDER.GALLERY_TITLE}
        subtitle={PLACEHOLDER.GALLERY_DESCRIPTION}
        withDivider
      />
      <div ref={sectionRef}>
        <div ref={revealRef} className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        {PLACEHOLDER.GALLERY_IMAGES.map((image) => (
          <GalleryItem key={image.src} image={image} />
        ))}
      </div>
      </div>
    </SectionContainer>
  );
}

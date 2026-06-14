"use client";

import { PLACEHOLDER } from "@/content/placeholders";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { BurgerCard } from "@/components/ui/burger-card";
import { useSectionReveal } from "@/animations";
import { useSectionView, useBurgerView } from "@/features/analytics";

function FeaturedBurgerItem({
  burger,
  featured,
}: {
  burger: typeof PLACEHOLDER.FEATURED_BURGERS[number];
  featured?: boolean;
}) {
  const viewRef = useBurgerView<HTMLDivElement>(burger.id, burger.name);

  return (
    <div ref={viewRef}>
      <BurgerCard
        name={burger.name}
        description={burger.description}
        price={burger.price}
        image={burger.image}
        imageAlt={burger.imageAlt}
        category={burger.category}
        badge={burger.badge}
        featured={featured}
      />
    </div>
  );
}

export function FeaturedBurgersSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });
  const sectionRef = useSectionView<HTMLDivElement>("featured-burgers");

  const [first, ...rest] = PLACEHOLDER.FEATURED_BURGERS;

  return (
    <SectionContainer id="featured" background="default">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "url('/assets/demo/textures/charcoal-texture.webp')", backgroundSize: "256px", backgroundRepeat: "repeat" }}
        aria-hidden="true"
      />
      <SectionHeader
        title={PLACEHOLDER.FEATURED_TITLE}
        eyebrow="Especialidades"
        align="left"
        withDivider
      />
      <div ref={sectionRef}>
        <div ref={revealRef} className="grid gap-5 md:grid-cols-2 lg:grid-cols-2 lg:grid-rows-2">
          <div className="lg:col-span-1 lg:row-span-2">
            <FeaturedBurgerItem burger={first} featured />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-1">
            {rest.map((burger) => (
              <FeaturedBurgerItem key={burger.id} burger={burger} />
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

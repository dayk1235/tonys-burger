"use client";

import { PLACEHOLDER } from "@/content/placeholders";
import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { BurgerCard } from "@/components/ui/burger-card";
import { useSectionReveal } from "@/animations";
import { useSectionView, useBurgerView } from "@/features/analytics";

function MenuBurgerItem({ item }: { item: typeof PLACEHOLDER.MENU_ITEMS[number] }) {
  const viewRef = useBurgerView<HTMLDivElement>(item.id, item.name);

  return (
    <div ref={viewRef}>
      <BurgerCard
        name={item.name}
        description={item.description}
        price={item.price}
        image={item.image}
        imageAlt={item.imageAlt}
        category={item.category}
        badge={item.badge}
      />
    </div>
  );
}

export function MenuPreviewSection() {
  const revealRef = useSectionReveal<HTMLDivElement>({ start: "top 85%" });
  const sectionRef = useSectionView<HTMLDivElement>("menu-preview");

  return (
    <SectionContainer id="menu-preview" background="alt">
      <SectionHeader
        title={PLACEHOLDER.MENU_SECTION_TITLE}
        eyebrow="El menú"
        align="left"
        withDivider
      />
      <div ref={sectionRef}>
        <div ref={revealRef} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER.MENU_ITEMS.map((item) => (
            <MenuBurgerItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}

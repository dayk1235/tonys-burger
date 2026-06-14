import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedBurgersSection } from "@/components/sections/FeaturedBurgersSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { BurgerAssemblySection } from "@/components/sections/BurgerAssemblySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { MenuPreviewSection } from "@/components/sections/MenuPreviewSection";
import { GalleryPreviewSection } from "@/components/sections/GalleryPreviewSection";
import { LocationSection } from "@/components/sections/LocationSection";
import { CTASection } from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedBurgersSection />
      <TestimonialsSection />
      <BurgerAssemblySection />
      <AboutSection />
      <MenuPreviewSection />
      <GalleryPreviewSection />
      <LocationSection />
      <CTASection />
    </>
  );
}

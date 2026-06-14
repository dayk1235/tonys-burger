"use client";

import { SectionContainer } from "@/components/ui/section-container";
import { SectionHeader } from "@/components/ui/section-header";
import { BurgerLayersVisual } from "./BurgerAssembly/BurgerLayersVisual";
import {
  useBurgerAssembly,
  type BurgerStageData,
} from "@/animations/burger/useBurgerAssembly";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSectionView, useClickTracking } from "@/features/analytics";

const STAGES: BurgerStageData[] = [
  {
    id: "bun",
    name: "Pan tostado al carbón",
    description:
      "Suavecito por dentro, doradito por fuera. El pan brioche que aguanta toda la carne sin deshacerse.",
  },
  {
    id: "patty",
    name: "Carne angus al fuego",
    description:
      "Jugosa por dentro, con ese sellado que solo el carbón da. 100% angus, nada de mezclas raras.",
  },
  {
    id: "cheese",
    name: "Queso que se derrite",
    description:
      "Cheddar añejo que se deshace sobre la carne caliente. Cremoso, con sabor y bien puesto.",
  },
  {
    id: "lettuce",
    name: "Lechuga siempre fresca",
    description:
      "Crujiente, lavada a mano, llegando todos los días del mercado. Así de simple.",
  },
  {
    id: "tomato",
    name: "Tomate como debe ser",
    description:
      "Gordo, rojo y con sabor. Nada de esos tomates de plástico que parecen de juguete.",
  },
  {
    id: "onion",
    name: "Cebolla caramelizada",
    description:
      "Cocinada lento hasta que se pone dulce y dorada. Le da ese toque que no sabes que necesitas.",
  },
  {
    id: "complete",
    name: "Lista para comer",
    description:
      "El pan de arriba, las verduras frescas, la carne al carbón y el queso derretido. Todo junto. Esto es Tony's.",
  },
];

export function BurgerAssemblySection() {
  const { sectionRef, activeStage } = useBurgerAssembly<HTMLDivElement>(STAGES);
  const sectionViewRef = useSectionView<HTMLDivElement>("burger-assembly");
  const trackClick = useClickTracking();

  return (
    <SectionContainer id="burger-assembly" background="default">
      <SectionHeader
        title="Así las preparamos"
        subtitle="Paso a paso, así se arma tu hamburguesa. Pura cocina honesta."
        withDivider
      />

      <div
        ref={sectionViewRef}
      >
      <div
        ref={sectionRef}
        className="relative"
        style={{ height: `${STAGES.length * 28}vh` }}
      >
        {/* Sticky content — fills viewport while scrolling through stages */}
        <div className="sticky top-0 h-screen flex items-center overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 w-full max-w-container-max mx-auto px-4 md:px-6 lg:px-8 items-center">
            {/* Burger visual */}
            <BurgerLayersVisual
              activeStage={activeStage}
              totalStages={STAGES.length}
            />

            {/* Stage text */}
            <div className="flex flex-col justify-center min-h-0">
              {activeStage >= 0 && activeStage < STAGES.length ? (
                <div key={activeStage} className="space-y-4">
                  <span className="text-brand-secondary font-mono text-sm tracking-wider">
                    {String(activeStage + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-4xl md:text-5xl text-text-primary leading-tight">
                    {STAGES[activeStage].name}
                  </h3>
                  <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-md">
                    {STAGES[activeStage].description}
                  </p>
                  {activeStage === STAGES.length - 1 && (
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button
                        variant="cta" size="xl"
                        onClick={() => trackClick({ type: "whatsapp", source: "assembly" })}
                      >
                        Pedir por WhatsApp
                        <ArrowRight className="size-5" />
                      </Button>
                      <Button
                        variant="outline" size="xl"
                        onClick={() => trackClick({ type: "menu", source: "assembly" })}
                      >
                        Ver el menú
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="font-mono text-sm tracking-wider text-text-muted">
                    Desliza para ver
                  </span>
                  <h3 className="font-heading text-4xl md:text-5xl text-text-muted/40 leading-tight">
                    Así las
                    <br />
                    preparamos
                  </h3>
                  <p className="text-text-muted/40 text-base md:text-lg max-w-md">
                    Desliza hacia abajo y mira cómo armamos tu hamburguesa, ingrediente por ingrediente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </SectionContainer>
  );
}

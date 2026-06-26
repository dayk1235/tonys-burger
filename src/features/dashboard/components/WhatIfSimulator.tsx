"use client";

import { useState } from "react";
import { ScenarioCard } from "./ScenarioCard";
import { ScenarioSlider } from "./ScenarioSlider";
import { useTranslation } from "@/localization";

export function WhatIfSimulator() {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState(0);
  const [openEarlier, setOpenEarlier] = useState(false);
  const [promoteCombo, setPromoteCombo] = useState(false);

  return (
    <section className="space-y-12 border-t border-border/50 pt-16">
      <div className="space-y-3">
        <h2 className="text-2xl font-light tracking-tight text-text-primary">
          {t("dashboard.simulator.title")}
        </h2>
        <p className="text-[15px] text-text-secondary">
          {t("dashboard.simulator.subtitle")}
        </p>
      </div>

      <div className="space-y-2">
        <ScenarioCard
          title={t("dashboard.simulator.increaseDiscount")}
          isActive={discount > 0}
          benefits={[
            t("dashboard.simulator.benefit1"),
            t("dashboard.simulator.benefit2"),
          ]}
          risks={[
            t("dashboard.simulator.risk1"),
            t("dashboard.simulator.risk2"),
          ]}
          confidence="Medium"
          control={<ScenarioSlider value={discount} onChange={setDiscount} />}
        />

        <ScenarioCard
          title={t("dashboard.simulator.openEarlier")}
          isActive={openEarlier}
          benefits={[
            t("dashboard.simulator.benefit3"),
            t("dashboard.simulator.benefit4"),
          ]}
          risks={[
            t("dashboard.simulator.risk3"),
            t("dashboard.simulator.risk4"),
          ]}
          confidence="Low"
          control={
            <button
              onClick={() => setOpenEarlier(!openEarlier)}
              className={`relative h-[26px] w-[46px] rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                openEarlier ? "bg-brand-primary" : "bg-border"
              }`}
              aria-pressed={openEarlier}
            >
              <span 
                className={`absolute left-[3px] top-[3px] size-5 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                  openEarlier ? "translate-x-5" : "translate-x-0"
                }`} 
              />
            </button>
          }
        />

        <ScenarioCard
          title={t("dashboard.simulator.promoteCombo")}
          isActive={promoteCombo}
          benefits={[
            t("dashboard.simulator.benefit5"),
            t("dashboard.simulator.benefit6"),
          ]}
          risks={[
            t("dashboard.simulator.risk5"),
            t("dashboard.simulator.risk6"),
          ]}
          confidence="High"
          control={
            <button
              onClick={() => setPromoteCombo(!promoteCombo)}
              className={`relative h-[26px] w-[46px] rounded-full transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                promoteCombo ? "bg-brand-primary" : "bg-border"
              }`}
              aria-pressed={promoteCombo}
            >
              <span 
                className={`absolute left-[3px] top-[3px] size-5 rounded-full bg-white transition-transform duration-300 ease-in-out ${
                  promoteCombo ? "translate-x-5" : "translate-x-0"
                }`} 
              />
            </button>
          }
        />
      </div>
    </section>
  );
}

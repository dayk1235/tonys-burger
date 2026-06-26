"use client";

import { BriefCard } from "./BriefCard";
import { DecisionEngine } from "@/features/engines/decision/engine";
import { useTranslation } from "@/localization";

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

export function DailyBrief() {
  const { t, locale } = useTranslation();
  const greetingKey = getGreetingKey();
  const recommendations = DecisionEngine.getDailyBrief(locale);

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
          {t(`brief.heading.${greetingKey}`)}
        </h2>
        <p className="text-sm leading-relaxed text-text-muted">
          {t("brief.subtitle")}
        </p>
        <p className="text-xs text-text-muted/40">
          {t("brief.generated")}
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <BriefCard key={rec.id} recommendation={rec} index={i} />
        ))}
      </div>
    </section>
  );
}

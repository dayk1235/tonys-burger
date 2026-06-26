"use client";

import { DashboardContainer, MetricCard, DailyBrief } from "@/features/dashboard/components";
import { AnimatedSection } from "@/features/dashboard/components/AnimatedSection";
import { HealthHero } from "@/features/dashboard/components/HealthHero";
import { HealthSummary } from "@/features/dashboard/components/HealthSummary";
import { RecommendedFocus } from "@/features/dashboard/components/RecommendedFocus";
import { TodaysStory } from "@/features/dashboard/components/TodaysStory";
import { OperationalStatus } from "@/features/dashboard/components/OperationalStatus";
import { DecisionEngine } from "@/features/engines/decision/engine";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { useTranslation } from "@/localization";

export default function DashboardHome() {
  const { t, locale } = useTranslation();
  const data = DecisionEngine.getHomeData(locale);
  const { health, focus, metrics, activity, integrations, activeExperiments } = data;

  // Look up the insight detail for expected impact on the focus item
  const focusDetail = focus ? DecisionEngine.getInsight(focus.id, locale)?.detail : null;

  return (
    <DashboardContainer>
      <div className="mx-auto max-w-[960px]">
        {/* ── Section 1: Restaurant Health ───────────────────────── */}
        {/* Signature Moment — the first thing the owner sees, no scroll delay */}
        <section className="pb-20 sm:pb-24">
          <HealthHero health={health} />
        </section>

        {/* ── Section 2: Health Summary ─────────────────────────── */}
        {/* The conclusion before detail — editorial flow per Experience Hierarchy */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <HealthSummary summary={health.summary} />
        </AnimatedSection>

        {/* ── Section 3: Daily Brief ────────────────────────────── */}
        {/* Progressive Discovery — recommendations unfold as the owner scrolls */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <DailyBrief />
        </AnimatedSection>

        {/* ── Section 4: Recommended Focus ──────────────────────── */}
        {/* Primary Decision — one elevated recommendation */}
        {focus && (
          <AnimatedSection as="div" className="pb-20 sm:pb-24">
            <RecommendedFocus
              title={focus.title}
              description={focus.description}
              expectedImpact={focusDetail?.expectedImpact}
              href={`${DASHBOARD_ROUTES.insights}/${focus.id}`}
            />
          </AnimatedSection>
        )}

        {/* ── Section 5: Today's Story ──────────────────────────── */}
        {/* Narrative flow — the day unfolding, scroll reveals naturally */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <TodaysStory items={activity} />
        </AnimatedSection>

        {/* ── Section 6: Today's Performance ────────────────────── */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <div className="space-y-5">
            <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("dashboard.home.performance")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, i) => (
                <MetricCard key={metric.id} metric={metric} index={i} variant="slim" />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Section 7: Active Experiments ─────────────────────── */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("dashboard.home.experiments")}
            </h2>
            <div className="rounded-2xl border border-border bg-bg-surface/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">{t("dashboard.home.runningExperiments")}</p>
                  <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text-primary">
                    {activeExperiments}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Section 8: Operational Status ─────────────────────── */}
        <AnimatedSection as="div" className="pb-8">
          <OperationalStatus integrations={integrations} />
        </AnimatedSection>
      </div>
    </DashboardContainer>
  );
}

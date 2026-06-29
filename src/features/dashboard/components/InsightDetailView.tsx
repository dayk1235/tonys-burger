"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";
import { InsightHeader } from "./InsightHeader";
import { InsightSection } from "./InsightSection";
import { PossibleCauseList } from "./PossibleCauseList";
import { InsightRecommendation } from "./InsightRecommendation";
import { ImpactCard } from "./ImpactCard";
import { DashboardContainer } from "./DashboardContainer";
import { DecisionDashboard } from "@/features/engines/decision/engine";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { ExplainableDecision } from "./ExplainableDecision";
import { BusinessMemory } from "./BusinessMemory";
import { WhatIfSimulator } from "./WhatIfSimulator";
import { useTranslation } from "@/localization";

interface InsightDetailViewProps {
  id: string;
}

export function InsightDetailView({ id }: InsightDetailViewProps) {
  const { t, locale } = useTranslation();
  const data = DecisionDashboard.getInsight(id, locale);

  if (!data) {
    notFound();
  }

  const { recommendation, detail } = data;

  return (
    <DashboardContainer>
      <article className="mx-auto max-w-[72ch]">
        {/* ── Header — on-mount entrance (no scroll delay for top of page) ── */}
        <div className="pb-16">
          <InsightHeader recommendation={recommendation} />

          <AnimatedSection role="notification" trigger="mount" delay={0.2} as="div">
            <p className="mt-8 max-w-prose text-[15px] leading-7 text-text-secondary">
              {detail.summary}
            </p>
          </AnimatedSection>
        </div>

        {/* ── Editorial flow sections — scroll-triggered, progressive discovery ── */}

        <AnimatedSection as="div" className="pb-16">
          <hr className="border-border" />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <InsightSection title={t("dashboard.insightDetail.whatHappened")} index={1}>
            <p className="max-w-prose text-sm leading-7 text-text-secondary">
              {detail.whatHappened}
            </p>
          </InsightSection>
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <InsightSection title={t("dashboard.insightDetail.whyThisMatters")} index={2}>
            <p className="max-w-prose text-sm leading-7 text-text-secondary">
              {detail.whyItMatters}
            </p>
          </InsightSection>
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <InsightSection title={t("insight.possibleCauses")} index={3}>
            <PossibleCauseList causes={detail.possibleCauses} />
          </InsightSection>
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <InsightSection title={t("insight.recommendedAction")} index={4}>
            <InsightRecommendation action={detail.recommendedAction} />
          </InsightSection>
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <ExplainableDecision detail={detail} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <BusinessMemory />
        </AnimatedSection>

        <AnimatedSection as="div">
          <WhatIfSimulator />
        </AnimatedSection>

        <AnimatedSection as="div" className="py-16">
          <InsightSection title={t("dashboard.insightDetail.expectedImpact")} index={5}>
            <ImpactCard impact={detail.expectedImpact} />
          </InsightSection>
        </AnimatedSection>

        {/* ── CTA — create experiment, signature moment weight ── */}
        <AnimatedSection role="notification" trigger="scroll" as="div" className="pb-16">
          <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-6 text-center">
            <p className="text-sm font-semibold text-text-primary">
              {t("dashboard.insightDetail.readyToAct")}
            </p>
            <p className="mt-1 text-sm text-text-muted">
              {t("dashboard.insightDetail.turnIntoExperiment")}
            </p>
            <Link
              href={`${DASHBOARD_ROUTES.actionsNew}?id=${id}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              {t("dashboard.insightDetail.createExperiment")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
      </article>
    </DashboardContainer>
  );
}

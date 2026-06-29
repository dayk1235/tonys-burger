"use client";

import { notFound } from "next/navigation";
import { DashboardContainer } from "./DashboardContainer";
import { AnimatedSection } from "./AnimatedSection";
import { BackNavigation } from "./BackNavigation";
import { ActionSummary } from "./ActionSummary";
import { ExperimentCard } from "./ExperimentCard";
import { ExperimentForm } from "./ExperimentForm";
import { SuccessCriteria } from "./SuccessCriteria";
import { PredictionCard } from "./PredictionCard";
import { ActionFooter } from "./ActionFooter";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { DecisionDashboard } from "@/features/engines/decision/engine";
import { useTranslation } from "@/localization";

interface ActionCenterViewProps {
  insightId: string | null;
}

export function ActionCenterView({ insightId }: ActionCenterViewProps) {
  const { t, locale } = useTranslation();
  const data = insightId ? DecisionDashboard.getExperiment(insightId, locale) : null;

  if (!data) {
    notFound();
  }

  const { recommendation, experiment } = data;

  const backHref = `${DASHBOARD_ROUTES.insights}/${insightId}`;
  const experimentHref = `${DASHBOARD_ROUTES.experimentsBase}/${insightId}`;

  return (
    <DashboardContainer>
      <article className="mx-auto max-w-[800px]">
        {/* ── Header — on-mount entrance ── */}
        <div className="pb-14">
          <AnimatedSection role="notification" trigger="mount" as="div" delay={0.15}>
            <BackNavigation href={backHref} label={t("dashboard.actionCenter.backToInsight")} />
          </AnimatedSection>

          <AnimatedSection trigger="mount" as="div" delay={0.2}>
            <div className="mt-4 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                {t("dashboard.actionCenter.title")}
              </h1>
              <p className="text-sm leading-relaxed text-text-muted">
                {t("dashboard.actionCenter.subtitle")}
                <br />
                {t("dashboard.actionCenter.simulated")}
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Body — scroll-triggered sections ── */}
        <AnimatedSection as="div" className="pb-16">
          <ActionSummary recommendation={recommendation} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <hr className="border-border" />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <ExperimentCard experiment={experiment} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <ExperimentForm experiment={experiment} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <SuccessCriteria criteria={experiment.successCriteria} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <PredictionCard impact={experiment.estimatedOutcome} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-8">
          <ActionFooter backHref={backHref} experimentHref={experimentHref} />
        </AnimatedSection>
      </article>
    </DashboardContainer>
  );
}

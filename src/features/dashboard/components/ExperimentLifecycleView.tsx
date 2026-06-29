"use client";

import { notFound } from "next/navigation";
import { AnimatedSection } from "./AnimatedSection";
import { DashboardContainer } from "./DashboardContainer";
import { BackNavigation } from "./BackNavigation";
import { ExperimentHeader } from "./ExperimentHeader";
import { LifecycleTimeline } from "./LifecycleTimeline";
import { ProgressCard } from "./ProgressCard";
import { MetricExpectation } from "./MetricExpectation";
import { ReviewCard } from "./ReviewCard";
import { LearningGoal } from "./LearningGoal";
import { DecisionDashboard } from "@/features/engines/decision/engine";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { useTranslation } from "@/localization";

interface ExperimentLifecycleViewProps {
  experimentId: string;
}

export function ExperimentLifecycleView({ experimentId }: ExperimentLifecycleViewProps) {
  const { t, locale } = useTranslation();
  const data = DecisionDashboard.getExperimentLifecycle(experimentId, locale);

  if (!data) {
    notFound();
  }

  const { experiment, lifecycle } = data;

  const backHref = `${DASHBOARD_ROUTES.actionsNew}?id=${experimentId}`;

  return (
    <DashboardContainer>
      <article className="mx-auto max-w-[720px]">
        {/* ── Header — on-mount entrance ── */}
        <div className="pb-16">
          <AnimatedSection role="notification" trigger="mount" as="div" delay={0.1}>
            <BackNavigation href={backHref} label={t("dashboard.lifecycle.backToActionCenter")} />
          </AnimatedSection>

          <AnimatedSection trigger="mount" as="div" delay={0.15}>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                {t("dashboard.lifecycle.title")}
              </h1>
              <p className="text-sm leading-relaxed text-text-muted">
                {t("dashboard.lifecycle.simulated")}
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Body sections — scroll-triggered, progressive reveal ── */}
        <AnimatedSection as="div" className="pb-16">
          <ExperimentHeader experiment={experiment} lifecycle={lifecycle} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <LifecycleTimeline stages={lifecycle.timeline} currentStatus={lifecycle.status} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <ProgressCard progress={lifecycle.progress} note={lifecycle.progressNote} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <MetricExpectation metrics={lifecycle.metrics} />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-16">
          <ReviewCard
            date={lifecycle.nextReview}
            objective={lifecycle.nextReviewObjective}
            checklist={lifecycle.nextReviewChecklist}
          />
        </AnimatedSection>

        <AnimatedSection as="div" className="pb-8">
          <LearningGoal goal={lifecycle.learningGoal} />
        </AnimatedSection>
      </article>
    </DashboardContainer>
  );
}

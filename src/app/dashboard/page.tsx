"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardContainer, MetricCard, DailyBrief } from "@/features/dashboard/components";
import { AnimatedSection } from "@/features/dashboard/components/AnimatedSection";
import { HealthHero } from "@/features/dashboard/components/HealthHero";
import { HealthSummary } from "@/features/dashboard/components/HealthSummary";
import { RecommendedFocus } from "@/features/dashboard/components/RecommendedFocus";
import { TodaysStory } from "@/features/dashboard/components/TodaysStory";
import { OperationalStatus } from "@/features/dashboard/components/OperationalStatus";
import { useTranslation } from "@/localization";
import { getRuntime } from "@/core/runtime/RuntimeSingleton";
import type { IntegrationStatus, ActivityItem, HealthData, Metric } from "@/features/engines/decision/types";
import type { CognitiveEvent } from "@/core/runtime/RuntimeTypes";
import { ObservationEngine } from "@/core/engines/observation";
import type { Runtime } from "@/core/runtime/Runtime";

interface RuntimeStatusResponse {
  runtimeState: string;
  health: string;
  engineCount: number;
  registeredEngines: Array<{ name: string; state: string; healthScore: number }>;
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

function toActivityItem(event: CognitiveEvent): ActivityItem {
  return {
    id: event.id,
    label: event.type,
    timestamp: formatRelativeTime(event.timestamp),
  };
}

const TOTAL_PIPELINE_STAGES = 18;

function computeHealthFromRuntime(status: RuntimeStatusResponse): HealthData {
  const totalEngines = status.registeredEngines.length;
  const runningEngines = status.registeredEngines.filter((e) => e.state === "RUNNING").length;
  const baseScore = status.runtimeState === "OPERATING" ? 95 : 50;
  const enginePenalty = totalEngines > 0 ? ((totalEngines - runningEngines) / totalEngines) * 15 : 0;
  const score = Math.max(0, Math.round(baseScore - enginePenalty));
  let state: HealthData["state"];
  if (score >= 90) state = "excellent";
  else if (score >= 75) state = "healthy";
  else if (score >= 60) state = "stable";
  else if (score >= 40) state = "needs-attention";
  else state = "critical";
  return {
    score,
    state,
    summary: `Runtime ${status.runtimeState.toLowerCase()}. ${runningEngines}/${totalEngines} cognitive engines active, ${TOTAL_PIPELINE_STAGES - totalEngines} pipeline stages remaining to connect.`,
    refreshedAt: new Date().toISOString(),
  };
}

function computeEngineMetrics(runtimeStatus: RuntimeStatusResponse, obsCount: number | null): Metric[] {
  const runningEngines = runtimeStatus.registeredEngines.filter((e) => e.state === "RUNNING").length;
  const totalEngines = runtimeStatus.registeredEngines.length;
  const pipelineProgress = Math.round((totalEngines / TOTAL_PIPELINE_STAGES) * 100);
  return [
    {
      id: "engines-active",
      label: "Engines Active",
      value: `${runningEngines}/${totalEngines}`,
      subtitle: `${totalEngines} registered in runtime`,
      change: pipelineProgress,
      trend: pipelineProgress >= 50 ? "up" as const : "stable" as const,
      icon: "activity",
      color: "emerald",
    },
    {
      id: "pipeline-progress",
      label: "Pipeline Progress",
      value: `${pipelineProgress}%`,
      subtitle: `${totalEngines}/${TOTAL_PIPELINE_STAGES} stages connected`,
      change: pipelineProgress,
      trend: pipelineProgress > 0 ? "up" as const : "stable" as const,
      icon: "activity",
      color: "amber",
    },
    {
      id: "orders-today",
      label: "Orders Processed",
      value: obsCount !== null ? String(obsCount) : "—",
      subtitle: obsCount !== null ? "observations ingested by pipeline" : "waiting for first order",
      change: obsCount ?? 0,
      trend: obsCount && obsCount > 0 ? "up" as const : "stable" as const,
      icon: "activity",
      color: "blue",
    },
    {
      id: "runtime-status",
      label: "Runtime Status",
      value: runtimeStatus.runtimeState,
      subtitle: runtimeStatus.health,
      change: runtimeStatus.runtimeState === "OPERATING" ? 100 : 50,
      trend: runtimeStatus.runtimeState === "OPERATING" ? "up" as const : "down" as const,
      icon: "activity",
      color: runtimeStatus.runtimeState === "OPERATING" ? "emerald" : "red",
    },
  ];
}

function computeFocusFromRuntime(status: RuntimeStatusResponse) {
  const unconnected = TOTAL_PIPELINE_STAGES - status.registeredEngines.length;
  return {
    id: "pipeline-completion",
    title: `Connect ${unconnected} remaining pipeline stages`,
    description: `${status.registeredEngines.length}/${TOTAL_PIPELINE_STAGES} cognitive pipeline stages are connected. ${unconnected} stages remain unconnected: Evidence, Planning, Execution, Learning, Prediction, Recommendation, Conversation, Reflection, Coordination, Business Pulse, and Human Experience.`,
    expectedImpact: `Completing the pipeline enables end-to-end cognitive processing from observation to execution.`,
  };
}

export default function DashboardHome() {
  const { t } = useTranslation();

  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatusResponse | null>(null);

  // Real EventBus events replacing demo activity feed
  const [eventLog, setEventLog] = useState<ActivityItem[]>([]);
  const [eventLogReady, setEventLogReady] = useState(false);

  // Real order count from ObservationEngine metrics
  const [realOrderCount, setRealOrderCount] = useState<number | null>(null);

  // Runtime health derived from status
  const runtimeHealth: HealthData | null = runtimeStatus ? computeHealthFromRuntime(runtimeStatus) : null;

  // Runtime-derived metrics (all 4 cards)
  const realMetrics: Metric[] = runtimeStatus
    ? computeEngineMetrics(runtimeStatus, realOrderCount)
    : [];

  // Recommended focus from pipeline state
  const pipelineFocus = runtimeStatus ? computeFocusFromRuntime(runtimeStatus) : null;

  useEffect(() => {
    fetch("/api/runtime/status")
      .then((res) => res.json())
      .then(setRuntimeStatus)
      .catch(() => {});
  }, []);

  useEffect(() => {
    getRuntime()
      .then((runtime) => {
        const obsEngine = runtime.runtimeRegistry.getEngine("ObservationEngine");
        if (obsEngine) {
          const engine = obsEngine as ObservationEngine;
          const metrics = engine.getMetrics();
          setRealOrderCount(metrics.ingestedCount);
        }
      })
      .catch(() => {
        // Runtime not initialized yet — fall back to demo
      });
  }, []);

  const loadEventLog = useCallback(async () => {
    try {
      const runtime = await getRuntime();
      const events = runtime.eventBus.getHistory();
      setEventLog(events.map(toActivityItem));
      setEventLogReady(true);
    } catch {
      // Runtime not initialized yet
    }
  }, []);

  useEffect(() => {
    loadEventLog();

    let cancelled = false;
    const runtimeRef = { current: null as Runtime | null };
    const handlerRef = { current: null as ((payload: Record<string, unknown>) => Promise<void>) | null };

    getRuntime()
      .then((r) => {
        if (cancelled) return;
        runtimeRef.current = r;

        const handler = async () => {
          setEventLog((prev) => [
            {
              id: `evt_${Date.now()}`,
              label: "observation.lifecycle.historical_committed",
              timestamp: "just now",
            },
            ...prev,
          ]);
        };
        handlerRef.current = handler;

        r.eventBus.subscribe("observation.lifecycle.historical_committed", handler).catch(() => {});
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      if (runtimeRef.current && handlerRef.current) {
        runtimeRef.current.eventBus
          .unsubscribe("observation.lifecycle.historical_committed", handlerRef.current)
          .catch(() => {});
      }
    };
  }, [loadEventLog]);

  // Use real events when available
  const activity = eventLogReady
    ? eventLog.length > 0
      ? eventLog
      : [{ id: "empty", label: "No events yet", timestamp: "" }]
    : [];

  // Replace demo integrations with real Runtime engine data
  const runtimeIntegrations: IntegrationStatus[] = runtimeStatus
    ? [
        {
          platform: `Runtime: ${runtimeStatus.runtimeState}`,
          status: runtimeStatus.runtimeState === "OPERATING" ? "connected" as const : "disconnected" as const,
        },
        ...runtimeStatus.registeredEngines.map((engine) => ({
          platform: engine.name,
          status: engine.state === "RUNNING" ? "connected" as const : "disconnected" as const,
        })),
      ]
    : [];

  return (
    <DashboardContainer>
      <div className="mx-auto max-w-[960px]">
        {/* ── Section 1: Restaurant Health ───────────────────────── */}
        {/* Signature Moment — the first thing the owner sees, no scroll delay */}
        <section className="pb-20 sm:pb-24">
          <HealthHero health={runtimeHealth ?? undefined} loading={!runtimeStatus} empty={runtimeStatus !== null && !runtimeHealth} />
        </section>

        {/* ── Section 2: Health Summary ─────────────────────────── */}
        {/* The conclusion before detail — editorial flow per Experience Hierarchy */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <HealthSummary summary={runtimeHealth?.summary ?? ""} loading={!runtimeStatus} />
        </AnimatedSection>

        {/* ── Section 3: Daily Brief ────────────────────────────── */}
        {/* Progressive Discovery — recommendations unfold as the owner scrolls */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <DailyBrief runtimeStatus={runtimeStatus} realOrderCount={realOrderCount} />
        </AnimatedSection>

        {/* ── Section 4: Recommended Focus ──────────────────────── */}
        {/* Primary Decision — one elevated recommendation */}
        {pipelineFocus && (
          <AnimatedSection as="div" className="pb-20 sm:pb-24">
            <RecommendedFocus
              title={pipelineFocus.title}
              description={pipelineFocus.description}
              expectedImpact={pipelineFocus.expectedImpact}
              href="#"
            />
          </AnimatedSection>
        )}

        {/* ── Section 5: Today's Story (Runtime EventBus) ──────── */}
        {/* Real cognitive events replacing demo activity feed */}
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
              {realMetrics.map((metric, i) => (
                <MetricCard key={metric.id} metric={metric} index={i} variant="slim" />
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ── Section 7: Pipeline Overview ─────────────────────── */}
        <AnimatedSection as="div" className="pb-20 sm:pb-24">
          <div className="space-y-4">
            <h2 className="text-sm font-medium uppercase tracking-wider text-text-muted">
              {t("dashboard.home.experiments")}
            </h2>
            <div className="rounded-2xl border border-border bg-bg-surface/50 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Pipeline stages connected</p>
                  <p className="mt-0.5 text-2xl font-semibold tracking-tight text-text-primary">
                    {runtimeStatus ? `${runtimeStatus.registeredEngines.length}/${TOTAL_PIPELINE_STAGES}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ── Section 8: Runtime Status ─────────────────────────── */}
        <AnimatedSection as="div" className="pb-8">
          <OperationalStatus integrations={runtimeIntegrations} />
        </AnimatedSection>
      </div>
    </DashboardContainer>
  );
}

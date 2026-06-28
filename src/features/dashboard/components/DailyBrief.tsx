"use client";

import { useTranslation } from "@/localization";

interface DailyBriefProps {
  runtimeStatus: {
    runtimeState: string;
    engineCount: number;
    registeredEngines: Array<{ name: string; state: string }>;
  } | null;
  realOrderCount: number | null;
}

const TOTAL_PIPELINE_STAGES = 18;

function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

interface BriefItem {
  id: string;
  icon: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export function DailyBrief({ runtimeStatus, realOrderCount }: DailyBriefProps) {
  const { t } = useTranslation();
  const greetingKey = getGreetingKey();

  const items: BriefItem[] = runtimeStatus
    ? (() => {
        const runningEngines = runtimeStatus.registeredEngines.filter((e) => e.state === "RUNNING").length;
        const totalEngines = runtimeStatus.registeredEngines.length;
        const unconnected = TOTAL_PIPELINE_STAGES - totalEngines;
        const result: BriefItem[] = [
          {
            id: "runtime-state",
            icon: "activity",
            priority: "high",
            title: `Runtime is ${runtimeStatus.runtimeState}`,
            description: `All ${totalEngines} cognitive engines registered. ${runningEngines}/${totalEngines} running. Pipeline operational.`,
          },
        ];
        if (realOrderCount !== null && realOrderCount > 0) {
          result.push({
            id: "orders-processed",
            icon: "activity",
            priority: "medium",
            title: `${realOrderCount} orders processed`,
            description: `Observations ingested through the cognitive pipeline. Each order flows through Observation → Pattern → Memory → Knowledge → Attention → Reasoning → Decision.`,
          });
        }
        if (unconnected > 0) {
          result.push({
            id: "pipeline-gaps",
            icon: "activity",
            priority: "medium",
            title: `${unconnected} pipeline stages remaining`,
            description: `Connect ${unconnected} more engines to complete the cognitive pipeline from decision to execution, learning, and recommendation.`,
          });
        }
        return result;
      })()
    : [
        {
          id: "waiting",
          icon: "activity",
          priority: "low",
          title: "Waiting for Runtime",
          description: "Runtime status not yet available. Dashboard will update once the cognitive pipeline initializes.",
        },
      ];

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
        {items.map((item, i) => (
          <div
            key={item.id}
            className="rounded-2xl border border-border bg-bg-surface/50 p-5 transition-all duration-200 hover:border-brand-primary/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-muted">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

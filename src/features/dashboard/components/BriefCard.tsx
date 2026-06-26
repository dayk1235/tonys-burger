"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { DemoBadge } from "./DemoBadge";
import { PriorityBadge } from "./PriorityBadge";
import { InsightIcon } from "./InsightIcon";
import type { Recommendation } from "@/features/engines/decision/types";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { useTranslation } from "@/localization";

interface BriefCardProps {
  recommendation: Recommendation;
  index: number;
  /** When true, shows a loading skeleton */
  loading?: boolean;
}

function BriefCardSkeleton() {
  const { t } = useTranslation();
  return (
    <div
      aria-busy={true}
      aria-label={t("common.loading")}
      className="rounded-2xl border border-border bg-bg-surface p-5 sm:p-6"
    >
      <div className="flex items-start gap-4" aria-hidden="true">
        <div className="size-10 shrink-0 animate-pulse rounded-xl bg-bg-surface-alt" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
          <div className="h-3 w-full animate-pulse rounded bg-bg-surface-alt" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-bg-surface-alt" />
        </div>
      </div>
    </div>
  );
}

export function BriefCard({ recommendation, index, loading = false }: BriefCardProps) {
  const { t } = useTranslation();

  if (loading) return <BriefCardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className="group relative rounded-2xl border border-border bg-bg-surface p-5 transition-all duration-300 hover:border-border-light hover:shadow-lg hover:shadow-black/20 sm:p-6"
    >
      <div className="flex items-start gap-4">
        <InsightIcon icon={recommendation.icon} />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-text-primary">
              {recommendation.title}
            </h3>
            <PriorityBadge priority={recommendation.priority} />
            <DemoBadge />
          </div>
          <p className="text-sm leading-relaxed text-text-muted">
            {recommendation.description}
          </p>
          <Link
            href={`${DASHBOARD_ROUTES.insights}/${recommendation.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary-light transition-colors hover:text-brand-primary"
          >
            {t("brief.learnMore")}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DASHBOARD_ROUTES } from "@/features/dashboard/config/routes";
import { useTranslation } from "@/localization";

interface BackNavigationProps {
  href?: string;
  label?: string;
}

export function BackNavigation({
  href = DASHBOARD_ROUTES.overview,
  label,
}: BackNavigationProps) {
  const { t } = useTranslation();
  const resolvedLabel = label ?? t("dashboard.insightDetail.backToDailyBrief");
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
    >
      <ArrowLeft size={16} />
      {resolvedLabel}
    </Link>
  );
}

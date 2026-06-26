"use client";

import { useTranslation } from "@/localization";

interface DecisionEvidenceProps {
  whatHappened: string;
  whyItMatters: string;
  recommendedAction: string;
}

export function DecisionEvidence({
  whatHappened,
  whyItMatters,
  recommendedAction,
}: DecisionEvidenceProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.insightDetail.whatHappened")}
        </h3>
        <p className="text-[15px] leading-relaxed text-text-primary">
          {whatHappened}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.insightDetail.whatChanged")}
        </h3>
        <p className="text-[15px] leading-relaxed text-text-secondary">
          {t("dashboard.insightDetail.whatChangedDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.insightDetail.whatRemainedConstant")}
        </h3>
        <p className="text-[15px] leading-relaxed text-text-secondary">
          {t("dashboard.insightDetail.whatRemainedConstantDescription")}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.insightDetail.whyThisMatters")}
        </h3>
        <p className="text-[15px] leading-relaxed text-text-primary">
          {whyItMatters}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          {t("dashboard.insightDetail.whySelected")}
        </h3>
        <p className="text-[15px] leading-relaxed text-text-secondary">
          {recommendedAction}
        </p>
      </div>
    </div>
  );
}

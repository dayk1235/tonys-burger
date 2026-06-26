"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DemoBadge } from "./DemoBadge";
import type { Experiment } from "@/features/engines/decision/types";
import { useTranslation } from "@/localization";

interface ExperimentFormProps {
  experiment: Experiment;
}

export function ExperimentForm({ experiment }: ExperimentFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(experiment.name);
  const [campaignType, setCampaignType] = useState(experiment.campaignTypeOptions[0]);
  const [targetProduct, setTargetProduct] = useState(experiment.targetProduct);
  const [timeRange, setTimeRange] = useState(experiment.targetTimeRange);
  const [channel, setChannel] = useState(experiment.targetChannel);
  const [goal, setGoal] = useState(experiment.expectedImpact);

  const fields = [
    {
      label: t("experiment.name"),
      value: name,
      onChange: setName,
      type: "text",
    },
    {
      label: t("experiment.campaignType"),
      value: campaignType,
      onChange: setCampaignType,
      type: "select",
      options: experiment.campaignTypeOptions,
    },
    {
      label: t("experiment.targetProduct"),
      value: targetProduct,
      onChange: setTargetProduct,
      type: "text",
    },
    {
      label: t("experiment.targetTimeRange"),
      value: timeRange,
      onChange: setTimeRange,
      type: "text",
    },
    {
      label: t("experiment.targetChannel"),
      value: channel,
      onChange: setChannel,
      type: "select",
      options: [
        t("experiment.allChannels"),
        t("experiment.inStore"),
        t("experiment.pickup"),
        t("experiment.delivery"),
        t("experiment.online"),
      ],
    },
    {
      label: t("dashboard.actionCenter.expectedBenefit"),
      value: goal,
      onChange: setGoal,
      type: "text",
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
    >
      <h2 className="mb-4 text-lg font-semibold text-text-primary">{t("dashboard.experiment.parameters")}</h2>
      <div className="rounded-2xl border border-border bg-bg-surface p-5 sm:p-6">
        <div className="space-y-5">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="mb-1.5 block text-xs font-medium text-text-muted">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg-surface-alt px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand-primary"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg-surface-alt px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-brand-primary"
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <DemoBadge />
        </div>
      </div>
    </motion.section>
  );
}

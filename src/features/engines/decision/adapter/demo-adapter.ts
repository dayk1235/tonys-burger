import {
  DEMO_OVERVIEW,
  DEMO_ORDERS_RECENT,
  DEMO_TOP_PRODUCTS,
  DEMO_CHANNEL_BREAKDOWN,
  DEMO_BRIEF_RECOMMENDATIONS,
  DEMO_INSIGHT_DETAILS,
  DEMO_EXPERIMENTS,
  DEMO_EXPERIMENT_LIFECYCLES,
  DEMO_ACTIVITY_FEED,
  DEMO_INTEGRATIONS,
} from "@/demo";
import { DEFAULT_LOCALE, formatDate, formatRelativeTime } from "@/localization";
import { getDictionary } from "@/localization/dictionaries";
import { translate } from "@/localization/utils";
import type {
  DashboardData,
  InsightData,
  ExperimentData,
  ExperimentLifecycleData,
  Recommendation,
  HomeData,
  HealthData,
} from "../types";
import type { LocaleCode } from "@/localization";

const EXPERIMENT_OPTION_KEY_MAP: Record<string, string> = {
  "Time-based discount": "timeBasedDiscount",
  "Bundle deal": "bundleDeal",
  "Limited-time menu": "limitedTimeMenu",
  "Loyalty bonus": "loyaltyBonus",
  "Price promotion": "pricePromotion",
  "A/B test placement": "abTestPlacement",
  "Badge test": "badgeTest",
  "Referral program": "referralProgram",
  "Loyalty points": "loyaltyPoints",
  "Friend discount": "friendDiscount",
  "Social share incentive": "socialShareIncentive",
  "Delivery promo": "deliveryPromo",
  "Menu audit": "menuAudit",
  "Photo refresh": "photoRefresh",
  "Wait time guarantee": "waitTimeGuarantee",
};

const LIFECYCLE_METRIC_LABEL_KEY_MAP: Record<string, string> = {
  "Afternoon Orders": "afternoonOrders",
  "Average Ticket": "averageTicket",
  "Conversion Rate": "conversionRate",
  "Smash Double Conversion": "smashDoubleConversion",
  "Combo Attachment Rate": "comboAttachmentRate",
  "New Customer Rate": "newCustomerRate",
  "Returning Rate": "returningRate",
  "Referral Orders": "referralOrders",
  "Digital Share": "digitalShare",
  "Delivery Orders": "deliveryOrders",
  "Pickup Orders": "pickupOrders",
};

function t(locale: LocaleCode, path: string, params?: Record<string, string | number>): string {
  return translate(getDictionary(locale), path, params);
}

function localizeMetric(locale: LocaleCode, metric: DashboardData["overview"]["metrics"][number]) {
  const key = metric.id;
  return {
    ...metric,
    label: t(locale, `demo.overview.metrics.${key}.label`),
    subtitle: t(locale, `demo.overview.metrics.${key}.subtitle`),
  };
}

function localizeRecommendation(locale: LocaleCode, recommendation: typeof DEMO_BRIEF_RECOMMENDATIONS[number]) {
  return {
    ...recommendation,
    title: t(locale, `demo.brief.${recommendation.id}.title`),
    description: t(locale, `demo.brief.${recommendation.id}.description`),
  };
}

function localizeInsight(locale: LocaleCode, id: string, detail: typeof DEMO_INSIGHT_DETAILS[string]) {
  return {
    summary: t(locale, `demo.insights.${id}.summary`),
    whatHappened: t(locale, `demo.insights.${id}.whatHappened`),
    whyItMatters: t(locale, `demo.insights.${id}.whyItMatters`),
    possibleCauses: detail.possibleCauses.map((_, index) => t(locale, `demo.insights.${id}.causes.${index + 1}`)),
    recommendedAction: t(locale, `demo.insights.${id}.recommendedAction`),
    expectedImpact: t(locale, `demo.insights.${id}.expectedImpact`),
  };
}

function localizeExperiment(locale: LocaleCode, id: string, experiment: typeof DEMO_EXPERIMENTS[string]) {
  return {
    ...experiment,
    name: t(locale, `demo.experiments.${id}.name`),
    objective: t(locale, `demo.experiments.${id}.objective`),
    duration: t(locale, `demo.experiments.${id}.duration`),
    expectedImpact: t(locale, `demo.experiments.${id}.expectedImpact`),
    targetProduct: t(locale, `demo.experiments.${id}.targetProduct`),
    targetTimeRange: t(locale, `demo.experiments.${id}.targetTimeRange`),
    targetChannel: t(locale, `demo.experiments.${id}.targetChannel`),
    estimatedOutcome: t(locale, `demo.experiments.${id}.estimatedOutcome`),
    campaignTypeOptions: experiment.campaignTypeOptions.map((option) => {
      const key = EXPERIMENT_OPTION_KEY_MAP[option];
      return key ? t(locale, `demo.experimentOptions.${key}`) : option;
    }),
    successCriteria: experiment.successCriteria.map((_, index) => t(locale, `demo.experiments.${id}.successCriteria.${index + 1}`)),
  };
}

function localizeLifecycle(locale: LocaleCode, id: string, lifecycle: typeof DEMO_EXPERIMENT_LIFECYCLES[string]) {
  return {
    ...lifecycle,
    status: t(locale, "dashboard.lifecycle.running"),
    started: formatDate(lifecycle.started, locale),
    expectedFinish: formatDate(lifecycle.expectedFinish, locale),
    owner: t(locale, "common.you"),
    progressNote: t(locale, "demo.lifecycle.progressNote"),
    nextReview: formatDate(lifecycle.nextReview, locale),
    nextReviewObjective: t(locale, `demo.lifecycle.${id}.nextReviewObjective`),
    nextReviewChecklist: lifecycle.nextReviewChecklist.map((_, index) => t(locale, `demo.lifecycle.${id}.nextReviewChecklist.${index + 1}`)),
    learningGoal: t(locale, `demo.lifecycle.${id}.learningGoal`),
    timeline: lifecycle.timeline.map((stage) => ({
      ...stage,
      label: t(locale, `dashboard.lifecycle.timeline.${stage.label.toLowerCase()}`),
      date: stage.date,
    })),
    metrics: lifecycle.metrics.map((metric) => ({
      ...metric,
      label: t(locale, `demo.lifecycleMetrics.${LIFECYCLE_METRIC_LABEL_KEY_MAP[metric.label]}`),
    })),
  };
}

function getHealthState(score: number): HealthData["state"] {
  if (score >= 90) return "excellent";
  if (score >= 75) return "healthy";
  if (score >= 60) return "stable";
  if (score >= 40) return "needs-attention";
  return "critical";
}

export const demoAdapter = {
  getDailyBrief(locale: LocaleCode = DEFAULT_LOCALE): Recommendation[] {
    return DEMO_BRIEF_RECOMMENDATIONS.map((recommendation) => localizeRecommendation(locale, recommendation));
  },

  getDashboardData(locale: LocaleCode = DEFAULT_LOCALE): DashboardData {
    return {
      overview: {
        ...DEMO_OVERVIEW,
        businessName: t(locale, "demo.overview.businessName"),
        tagline: t(locale, "demo.overview.tagline"),
        metrics: DEMO_OVERVIEW.metrics.map((metric) => localizeMetric(locale, metric)),
      },
      recentOrders: DEMO_ORDERS_RECENT,
      topProducts: DEMO_TOP_PRODUCTS,
      channelBreakdown: DEMO_CHANNEL_BREAKDOWN,
    };
  },

  getInsight(id: string, locale: LocaleCode = DEFAULT_LOCALE): InsightData | null {
    const recommendation = DEMO_BRIEF_RECOMMENDATIONS.find((r) => r.id === id);
    const detail = DEMO_INSIGHT_DETAILS[id];
    if (!recommendation || !detail) return null;
    return { recommendation: localizeRecommendation(locale, recommendation), detail: localizeInsight(locale, id, detail) };
  },

  getExperiment(id: string, locale: LocaleCode = DEFAULT_LOCALE): ExperimentData | null {
    const recommendation = DEMO_BRIEF_RECOMMENDATIONS.find((r) => r.id === id);
    const experiment = DEMO_EXPERIMENTS[id];
    if (!recommendation || !experiment) return null;
    return { recommendation: localizeRecommendation(locale, recommendation), experiment: localizeExperiment(locale, id, experiment) };
  },

  getExperimentLifecycle(id: string, locale: LocaleCode = DEFAULT_LOCALE): ExperimentLifecycleData | null {
    const experiment = DEMO_EXPERIMENTS[id];
    const lifecycle = DEMO_EXPERIMENT_LIFECYCLES[id];
    if (!experiment || !lifecycle) return null;
    return { experiment: localizeExperiment(locale, id, experiment), lifecycle: localizeLifecycle(locale, id, lifecycle) };
  },

  getHomeData(locale: LocaleCode = DEFAULT_LOCALE): HomeData {
    const { overview } = this.getDashboardData(locale);
    const brief = this.getDailyBrief(locale);
    const score = overview.healthScore;

    return {
      health: {
        score,
        state: getHealthState(score),
        summary: getHealthSummary(score, locale),
        refreshedAt: formatRelativeTime(-30, "second", locale),
      },
      brief,
      focus: brief.length > 0 ? brief[0] : null,
      metrics: overview.metrics,
      activity: DEMO_ACTIVITY_FEED.map((item) => ({
        ...item,
        label: t(locale, `demo.activity.${item.id}.label`),
        timestamp: t(locale, `demo.activity.${item.id}.timestamp`),
      })),
      integrations: DEMO_INTEGRATIONS.map((integration) => ({
        ...integration,
        platform: t(locale, `demo.integrations.${integration.platform.toLowerCase().replace(/\s+/g, "")}`),
      })),
      activeExperiments: Object.keys(DEMO_EXPERIMENTS).length,
    };
  },
};

function getHealthSummary(score: number, locale: LocaleCode): string {
  if (score >= 90) return t(locale, "dashboard.health.summary.excellent");
  if (score >= 75) return t(locale, "dashboard.health.summary.healthy");
  if (score >= 60) return t(locale, "dashboard.health.summary.stable");
  if (score >= 40) return t(locale, "dashboard.health.summary.needsAttention");
  return t(locale, "dashboard.health.summary.critical");
}

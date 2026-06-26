import { demoAdapter } from "./adapter/demo-adapter";
import type {
  DashboardData,
  InsightData,
  ExperimentData,
  ExperimentLifecycleData,
  Recommendation,
  HomeData,
} from "./types";
import type { LocaleCode } from "@/localization";

export const DecisionEngine = {
  getDailyBrief(locale?: LocaleCode): Recommendation[] {
    return demoAdapter.getDailyBrief(locale);
  },

  getDashboardData(locale?: LocaleCode): DashboardData {
    return demoAdapter.getDashboardData(locale);
  },

  getInsight(id: string, locale?: LocaleCode): InsightData | null {
    return demoAdapter.getInsight(id, locale);
  },

  getExperiment(id: string, locale?: LocaleCode): ExperimentData | null {
    return demoAdapter.getExperiment(id, locale);
  },

  getExperimentLifecycle(id: string, locale?: LocaleCode): ExperimentLifecycleData | null {
    return demoAdapter.getExperimentLifecycle(id, locale);
  },

  getHomeData(locale?: LocaleCode): HomeData {
    return demoAdapter.getHomeData(locale);
  },
};

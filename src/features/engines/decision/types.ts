export interface Metric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

export interface Overview {
  businessName: string;
  tagline: string;
  metrics: Metric[];
  monthRevenue: number;
  monthOrders: number;
  healthScore: number;
}

export interface Order {
  id: string;
  items: number;
  total: number;
  status: string;
  time: string;
}

export interface TopProduct {
  name: string;
  orders: number;
  revenue: number;
}

export interface ChannelBreakdown {
  walkIn: number;
  delivery: number;
  pickup: number;
  catering: number;
}

export interface Recommendation {
  id: string;
  icon: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export interface Insight {
  summary: string;
  whatHappened: string;
  whyItMatters: string;
  possibleCauses: string[];
  recommendedAction: string;
  expectedImpact: string;
}

export interface Experiment {
  name: string;
  objective: string;
  duration: string;
  expectedImpact: string;
  campaignTypeOptions: string[];
  targetProduct: string;
  targetTimeRange: string;
  targetChannel: string;
  successCriteria: string[];
  estimatedOutcome: string;
}

export interface LifecycleStage {
  label: string;
  completed: boolean;
  date: string;
}

export interface LifecycleMetric {
  label: string;
  value: string;
  target: string;
}

export interface ExperimentLifecycle {
  status: string;
  started: string;
  expectedFinish: string;
  owner: string;
  timeline: LifecycleStage[];
  progress: number;
  progressNote: string;
  metrics: LifecycleMetric[];
  nextReview: string;
  nextReviewObjective: string;
  nextReviewChecklist: string[];
  learningGoal: string;
}

export interface DashboardData {
  overview: Overview;
  recentOrders: Order[];
  topProducts: TopProduct[];
  channelBreakdown: ChannelBreakdown;
}

export interface InsightData {
  recommendation: Recommendation;
  detail: Insight;
}

export interface ExperimentData {
  recommendation: Recommendation;
  experiment: Experiment;
}

export interface ExperimentLifecycleData {
  experiment: Experiment;
  lifecycle: ExperimentLifecycle;
}

export type HealthState = "excellent" | "healthy" | "stable" | "needs-attention" | "critical";

export interface HealthData {
  score: number;
  state: HealthState;
  summary: string;
  refreshedAt: string;
}

export interface ActivityItem {
  id: string;
  label: string;
  timestamp: string;
}

export interface IntegrationStatus {
  platform: string;
  status: "connected" | "disconnected" | "syncing";
}

export interface HomeData {
  health: HealthData;
  brief: Recommendation[];
  focus: Recommendation | null;
  metrics: Metric[];
  activity: ActivityItem[];
  integrations: IntegrationStatus[];
  activeExperiments: number;
}

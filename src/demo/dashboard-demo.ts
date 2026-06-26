export interface DemoMetric {
  id: string;
  label: string;
  value: string;
  subtitle: string;
  change: number;
  trend: "up" | "down" | "stable";
  icon: string;
  color: string;
}

export interface DemoOverview {
  businessName: string;
  tagline: string;
  metrics: DemoMetric[];
  monthRevenue: number;
  monthOrders: number;
  healthScore: number;
}

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export const DEMO_OVERVIEW: DemoOverview = {
  businessName: "Ember & Oak",
  tagline: "Modern elevated comfort food",
  healthScore: 86,
  monthRevenue: 128400,
  monthOrders: 3840,

  metrics: [
    {
      id: "sales-today",
      label: "Today's Sales",
      value: fmt(4280),
      subtitle: "vs $3,810 yesterday",
      change: 12.3,
      trend: "up",
      icon: "dollar-sign",
      color: "emerald",
    },
    {
      id: "orders-today",
      label: "Orders Today",
      value: "147",
      subtitle: "vs 135 yesterday",
      change: 8.7,
      trend: "up",
      icon: "shopping-cart",
      color: "blue",
    },
    {
      id: "avg-ticket",
      label: "Average Ticket",
      value: fmt(29.12),
      subtitle: "vs $28.16 last week",
      change: 3.4,
      trend: "up",
      icon: "receipt",
      color: "amber",
    },
    {
      id: "returning-customers",
      label: "Returning Customers",
      value: "89",
      subtitle: "60.5% of total orders",
      change: 15.2,
      trend: "up",
      icon: "user-check",
      color: "violet",
    },
    {
      id: "new-customers",
      label: "New Customers",
      value: "43",
      subtitle: "39.5% of total orders",
      change: -2.1,
      trend: "down",
      icon: "user-plus",
      color: "rose",
    },
    {
      id: "conversion-rate",
      label: "Conversion Rate",
      value: "68.4%",
      subtitle: "visit to order",
      change: 5.6,
      trend: "up",
      icon: "trending-up",
      color: "cyan",
    },
    {
      id: "revenue-trend",
      label: "Revenue Trend",
      value: fmt(128400),
      subtitle: "this month to date",
      change: 11.2,
      trend: "up",
      icon: "chart-line",
      color: "indigo",
    },
    {
      id: "health-score",
      label: "Store Health Score",
      value: "86/100",
      subtitle: "↑ 4 points this week",
      change: 4,
      trend: "up",
      icon: "heart-pulse",
      color: "pink",
    },
  ],
};

export const DEMO_ORDERS_RECENT = [
  { id: "ORD-3841", items: 3, total: 47.5, status: "preparing", time: "2 min ago" },
  { id: "ORD-3840", items: 2, total: 34.2, status: "ready", time: "8 min ago" },
  { id: "ORD-3839", items: 5, total: 72.8, status: "delivered", time: "15 min ago" },
  { id: "ORD-3838", items: 1, total: 18.5, status: "delivered", time: "22 min ago" },
  { id: "ORD-3837", items: 4, total: 56.3, status: "delivered", time: "31 min ago" },
];

export const DEMO_PEAK_HOURS = [
  { hour: "11:00", orders: 8 },
  { hour: "12:00", orders: 24 },
  { hour: "13:00", orders: 31 },
  { hour: "14:00", orders: 18 },
  { hour: "15:00", orders: 6 },
  { hour: "16:00", orders: 4 },
  { hour: "17:00", orders: 9 },
  { hour: "18:00", orders: 22 },
  { hour: "19:00", orders: 28 },
  { hour: "20:00", orders: 19 },
  { hour: "21:00", orders: 10 },
];

export const DEMO_TOP_PRODUCTS = [
  { name: "Smash Double", orders: 312, revenue: 8424 },
  { name: "Truffle Fries", orders: 287, revenue: 4305 },
  { name: "Classic Melt", orders: 245, revenue: 5635 },
  { name: "Smoked Brisket", orders: 198, revenue: 5544 },
  { name: "Spicy Chicken", orders: 176, revenue: 3696 },
];

export const DEMO_CHANNEL_BREAKDOWN = {
  walkIn: 42,
  delivery: 28,
  pickup: 18,
  catering: 12,
};

export interface DemoBriefRecommendation {
  id: string;
  icon: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
}

export const DEMO_BRIEF_RECOMMENDATIONS: DemoBriefRecommendation[] = [
  {
    id: "boost-afternoon",
    icon: "clock",
    priority: "medium",
    title: "Boost afternoon traffic",
    description: "Orders drop significantly between 2–5 PM. Consider a happy hour promotion or time-limited deal to fill the gap.",
  },
  {
    id: "top-product",
    icon: "trending-up",
    priority: "high",
    title: "Smash Double leads sales",
    description: "Your top product drives 22% of all orders. Feature it prominently and consider a combo upsell to increase average ticket.",
  },
  {
    id: "returning-growth",
    icon: "users",
    priority: "high",
    title: "Returning customers growing",
    description: "Returning customer rate is up 15.2% this week. Strong loyalty momentum — reinforce with a referral incentive.",
  },
  {
    id: "walk-in-strength",
    icon: "map-pin",
    priority: "low",
    title: "Walk-in dominates channels",
    description: "42% of all orders are walk-in. Your location is a strength. Keep optimizing the in-store experience.",
  },
];

export interface DemoInsightDetail {
  summary: string;
  whatHappened: string;
  whyItMatters: string;
  possibleCauses: string[];
  recommendedAction: string;
  expectedImpact: string;
}

export const DEMO_INSIGHT_DETAILS: Record<string, DemoInsightDetail> = {
  "boost-afternoon": {
    summary:
      "Orders drop by more than 60% between 2 PM and 5 PM, creating an opportunity to capture lost afternoon revenue.",
    whatHappened:
      "Analysis of order timestamps shows a pronounced midday peak between 12 PM and 1:30 PM, followed by a sharp decline. Between 2 PM and 5 PM, order volume averages only 6 orders per hour compared to 26 per hour during peak lunch. This pattern has been consistent over the past 30 days and represents approximately 45 minutes of daily downtime per kitchen station.",
    whyItMatters:
      "The afternoon gap represents an estimated 18–24 lost orders per day. Over a 30-day month, that translates to roughly 540–720 missed transactions. At the current average ticket of $29.12, this is $15,700 to $21,000 in unrealized monthly revenue. Filling even a third of this gap would meaningfully impact top-line growth without requiring additional staff or equipment.",
    possibleCauses: [
      "Menu lacks afternoon-specific options — lighter meals or snack portions that match post-lunch appetite",
      "No price incentive — customers see lunch pricing and assume afternoon is the same value proposition",
      "Visibility gap — current marketing does not mention afternoon availability or specials",
      "Competitor timing — nearby restaurants run afternoon promotions that capture the audience",
      "Customer perception — the brand is mentally associated with lunch and dinner only",
    ],
    recommendedAction:
      "Introduce a limited afternoon menu (2–3 lighter options or combos) priced 15–20% below lunch items, promoted exclusively between 2 PM and 5 PM. Run this test for 14 days and measure order volume during the window.",
    expectedImpact: "+12% to +18% afternoon order volume within 14 days",
  },
  "top-product": {
    summary:
      "Smash Double generates the highest product views but converts to purchase at a rate below the restaurant average.",
    whatHappened:
      "Smash Double has received 312 orders this month — more than any other menu item. However, when compared to its visibility, its conversion rate is 18% below the store average. The product appears in the top position of the menu and receives the most page views, but a significant portion of customers who view it ultimately choose something else.",
    whyItMatters:
      "As the most-viewed item, Smash Double is the first impression many customers have of the menu. If they skip it, there is a risk they perceive the rest of the menu as similar or less appealing. Improving its conversion by even 5% could add 15–20 additional orders per month from existing traffic alone, without any increase in marketing spend.",
    possibleCauses: [
      "Price perception — at the current price point, customers may compare it against combo options and choose what feels like better value",
      "Description length — the current description focuses on ingredients but does not communicate the eating experience or uniqueness",
      "Visual presentation — the product image may not differentiate it sufficiently from other burgers on the menu",
      "Customization friction — customers may want modifications but find the options unclear or difficult to navigate",
      "Social proof gap — the listing does not show popularity signals (e.g., 'Most Popular' badge, review count)",
    ],
    recommendedAction:
      "Add a 'Most Popular' badge, shorten the description to 12 words, and test a dedicated Smash Double + side combo at a 10% discount for 7 days.",
    expectedImpact: "+8% to +15% conversion rate within 7 days",
  },
  "returning-growth": {
    summary:
      "Returning customers now represent 60.5% of orders, up 15.2% week-over-week, signaling strong loyalty momentum.",
    whatHappened:
      "Returning customer share has grown from 52% to 60.5% over the past 4 weeks, with the largest single-week jump occurring this week at +15.2%. The returning customer count reached 89 today, compared to a 4-week average of 72. The new customer count has declined slightly (-2.1%), suggesting the growth is driven by repeat behavior rather than overall traffic increases.",
    whyItMatters:
      "A rising return rate indicates strong product-market fit and customer satisfaction. However, the decline in new customers means the business is not expanding its audience. If this trend continues, growth will plateau. The current loyalty momentum is an ideal window to introduce a referral mechanism — existing customers are most likely to refer when their satisfaction is at its peak.",
    possibleCauses: [
      "Recent quality improvements — a change in preparation or ingredient sourcing may be driving repeat visits",
      "Word-of-mouth acceleration — satisfied customers are bringing friends, who then also return",
      "Limited new-customer acquisition — current marketing channels may be saturated or underperforming",
      "No formal loyalty program — customers return by habit, not by incentive, making retention fragile",
      "Competitive differentiation — the brand may be winning against local alternatives on quality or service",
    ],
    recommendedAction:
      "Launch a simple referral program: existing customers who refer a friend receive $5 off their next order. Track referral codes for 30 days. If returning share exceeds 65%, consider a formal loyalty tier system.",
    expectedImpact: "+5% to +10% new customer acquisition within 30 days",
  },
  "walk-in-strength": {
    summary:
      "Walk-in orders account for 42% of total volume, making physical location the strongest sales channel.",
    whatHappened:
      "Walk-in traffic generates 42% of all orders, significantly ahead of delivery (28%), pickup (18%), and catering (12%). This indicates that the physical location is the primary driver of the business. The store's visibility, foot traffic, and in-store experience are outperforming digital channels combined. Despite this, digital presence (delivery apps, website, social) represents 58% of orders collectively.",
    whyItMatters:
      "Relying on walk-in traffic creates a natural ceiling — growth is limited by location visibility and foot traffic. Currently, digital channels (delivery, pickup) account for 46% of orders and are likely underoptimized. A 10% improvement in digital conversion would deliver more incremental revenue than a 10% improvement in walk-in, given walk-in is already near capacity during peak hours.",
    possibleCauses: [
      "Prime location — the physical store benefits from high foot traffic or a strategic position",
      "Limited digital marketing — investment in online presence may be lower than competitor benchmarks",
      "In-store experience differential — the physical experience may significantly exceed what digital channels communicate",
      "Delivery app optimization — menu presentation, photos, and wait times on Uber Eats / Didi Food may not match in-store quality",
      "Capacity constraint — walk-in during peak hours may already be at maximum throughput, limiting further growth",
    ],
    recommendedAction:
      "Audit delivery app menus to ensure photos, descriptions, and pricing match the in-store experience. Run a delivery-exclusive promotion for 7 days and measure channel mix shift.",
    expectedImpact: "+6% to +12% digital channel share within 14 days",
  },
};

export interface DemoExperiment {
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

export interface DemoLifecycleStage {
  label: string;
  completed: boolean;
  date: string;
}

export interface DemoLifecycleMetric {
  label: string;
  value: string;
  target: string;
}

export interface DemoExperimentLifecycle {
  status: string;
  started: string;
  expectedFinish: string;
  owner: string;
  timeline: DemoLifecycleStage[];
  progress: number;
  progressNote: string;
  metrics: DemoLifecycleMetric[];
  nextReview: string;
  nextReviewObjective: string;
  nextReviewChecklist: string[];
  learningGoal: string;
}

export const DEMO_EXPERIMENTS: Record<string, DemoExperiment> = {
  "boost-afternoon": {
    name: "Afternoon Happy Hour",
    objective: "Increase order volume between 2 PM and 5 PM",
    duration: "14 days",
    expectedImpact: "+12% to +18% afternoon orders",
    campaignTypeOptions: ["Time-based discount", "Bundle deal", "Limited-time menu", "Loyalty bonus"],
    targetProduct: "Light meals, snacks, beverages",
    targetTimeRange: "2:00 PM – 5:00 PM",
    targetChannel: "All channels",
    successCriteria: [
      "Increase afternoon conversion rate",
      "Increase average order value",
      "Increase total daily orders",
    ],
    estimatedOutcome: "+12% to +18% afternoon order volume within 14 days",
  },
  "top-product": {
    name: "Smash Double Conversion Boost",
    objective: "Improve Smash Double purchase rate from product views",
    duration: "7 days",
    expectedImpact: "+8% to +15% conversion rate",
    campaignTypeOptions: ["Bundle deal", "Price promotion", "A/B test placement", "Badge test"],
    targetProduct: "Smash Double",
    targetTimeRange: "Full operating hours",
    targetChannel: "In-store, Pickup",
    successCriteria: [
      "Increase Smash Double conversion rate",
      "Increase average ticket size",
      "Increase combo attachment rate",
    ],
    estimatedOutcome: "+8% to +15% conversion rate within 7 days",
  },
  "returning-growth": {
    name: "Customer Referral Launch",
    objective: "Convert returning customer momentum into new customer acquisition",
    duration: "30 days",
    expectedImpact: "+5% to +10% new customers",
    campaignTypeOptions: ["Referral program", "Loyalty points", "Friend discount", "Social share incentive"],
    targetProduct: "All products",
    targetTimeRange: "Full operating hours",
    targetChannel: "All channels",
    successCriteria: [
      "Increase new customer count",
      "Maintain returning customer rate above 60%",
      "Increase referral-driven orders",
    ],
    estimatedOutcome: "+5% to +10% new customer acquisition within 30 days",
  },
  "walk-in-strength": {
    name: "Digital Channel Optimization",
    objective: "Increase digital channel share from 46% toward 55%",
    duration: "14 days",
    expectedImpact: "+6% to +12% digital channel share",
    campaignTypeOptions: ["Delivery promo", "Menu audit", "Photo refresh", "Wait time guarantee"],
    targetProduct: "Signature items",
    targetTimeRange: "Peak hours",
    targetChannel: "Delivery, Pickup",
    successCriteria: [
      "Increase delivery order volume",
      "Increase pickup order volume",
      "Improve channel mix balance",
    ],
    estimatedOutcome: "+6% to +12% digital channel share within 14 days",
  },
};

export const DEMO_EXPERIMENT_LIFECYCLES: Record<string, DemoExperimentLifecycle> = {
  "boost-afternoon": {
    status: "Running",
    started: "June 22, 2026",
    expectedFinish: "July 6, 2026",
    owner: "You",
    timeline: [
      { label: "Created", completed: true, date: "Jun 22" },
      { label: "Running", completed: true, date: "Jun 22 – present" },
      { label: "Review", completed: false, date: "Jul 6" },
      { label: "Completed", completed: false, date: "Jul 8" },
    ],
    progress: 61,
    progressNote: "Simulated progress based on experiment duration. No real data is being collected.",
    metrics: [
      { label: "Afternoon Orders", value: "+14.2%", target: "+12% to +18%" },
      { label: "Average Ticket", value: "$28.94", target: "Maintain ≥ $28.16" },
      { label: "Conversion Rate", value: "66.8%", target: "Maintain ≥ 65%" },
    ],
    nextReview: "July 6, 2026",
    nextReviewObjective: "Evaluate whether the afternoon promotion is driving incremental orders without eroding average ticket.",
    nextReviewChecklist: [
      "Compare afternoon order volume vs pre-experiment baseline",
      "Calculate average ticket during promotion window",
      "Check for cannibalization of lunch-hour orders",
    ],
    learningGoal: "Determine whether a weekday Happy Hour increases afternoon traffic without reducing average ticket.",
  },
  "top-product": {
    status: "Running",
    started: "June 24, 2026",
    expectedFinish: "July 1, 2026",
    owner: "You",
    timeline: [
      { label: "Created", completed: true, date: "Jun 24" },
      { label: "Running", completed: true, date: "Jun 24 – present" },
      { label: "Review", completed: false, date: "Jul 1" },
      { label: "Completed", completed: false, date: "Jul 3" },
    ],
    progress: 42,
    progressNote: "Simulated progress based on experiment duration. No real data is being collected.",
    metrics: [
      { label: "Smash Double Conversion", value: "+6.8%", target: "+8% to +15%" },
      { label: "Average Ticket", value: "$30.45", target: "≥ $29.12" },
      { label: "Combo Attachment Rate", value: "34%", target: "≥ 30%" },
    ],
    nextReview: "July 1, 2026",
    nextReviewObjective: "Assess whether the combo discount increased Smash Double purchases and overall ticket size.",
    nextReviewChecklist: [
      "Compare Smash Double conversion rate before and after badge placement",
      "Measure average ticket change for orders containing Smash Double",
      "Review customer feedback about the new combo offering",
    ],
    learningGoal: "Determine whether featuring Smash Double with a combo discount increases its purchase rate without reducing perceived value.",
  },
  "returning-growth": {
    status: "Running",
    started: "June 20, 2026",
    expectedFinish: "July 20, 2026",
    owner: "You",
    timeline: [
      { label: "Created", completed: true, date: "Jun 20" },
      { label: "Running", completed: true, date: "Jun 20 – present" },
      { label: "Review", completed: false, date: "Jul 20" },
      { label: "Completed", completed: false, date: "Jul 22" },
    ],
    progress: 28,
    progressNote: "Simulated progress based on experiment duration. No real data is being collected.",
    metrics: [
      { label: "New Customer Rate", value: "+3.1%", target: "+5% to +10%" },
      { label: "Returning Rate", value: "61.2%", target: "≥ 60%" },
      { label: "Referral Orders", value: "12", target: "≥ 25" },
    ],
    nextReview: "July 20, 2026",
    nextReviewObjective: "Determine if referral incentives are converting returning customers into brand advocates.",
    nextReviewChecklist: [
      "Track referral code redemption volume and velocity",
      "Measure new customer acquisition cost via referral vs other channels",
      "Survey referring customers on ease of use and motivation",
    ],
    learningGoal: "Determine whether a referral incentive converts returning customer goodwill into measurable new customer acquisition.",
  },
  "walk-in-strength": {
    status: "Running",
    started: "June 23, 2026",
    expectedFinish: "July 7, 2026",
    owner: "You",
    timeline: [
      { label: "Created", completed: true, date: "Jun 23" },
      { label: "Running", completed: true, date: "Jun 23 – present" },
      { label: "Review", completed: false, date: "Jul 7" },
      { label: "Completed", completed: false, date: "Jul 9" },
    ],
    progress: 55,
    progressNote: "Simulated progress based on experiment duration. No real data is being collected.",
    metrics: [
      { label: "Digital Share", value: "49.2%", target: "≥ 52%" },
      { label: "Delivery Orders", value: "+9.8%", target: "+6% to +12%" },
      { label: "Pickup Orders", value: "+4.5%", target: "+6% to +12%" },
    ],
    nextReview: "July 7, 2026",
    nextReviewObjective: "Evaluate whether delivery app optimizations are shifting channel mix toward digital channels.",
    nextReviewChecklist: [
      "Compare channel mix percentages before and after optimization",
      "Measure delivery order completion rate changes",
      "Review customer ratings on delivery platforms",
    ],
    learningGoal: "Determine whether delivery app menu optimization shifts channel mix toward digital without reducing average order satisfaction.",
  },
};

export interface DemoActivityItem {
  id: string;
  label: string;
  timestamp: string;
}

export const DEMO_ACTIVITY_FEED: DemoActivityItem[] = [
  { id: "act-1", label: "Health refreshed", timestamp: "30 seconds ago" },
  { id: "act-2", label: "New order — ORD-3841", timestamp: "2 minutes ago" },
  { id: "act-3", label: "Delivery platforms synchronized", timestamp: "4 minutes ago" },
  { id: "act-4", label: "Customer returned — Michael Chen", timestamp: "12 minutes ago" },
  { id: "act-5", label: "Experiment started — Afternoon Happy Hour", timestamp: "1 hour ago" },
  { id: "act-6", label: "New customer — Sarah Kim", timestamp: "2 hours ago" },
  { id: "act-7", label: "Order delivered — ORD-3839", timestamp: "3 hours ago" },
  { id: "act-8", label: "Platforms synchronized", timestamp: "4 hours ago" },
];

export const DEMO_INTEGRATIONS: { platform: string; status: "connected" | "disconnected" | "syncing" }[] = [
  { platform: "Uber Eats", status: "connected" },
  { platform: "Didi Food", status: "connected" },
  { platform: "Website", status: "connected" },
  { platform: "POS", status: "connected" },
  { platform: "WhatsApp", status: "connected" },
];

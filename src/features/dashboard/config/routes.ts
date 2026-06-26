import { DASHBOARD_BASE_ROUTE } from "./dashboard-config";

export const DASHBOARD_ROUTES = {
  root: DASHBOARD_BASE_ROUTE,
  overview: DASHBOARD_BASE_ROUTE,
  actionsNew: `${DASHBOARD_BASE_ROUTE}/actions/new`,
  experimentsBase: `${DASHBOARD_BASE_ROUTE}/experiments`,
  orders: `${DASHBOARD_BASE_ROUTE}/orders`,
  products: `${DASHBOARD_BASE_ROUTE}/products`,
  customers: `${DASHBOARD_BASE_ROUTE}/customers`,
  branches: `${DASHBOARD_BASE_ROUTE}/branches`,
  delivery: `${DASHBOARD_BASE_ROUTE}/delivery`,
  marketing: `${DASHBOARD_BASE_ROUTE}/marketing`,
  analytics: `${DASHBOARD_BASE_ROUTE}/analytics`,
  insights: `${DASHBOARD_BASE_ROUTE}/insights`,
  reports: `${DASHBOARD_BASE_ROUTE}/reports`,
  promotions: `${DASHBOARD_BASE_ROUTE}/promotions`,
  artificialIntelligence: `${DASHBOARD_BASE_ROUTE}/artificial-intelligence`,
  settings: `${DASHBOARD_BASE_ROUTE}/settings`,
} as const;

export type DashboardRoute = (typeof DASHBOARD_ROUTES)[keyof typeof DASHBOARD_ROUTES];

export interface DashboardModuleConfig {
  id: string;
  displayName: string;
  iconId: string;
  route: string;
  permissionId: string;
}

export const DASHBOARD_MODULES: DashboardModuleConfig[] = [
  {
    id: "overview",
    displayName: "Overview",
    iconId: "layout-dashboard",
    route: "/dashboard",
    permissionId: "dashboard:overview",
  },
  {
    id: "orders",
    displayName: "Orders",
    iconId: "shopping-cart",
    route: "/dashboard/orders",
    permissionId: "dashboard:orders",
  },
  {
    id: "products",
    displayName: "Products",
    iconId: "utensils-crossed",
    route: "/dashboard/products",
    permissionId: "dashboard:products",
  },
  {
    id: "customers",
    displayName: "Customers",
    iconId: "users",
    route: "/dashboard/customers",
    permissionId: "dashboard:customers",
  },
  {
    id: "branches",
    displayName: "Branches",
    iconId: "store",
    route: "/dashboard/branches",
    permissionId: "dashboard:branches",
  },
  {
    id: "delivery",
    displayName: "Delivery",
    iconId: "truck",
    route: "/dashboard/delivery",
    permissionId: "dashboard:delivery",
  },
  {
    id: "marketing",
    displayName: "Marketing",
    iconId: "megaphone",
    route: "/dashboard/marketing",
    permissionId: "dashboard:marketing",
  },
  {
    id: "analytics",
    displayName: "Analytics",
    iconId: "bar-chart-3",
    route: "/dashboard/analytics",
    permissionId: "dashboard:analytics",
  },
  {
    id: "insights",
    displayName: "Insights",
    iconId: "lightbulb",
    route: "/dashboard/insights",
    permissionId: "dashboard:insights",
  },
  {
    id: "reports",
    displayName: "Reports",
    iconId: "file-text",
    route: "/dashboard/reports",
    permissionId: "dashboard:reports",
  },
  {
    id: "promotions",
    displayName: "Promotions",
    iconId: "percent",
    route: "/dashboard/promotions",
    permissionId: "dashboard:promotions",
  },
  {
    id: "artificial-intelligence",
    displayName: "AI",
    iconId: "bot",
    route: "/dashboard/artificial-intelligence",
    permissionId: "dashboard:ai",
  },
  {
    id: "settings",
    displayName: "Settings",
    iconId: "settings",
    route: "/dashboard/settings",
    permissionId: "dashboard:settings",
  },
];

export const DASHBOARD_BASE_ROUTE = "/dashboard";

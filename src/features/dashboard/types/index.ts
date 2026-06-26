export interface Business {
  id: string;
  name: string;
  slug: string;
}

export interface Branch {
  id: string;
  businessId: string;
  name: string;
}

export interface Store {
  id: string;
  branchId: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  branchId: string;
  status: string;
  total: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
}

export interface Promotion {
  id: string;
  name: string;
  type: string;
  startsAt: string;
  endsAt: string;
}

export interface Metric {
  id: string;
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: "low" | "medium" | "high";
}

export interface DashboardCard {
  id: string;
  title: string;
  type: string;
  size: "sm" | "md" | "lg" | "full";
  config: Record<string, unknown>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    values: number[];
    color?: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  read: boolean;
  createdAt: string;
}

export interface Filter {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

export interface DateRange {
  start: string;
  end: string;
  preset?: "today" | "yesterday" | "last-7" | "last-30" | "this-month" | "last-month" | "custom";
}

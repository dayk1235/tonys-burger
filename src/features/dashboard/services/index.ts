import type { AnalyticsEvent } from "@/features/analytics/types";
import type { InsightsReport } from "@/features/insights/types";
import type { BusinessReport } from "@/features/reports/types";
import type { Business, Branch, Customer, Order, Product, Promotion } from "../types";

export interface AnalyticsRepository {
  getEvents(start: string, end: string): Promise<AnalyticsEvent[]>;
}

export interface OrdersRepository {
  getOrders(start: string, end: string): Promise<Order[]>;
  getOrderById(id: string): Promise<Order | null>;
}

export interface ProductsRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
}

export interface CustomersRepository {
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | null>;
}

export interface DeliveryRepository {
  getDeliveryOrders(start: string, end: string): Promise<Order[]>;
  getDeliveryMetrics(start: string, end: string): Promise<Record<string, number>>;
}

export interface ReportsRepository {
  getReport(period: string): Promise<BusinessReport | null>;
  getReports(): Promise<BusinessReport[]>;
}

export interface InsightsRepository {
  getInsights(start: string, end: string): Promise<InsightsReport>;
}

export interface PromotionRepository {
  getPromotions(): Promise<Promotion[]>;
  getActivePromotions(): Promise<Promotion[]>;
}

export interface BusinessRepository {
  getBusiness(): Promise<Business | null>;
  getBranches(): Promise<Branch[]>;
}

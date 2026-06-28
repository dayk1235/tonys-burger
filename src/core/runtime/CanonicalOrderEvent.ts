/**
 * Canonical Order Event v1.0.0 — frozen contract implementation.
 * @see project-docs/intelligence/CANONICAL_ORDER_EVENT_SPEC.md
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED";

export type OrderType = "DINE_IN" | "TAKEOUT" | "DELIVERY" | "CATERING";

export type PaymentMethod =
  | "CASH"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "ONLINE_PAYMENT"
  | "MOBILE_PAYMENT"
  | "GIFT_CARD"
  | "LOYALTY_POINTS"
  | "OTHER";

export type PaymentStatus =
  | "PENDING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED"
  | "FAILED"
  | "CANCELLED";

export type ChannelType =
  | "WEBSITE"
  | "MOBILE_APP"
  | "DELIVERY_APP"
  | "WHATSAPP"
  | "PHONE"
  | "POS"
  | "KIOSK"
  | "API"
  | "CSV_IMPORT"
  | "MANUAL";

export type ServicePeriod = "breakfast" | "lunch" | "dinner" | "late_night" | "between_services";

export interface CanonicalCustomer {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  isVip?: boolean;
  visitCount?: number;
  notes?: string;
}

export interface CanonicalOrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category?: string;
  specialInstructions?: string;
}

export interface CanonicalPricing {
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  deliveryFee: number;
  serviceFee?: number;
  tip?: number;
  grandTotal: number;
  currency: string;
}

export interface CanonicalPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  amount: number;
  change?: number;
}

export interface CanonicalDelivery {
  type: OrderType;
  provider?: string;
  estimatedMinutes?: number;
}

export interface CanonicalRestaurantRef {
  id: string;
  name: string;
  branchId?: string;
}

export interface CanonicalChannel {
  type: ChannelType;
  name: string;
  version?: string;
}

export interface CanonicalSource {
  provider: string;
  applicationId: string;
  applicationVersion?: string;
  environment: "PRODUCTION" | "STAGING" | "TEST";
}

export interface CanonicalTimestamps {
  orderedAt: string;
  ingestedAt: string;
  confirmedAt?: string;
  preparedAt?: string;
  readyAt?: string;
  completedAt?: string;
  cancelledAt?: string;
}

export interface CanonicalAnalytics {
  sourceLocale: string;
  convertedAt: string;
  adapterVersion: string;
  processingTimeMs: number;
  dayOfWeek: string;
  hourOfDay: number;
  servicePeriod: ServicePeriod;
  season: string;
  isHoliday: boolean;
  tags?: string[];
}

export interface CanonicalOrderEvent {
  orderId: string;
  requestId?: string;
  version: string;
  status: OrderStatus;
  type: OrderType;
  customer: CanonicalCustomer;
  items: CanonicalOrderItem[];
  pricing: CanonicalPricing;
  payment: CanonicalPayment;
  delivery: CanonicalDelivery;
  restaurant: CanonicalRestaurantRef;
  channel: CanonicalChannel;
  source: CanonicalSource;
  timestamps: CanonicalTimestamps;
  analytics: CanonicalAnalytics;
  metadata?: Record<string, unknown>;
}

export interface RuntimeReceiveResult {
  orderId: string;
  observationId: string;
  requestId?: string;
}
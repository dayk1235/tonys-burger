import { NextResponse } from "next/server";
import { getRuntime } from "@/core/runtime/RuntimeSingleton";
import type {
  CanonicalAnalytics,
  CanonicalOrderEvent,
  CanonicalOrderItem,
  ServicePeriod,
} from "@/core/runtime/CanonicalOrderEvent";
import { BUSINESS_CONFIG } from "@/config/business";

/* ─── Types ────────────────────────────────────────────────────────── */

interface OrderItem {
  id: string;
  quantity: number;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

interface OrderPayload {
  requestId?: string;
  items: OrderItem[];
  customer: CustomerInfo;
}

/* ─── In-Memory Deduplication ──────────────────────────────────────── */

const processedIds = new Map<string, { processedAt: string }>();

const MAX_DEDUP_SIZE = 10_000;

function isDuplicate(requestId: string): boolean {
  return processedIds.has(requestId);
}

function markProcessed(requestId: string): void {
  if (processedIds.size >= MAX_DEDUP_SIZE) {
    const oldestKey = processedIds.keys().next().value;
    if (oldestKey !== undefined) {
      processedIds.delete(oldestKey);
    }
  }
  processedIds.set(requestId, { processedAt: new Date().toISOString() });
}

/* ─── Validation ───────────────────────────────────────────────────── */

function isOrderPayload(data: unknown): data is OrderPayload {
  if (typeof data !== "object" || data === null) return false;

  const candidate = data as Record<string, unknown>;

  if (!Array.isArray(candidate.items) || candidate.items.length === 0) return false;

  for (const item of candidate.items) {
    if (typeof item !== "object" || item === null) return false;
    const i = item as Record<string, unknown>;
    if (typeof i.id !== "string" || i.id.trim().length === 0) return false;
    if (typeof i.quantity !== "number" || !Number.isInteger(i.quantity) || i.quantity < 1) return false;
  }

  if (typeof candidate.customer !== "object" || candidate.customer === null) return false;

  const c = candidate.customer as Record<string, unknown>;
  if (typeof c.name !== "string" || c.name.trim().length === 0) return false;
  if (typeof c.phone !== "string" || c.phone.trim().length === 0) return false;

  return true;
}

/* ─── Canonical Order Event Builder ────────────────────────────────── */

const RESTAURANT_ID = "tonys-burger";
const CANONICAL_VERSION = "1.0.0";

function formatItemName(itemId: string): string {
  return itemId
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function deriveServicePeriod(hour: number): ServicePeriod {
  if (hour >= 6 && hour < 11) return "breakfast";
  if (hour >= 11 && hour < 16) return "lunch";
  if (hour >= 16 && hour < 22) return "dinner";
  if (hour >= 22 || hour < 2) return "late_night";
  return "between_services";
}

function deriveSeason(month: number): string {
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "autumn";
  return "winter";
}

function buildAnalytics(orderedAt: string, ingestedAt: string): CanonicalAnalytics {
  const orderedDate = new Date(orderedAt);
  const ingestedDate = new Date(ingestedAt);
  const hour = orderedDate.getUTCHours();

  return {
    sourceLocale: "es-MX",
    convertedAt: ingestedAt,
    adapterVersion: "orders-api-v1.0.0",
    processingTimeMs: Math.max(0, ingestedDate.getTime() - orderedDate.getTime()),
    dayOfWeek: orderedDate.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" }),
    hourOfDay: hour,
    servicePeriod: deriveServicePeriod(hour),
    season: deriveSeason(orderedDate.getUTCMonth()),
    isHoliday: false,
  };
}

function buildCanonicalItems(items: OrderItem[]): CanonicalOrderItem[] {
  return items.map((item) => ({
    id: item.id,
    name: formatItemName(item.id),
    quantity: item.quantity,
    unitPrice: 0,
    totalPrice: 0,
  }));
}

function buildCanonicalOrderEvent(payload: OrderPayload): CanonicalOrderEvent {
  const orderedAt = new Date().toISOString();
  const ingestedAt = new Date().toISOString();
  const items = buildCanonicalItems(payload.items);

  return {
    orderId: `ord-api-${crypto.randomUUID()}`,
    requestId: payload.requestId,
    version: CANONICAL_VERSION,
    status: "PENDING",
    type: "TAKEOUT",
    customer: {
      name: payload.customer.name,
      phone: payload.customer.phone,
    },
    items,
    pricing: {
      subtotal: 0,
      discountTotal: 0,
      taxTotal: 0,
      deliveryFee: 0,
      grandTotal: 0,
      currency: "MXN",
    },
    payment: {
      method: "CASH",
      status: "PENDING",
      amount: 0,
    },
    delivery: {
      type: "TAKEOUT",
    },
    restaurant: {
      id: RESTAURANT_ID,
      name: BUSINESS_CONFIG.name,
    },
    channel: {
      type: "API",
      name: "Orders API",
    },
    source: {
      provider: "orders-api",
      applicationId: "restaurant-os-orders-api",
      environment: "PRODUCTION",
    },
    timestamps: {
      orderedAt,
      ingestedAt,
    },
    analytics: buildAnalytics(orderedAt, ingestedAt),
  };
}

/* ─── POST /api/orders ─────────────────────────────────────────────── */

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: unknown = await request.json();

    if (!isOrderPayload(body)) {
      return NextResponse.json(
        { error: "Invalid payload structure. Expected { items: { id, quantity }[], customer: { name, phone } }" },
        { status: 400 },
      );
    }

    const payload = body as OrderPayload;

    if (payload.requestId && isDuplicate(payload.requestId)) {
      const record = processedIds.get(payload.requestId)!;
      return NextResponse.json(
        {
          received: true,
          duplicate: true,
          items: payload.items.length,
          customer: payload.customer.name,
          processedAt: record.processedAt,
          message: "This request was already processed.",
        },
        { status: 200 },
      );
    }

    const canonicalEvent = buildCanonicalOrderEvent(payload);
    const runtime = await getRuntime();
    const result = await runtime.receive(canonicalEvent);

    if (payload.requestId) {
      markProcessed(payload.requestId);
    }

    return NextResponse.json(
      {
        received: true,
        orderId: result.orderId,
        observationId: result.observationId,
        items: payload.items.length,
        customer: payload.customer.name,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: `Failed to process order: ${message}` }, { status: 500 });
  }
}
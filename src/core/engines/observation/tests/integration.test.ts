/**
 * @file integration.test.ts
 * @description Integration tests for ObservationEngine running inside mock Runtime environments,
 * with concrete restaurant examples.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { ObservationEngine } from "../ObservationEngine";
import { ObservationCategory, Observation } from "../ObservationTypes";
import { 
  RuntimeEventBus, 
  ContextBus, 
  AuditPipeline, 
  RecoveryPipeline 
} from "../ObservationContracts";

// Mock Runtime Implementations
class MockEventBus implements RuntimeEventBus {
  public events: Array<{ name: string; payload: Record<string, unknown> }> = [];
  async emit(name: string, payload: Record<string, unknown>): Promise<void> {
    this.events.push({ name, payload });
  }
  async subscribe(): Promise<void> {}
}

class MockContextBus implements ContextBus {
  async queryContext(businessId: string, restaurantId?: string): Promise<Awaited<ReturnType<ContextBus["queryContext"]>>> {
    return {
      spatialZone: "kitchen",
      isHoliday: false,
      servicePeriod: "lunch",
      season: "spring",
      staffingLevel: "optimal",
      inventoryAlertsCount: 0,
      activePromotions: ["lunch_special"],
      temperatureCelsius: 22,
      weatherCondition: "sunny"
    };
  }
}

class MockAuditPipeline implements AuditPipeline {
  public logs: string[] = [];
  async recordLog(engine: string, action: string, details: Record<string, unknown>): Promise<void> {
    this.logs.push(`[${engine}] ${action}: ${JSON.stringify(details)}`);
  }
  async recordStateChange(engine: string, from: string, to: string): Promise<void> {
    this.logs.push(`[${engine}] State changed from ${from} to ${to}`);
  }
}

test("Observation Engine — Runs clean integration cycle with restaurant examples", async () => {
  const eventBus = new MockEventBus();
  const contextBus = new MockContextBus();
  const audit = new MockAuditPipeline();
  
  const engine = new ObservationEngine(eventBus, audit, undefined, contextBus);
  
  // Verify Initialized State
  assert.equal(engine.getState(), "INITIALIZED");
  
  // Start Engine
  await engine.start();
  assert.equal(engine.getState(), "RUNNING");
  
  // 1. Example: Restaurant sale
  const saleObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.FINANCIAL,
    source: { id: "pos_1", name: "POS Main Terminal", type: "POS", trustScore: 0.98 },
    payload: { amount: 48.50, item: "Double Truffle Burger Combo", orderId: "ord_101" }
  });
  assert.equal(saleObs.category, ObservationCategory.FINANCIAL);
  assert.equal(saleObs.payload.amount, 48.50);
  assert.equal(saleObs.context.temporal.servicePeriod, "lunch"); // verified enricher queried Context Bus

  // 2. Example: Inventory movement
  const invObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.INVENTORY,
    source: { id: "smart_fridge_1", name: "Kitchen Smart Fridge", type: "IOT_SENSOR", trustScore: 0.90 },
    payload: { itemSku: "sku-patty-beef", level: 120, quantityChange: -10 }
  });
  assert.equal(invObs.category, ObservationCategory.INVENTORY);
  assert.equal(invObs.payload.level, 120);

  // 3. Example: Employee check-in
  const empObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.EMPLOYEE,
    source: { id: "clock_in_terminal", name: "Staff Biometric Clock", type: "IOT_SENSOR", trustScore: 0.99 },
    payload: { employeeId: "emp_tony_01", action: "clock_in", scheduleTime: "11:00:00" }
  });
  assert.equal(empObs.category, ObservationCategory.EMPLOYEE);
  assert.equal(empObs.payload.action, "clock_in");

  // 4. Example: Customer review
  const reviewObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.CUSTOMER,
    source: { id: "google_places_api", name: "Google Places Feed", type: "ENVIRONMENT_FEED", trustScore: 0.85 },
    payload: { reviewId: "rev_999", rating: 5, author: "John D." }
  });
  assert.equal(reviewObs.category, ObservationCategory.CUSTOMER);
  assert.equal(reviewObs.payload.rating, 5);

  // 5. Example: Supplier delivery
  const supplyObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.SUPPLY_CHAIN,
    source: { id: "supplier_portal", name: "Supplier Portal API", type: "ENVIRONMENT_FEED", trustScore: 0.95 },
    payload: { deliveryId: "del_871", items: ["buns", "onions"], status: "delivered" }
  });
  assert.equal(supplyObs.category, ObservationCategory.SUPPLY_CHAIN);
  assert.equal(supplyObs.payload.status, "delivered");

  // 6. Example: Equipment alert
  const alertObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.OPERATIONAL,
    source: { id: "grill_sensor_4", name: "G1 Grill Sensor", type: "IOT_SENSOR", trustScore: 0.92 },
    payload: { deviceId: "grill_01", event: "temp_threshold_exceeded", tempCelsius: 220 }
  });
  assert.equal(alertObs.category, ObservationCategory.OPERATIONAL);
  assert.equal(alertObs.payload.event, "temp_threshold_exceeded");

  // 7. Example: Weather event
  const weatherObs = await engine.receiveInput({
    businessId: "tony_burgers_main",
    category: ObservationCategory.ENVIRONMENTAL,
    source: { id: "open_weather_api", name: "OpenWeather Engine", type: "ENVIRONMENT_FEED", trustScore: 0.95 },
    payload: { weather: "heavy_rain", precipitationMm: 12 }
  });
  assert.equal(weatherObs.category, ObservationCategory.ENVIRONMENTAL);
  
  // Verify Engine Metrics
  const metricsSnapshot = engine.getMetrics();
  assert.equal(metricsSnapshot.ingestedCount, 7);
  assert.equal(metricsSnapshot.verifiedCount, 7);
  assert.equal(metricsSnapshot.qualityFailedCount, 0);

  // Stop Engine
  await engine.stop();
  assert.equal(engine.getState(), "STOPPED");
});

/**
 * @file ObservationContext.ts
 * @description Context enricher that queries the Runtime Context Bus and maps
 * occurrence timestamps to concrete business temporal variables.
 */

import { Observation, ObservationContextDimensions } from "./ObservationTypes";
import { ContextBus } from "./ObservationContracts";

/**
 * Context enrichment coordinator.
 */
export class ObservationContext {
  
  constructor(private readonly contextBus?: ContextBus) {}

  /**
   * Queries the Context Bus and maps the occurrence timestamp to assign full context to an observation.
   */
  public async enrichContext(observation: Observation): Promise<ObservationContextDimensions> {
    const timestampDate = new Date(observation.timestamp);
    
    // Calculate fallback temporal fields locally if Context Bus query fails or is absent
    const timeOfDay = timestampDate.toTimeString().split(" ")[0]; // HH:MM:SS
    const dayOfWeek = this.getDayOfWeekString(timestampDate.getDay());
    
    // Month-based season mapping
    const month = timestampDate.getMonth();
    let season: "spring" | "summer" | "autumn" | "winter" = "spring";
    if (month >= 5 && month <= 7) season = "summer";
    else if (month >= 8 && month <= 10) season = "autumn";
    else if (month === 11 || month <= 1) season = "winter";

    // Hour-based service period mapping
    const hours = timestampDate.getHours();
    let servicePeriod: "breakfast" | "lunch" | "dinner" | "late_night" | "between_services" = "lunch";
    if (hours >= 6 && hours < 11) servicePeriod = "breakfast";
    else if (hours >= 11 && hours < 16) servicePeriod = "lunch";
    else if (hours >= 16 && hours < 17) servicePeriod = "between_services";
    else if (hours >= 17 && hours < 22) servicePeriod = "dinner";
    else servicePeriod = "late_night";

    let spatialZone: "dining_room" | "kitchen" | "bar" | "takeout_counter" | "delivery_zone" | "offsite" | "unknown" = "unknown";
    let isHoliday = false;
    let staffingLevel: "understaffed" | "optimal" | "overstaffed" = "optimal";
    let inventoryAlertsCount = 0;
    let activePromotions: string[] = [];
    let temperatureCelsius: number | undefined;
    let weatherCondition: "sunny" | "rainy" | "snowy" | "cloudy" | "stormy" | "windy" | undefined;
    let localEventsNearRestaurant: string[] = [];

    // Query external context bus if available
    if (this.contextBus) {
      try {
        const extContext = await this.contextBus.queryContext(observation.businessId, observation.restaurantId);
        spatialZone = extContext.spatialZone as typeof spatialZone;
        isHoliday = extContext.isHoliday;
        servicePeriod = extContext.servicePeriod;
        season = extContext.season;
        staffingLevel = extContext.staffingLevel;
        inventoryAlertsCount = extContext.inventoryAlertsCount;
        activePromotions = extContext.activePromotions;
        temperatureCelsius = extContext.temperatureCelsius;
        weatherCondition = extContext.weatherCondition;
      } catch (err) {
        // Fallback silently to local calculations to maintain resilience
      }
    }

    // Map spatial context from payload if available
    if (observation.payload.zone) {
      const zonePayload = String(observation.payload.zone).toLowerCase();
      if (["dining_room", "kitchen", "bar", "takeout_counter", "delivery_zone", "offsite"].includes(zonePayload)) {
        spatialZone = zonePayload as typeof spatialZone;
      }
    }

    return {
      spatial: {
        locationId: observation.restaurantId || "unknown",
        zone: spatialZone,
        coordinates: observation.payload.coordinates ? (observation.payload.coordinates as { x: number; y: number }) : undefined
      },
      temporal: {
        timeOfDay,
        dayOfWeek,
        isHoliday,
        servicePeriod,
        season
      },
      behavior: {
        actorId: observation.payload.actorId ? String(observation.payload.actorId) : undefined,
        actorType: observation.payload.actorType as "customer" | "employee" | "owner" | "system" | undefined,
        actionType: observation.payload.action ? String(observation.payload.action) : "none",
        observedImpact: observation.payload.impact ? String(observation.payload.impact) : "none"
      },
      operational: {
        activeMenuId: observation.payload.menuId ? String(observation.payload.menuId) : undefined,
        staffingLevel,
        inventoryAlertsCount,
        activePromotions
      },
      environmental: {
        temperatureCelsius,
        weatherCondition,
        localEventsNearRestaurant
      }
    };
  }

  private getDayOfWeekString(dayIndex: number): "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday" {
    const days: Array<"Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"> = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];
    return days[dayIndex] || "Monday";
  }
}

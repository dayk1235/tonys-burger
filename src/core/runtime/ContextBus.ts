import { ContextBusError } from "./RuntimeErrors";

interface ContextValue {
  value: unknown;
  timestamp: string;
  ttl: number;
  source: string;
}

interface ContextSubscription {
  key: string;
  handler: (key: string, value: unknown) => Promise<void>;
}

export interface ContextQueryResult {
  spatialZone: string;
  isHoliday: boolean;
  servicePeriod: "breakfast" | "lunch" | "dinner" | "late_night" | "between_services";
  season: "spring" | "summer" | "autumn" | "winter";
  staffingLevel: "understaffed" | "optimal" | "overstaffed";
  inventoryAlertsCount: number;
  activePromotions: string[];
  temperatureCelsius?: number;
  weatherCondition?: "sunny" | "rainy" | "snowy" | "cloudy" | "stormy" | "windy";
}

export class ContextBusImpl {
  private store: Map<string, ContextValue> = new Map();
  private subscriptions: ContextSubscription[] = [];

  async set(key: string, value: unknown, source = "runtime", ttl = 0): Promise<void> {
    if (!key || key.trim().length === 0) {
      throw new ContextBusError("key is required");
    }

    const entry: ContextValue = {
      value,
      timestamp: new Date().toISOString(),
      ttl,
      source,
    };

    this.store.set(key, entry);
    await this.notifySubscribers(key, value);
  }

  async get<T = unknown>(key: string): Promise<T | undefined> {
    const entry = this.store.get(key);
    if (!entry) return undefined;

    if (entry.ttl > 0) {
      const age = Date.now() - new Date(entry.timestamp).getTime();
      if (age > entry.ttl) {
        this.store.delete(key);
        return undefined;
      }
    }

    return entry.value as T;
  }

  async has(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== undefined;
  }

  async delete(key: string): Promise<boolean> {
    return this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async queryContext(businessId: string, _restaurantId?: string): Promise<ContextQueryResult> {
    const spatialZone = await this.get<string>(`${businessId}:spatialZone`) ?? "kitchen";
    const isHoliday = await this.get<boolean>(`${businessId}:isHoliday`) ?? false;
    const servicePeriodRaw = await this.get<string>(`${businessId}:servicePeriod`);
    const seasonRaw = await this.get<string>(`${businessId}:season`);
    const staffingLevelRaw = await this.get<string>(`${businessId}:staffingLevel`);
    const inventoryAlertsCount = await this.get<number>(`${businessId}:inventoryAlertsCount`) ?? 0;
    const activePromotions = await this.get<string[]>(`${businessId}:activePromotions`) ?? [];

    const validServicePeriods: ContextQueryResult["servicePeriod"][] = ["breakfast", "lunch", "dinner", "late_night", "between_services"];
    const servicePeriod: ContextQueryResult["servicePeriod"] = validServicePeriods.includes(servicePeriodRaw as ContextQueryResult["servicePeriod"])
      ? (servicePeriodRaw as ContextQueryResult["servicePeriod"])
      : "lunch";

    const validSeasons: ContextQueryResult["season"][] = ["spring", "summer", "autumn", "winter"];
    const season: ContextQueryResult["season"] = validSeasons.includes(seasonRaw as ContextQueryResult["season"])
      ? (seasonRaw as ContextQueryResult["season"])
      : "spring";

    const validStaffingLevels: ContextQueryResult["staffingLevel"][] = ["understaffed", "optimal", "overstaffed"];
    const staffingLevel: ContextQueryResult["staffingLevel"] = validStaffingLevels.includes(staffingLevelRaw as ContextQueryResult["staffingLevel"])
      ? (staffingLevelRaw as ContextQueryResult["staffingLevel"])
      : "optimal";

    const temperatureCelsius = await this.get<number>(`${businessId}:temperatureCelsius`);
    const weatherRaw = await this.get<string>(`${businessId}:weatherCondition`);
    const validWeathers: ContextQueryResult["weatherCondition"][] = ["sunny", "rainy", "snowy", "cloudy", "stormy", "windy"];
    const weatherCondition: ContextQueryResult["weatherCondition"] | undefined = validWeathers.includes(weatherRaw as ContextQueryResult["weatherCondition"])
      ? (weatherRaw as ContextQueryResult["weatherCondition"])
      : undefined;

    return {
      spatialZone,
      isHoliday,
      servicePeriod,
      season,
      staffingLevel,
      inventoryAlertsCount,
      activePromotions,
      temperatureCelsius,
      weatherCondition,
    };
  }

  async subscribe(key: string, handler: (key: string, value: unknown) => Promise<void>): Promise<void> {
    this.subscriptions.push({ key, handler });
  }

  async unsubscribe(key: string, handler: (key: string, value: unknown) => Promise<void>): Promise<void> {
    this.subscriptions = this.subscriptions.filter(
      (s) => !(s.key === key && s.handler === handler)
    );
  }

  private async notifySubscribers(changedKey: string, value: unknown): Promise<void> {
    for (const sub of this.subscriptions) {
      if (sub.key === changedKey || sub.key === "*") {
        try {
          await sub.handler(changedKey, value);
        } catch {
          // subscriber errors are swallowed to avoid cascading failures
        }
      }
    }
  }

  size(): number {
    return this.store.size;
  }
}

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import type { AnalyticsEvent, AnalyticsProvider } from "@/features/analytics/types";

const DATA_DIR = join(process.cwd(), "data", "analytics");
const DATA_FILE = join(DATA_DIR, "events.json");

function ensureDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function initFile(): void {
  ensureDir();
  if (!existsSync(DATA_FILE)) {
    writeFileSync(DATA_FILE, "[]", "utf-8");
  }
}

function readEvents(): AnalyticsEvent[] {
  try {
    initFile();
    const raw = readFileSync(DATA_FILE, "utf-8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeEvents(events: AnalyticsEvent[]): void {
  ensureDir();
  writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), "utf-8");
}

export class JsonAnalyticsProvider implements AnalyticsProvider {
  track(event: AnalyticsEvent): void {
    const events = readEvents();
    events.push(event);
    writeEvents(events);
  }

  getStoredEvents(): AnalyticsEvent[] {
    return readEvents();
  }

  clearEvents(): void {
    writeEvents([]);
  }
}

export const jsonAnalyticsProvider = new JsonAnalyticsProvider();

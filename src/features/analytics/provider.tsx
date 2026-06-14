"use client";

import { createContext, useContext, useMemo } from "react";
import type { AnalyticsEvent, AnalyticsProvider } from "./types";

function getDeviceType(): AnalyticsEvent["device_type"] {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("analytics_session_id");
  if (!id) {
    id = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem("analytics_session_id", id);
  }
  return id;
}

const STORAGE_KEY = "analytics_events";
const MAX_EVENTS = 500;
const TRACK_URL = "/api/analytics/track";

function postBatch(events: AnalyticsEvent[]): void {
  fetch(TRACK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
  }).catch(() => {
    // silently drop — analytics must never block UI
  });
}

class LocalAnalyticsProvider implements AnalyticsProvider {
  private buffer: AnalyticsEvent[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly FLUSH_INTERVAL = 2000;

  track(event: AnalyticsEvent): void {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${event.event_name}`, event.metadata);
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored: unknown[] = raw ? JSON.parse(raw) : [];
      stored.push(event);
      if (stored.length > MAX_EVENTS) {
        stored.splice(0, stored.length - MAX_EVENTS);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // localStorage full or unavailable — silently drop
    }

    this.buffer.push(event);
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
    }
  }

  private flush(): void {
    this.flushTimer = null;
    if (this.buffer.length === 0) return;
    const batch = this.buffer.splice(0);
    postBatch(batch);
  }

  getStoredEvents(): AnalyticsEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  clearEvents(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // noop
    }
  }
}

const AnalyticsContext = createContext<AnalyticsProvider | null>(null);

export function AnalyticsRootProvider({ children }: { children: React.ReactNode }) {
  const provider = useMemo(() => new LocalAnalyticsProvider(), []);
  return (
    <AnalyticsContext.Provider value={provider}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsProvider {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error("useAnalytics must be used within AnalyticsRootProvider");
  return ctx;
}

export function createEvent(
  event_name: AnalyticsEvent["event_name"],
  metadata: AnalyticsEvent["metadata"] = {}
): AnalyticsEvent {
  return {
    event_name,
    timestamp: Date.now(),
    session_id: getSessionId(),
    device_type: getDeviceType(),
    metadata,
  };
}

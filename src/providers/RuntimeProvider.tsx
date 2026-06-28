"use client";

import { useEffect } from "react";
import { initRuntime } from "@/core/runtime/RuntimeSingleton";

export function RuntimeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initRuntime().catch((err) => {
      console.error("[RuntimeProvider] Failed to initialize Runtime:", err);
    });
  }, []);

  return <>{children}</>;
}

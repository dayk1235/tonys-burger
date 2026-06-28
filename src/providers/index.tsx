"use client";

import { type ReactNode } from "react";
import { LocalizationProvider } from "@/localization";
import { ExperienceProvider } from "@/experience";
import { LivingBackgroundProvider } from "@/features/living-background";
import { RuntimeProvider } from "./RuntimeProvider";

/**
 * Providers — Application Providers Wrapper
 *
 * Central location for all application-level providers.
 * Order matters — providers that depend on other providers
 * must be nested inside their dependencies.
 *
 * Order: Runtime → Localization → Experience → LivingBackground
 */

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <RuntimeProvider>
      <LocalizationProvider>
        <ExperienceProvider>
          <LivingBackgroundProvider>
            {children}
          </LivingBackgroundProvider>
        </ExperienceProvider>
      </LocalizationProvider>
    </RuntimeProvider>
  );
}

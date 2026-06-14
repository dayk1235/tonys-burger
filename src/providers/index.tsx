"use client";

import { type ReactNode } from "react";

/**
 * Providers — Application Providers Wrapper
 *
 * PLACEHOLDER: This is a scaffold for future providers.
 * Add providers here as they are implemented:
 * - ThemeProvider (dark/light mode)
 * - CartProvider (shopping cart state)
 * - ChatProvider (chatbot state)
 */

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}

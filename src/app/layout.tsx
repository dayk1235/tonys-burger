import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { AnalyticsRootProvider, AnalyticsTracker } from "@/features/analytics";
import { LivingBackground } from "@/features/living-background";
import { Providers } from "@/providers";
import { PLACEHOLDER } from "@/content/placeholders";
import { BUSINESS_CONFIG } from "@/config/business";
import "./globals.css";

/**
 * Root Layout — Application Shell
 *
 * This is the top-level layout that wraps all pages.
 * It includes:
 * - Font loading (Inter + Bebas Neue via Google Fonts)
 * - Global providers
 * - Navigation and footer
 * - Metadata for SEO (placeholder values)
 *
 * Note: Replace Google Fonts with self-hosted fonts
 * for production to eliminate external requests.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS_CONFIG.name,
    template: `%s | ${BUSINESS_CONFIG.name}`,
  },
  description: PLACEHOLDER.SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${playfairDisplay.variable} dark experience-morning`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-bg font-sans text-text-primary antialiased">
        <LivingBackground />
        <div className="relative z-0">
          <AnalyticsRootProvider>
            <AnalyticsTracker />
            <Providers>
              <LayoutShell>{children}</LayoutShell>
            </Providers>
          </AnalyticsRootProvider>
        </div>
      </body>
    </html>
  );
}

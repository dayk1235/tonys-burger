"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingCta } from "@/components/ui/FloatingCta";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");
  const isDemo = pathname.startsWith("/demo");

  // Demo and Dashboard have their own layouts — no navbar, footer, or chrome
  if (isDashboard || isDemo) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <FloatingCta />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

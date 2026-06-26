"use client";

import { useState } from "react";
import { Sidebar } from "@/features/dashboard/components/Sidebar";
import { Topbar } from "@/features/dashboard/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-60">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main>{children}</main>
      </div>
    </div>
  );
}

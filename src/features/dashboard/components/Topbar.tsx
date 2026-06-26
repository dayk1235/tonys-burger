"use client";

import { Menu, Search, Bell, User } from "lucide-react";
import { DemoBadge } from "./DemoBadge";
import { LocalizationSettings } from "@/localization/components/LocalizationSettings";
import { ExperienceSelector } from "@/experience/components/ExperienceSelector";
import { useTranslation } from "@/localization";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-sticky border-b border-border bg-bg/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex size-9 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary lg:hidden"
            aria-label={t("dashboard.topbar.openSidebar")}
          >
            <Menu size={20} />
          </button>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="hidden sm:flex">
            <ol className="flex items-center gap-2 text-sm">
              <li className="text-text-muted">{t("dashboard.topbar.dashboard")}</li>
              <li className="text-text-muted">/</li>
              <li className="font-medium text-text-primary">{t("dashboard.topbar.overview")}</li>
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Appearance selector */}
          <ExperienceSelector />

          {/* Language selector */}
          <LocalizationSettings />

          {/* Search */}
          <button
            className="flex size-9 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary"
            aria-label={t("common.search")}
          >
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button
            className="relative flex size-9 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary"
            aria-label={t("common.notifications")}
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-brand-primary" />
          </button>

          {/* Profile */}
          <button
            className="flex size-9 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary"
            aria-label={t("common.profile")}
          >
            <User size={18} />
          </button>

          <div className="ml-2 hidden sm:block">
            <DemoBadge />
          </div>
        </div>
      </div>
    </header>
  );
}

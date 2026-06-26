"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutDashboard, ShoppingCart, UtensilsCrossed, Users, Store, Truck, Megaphone, Lightbulb, FileText, Bot, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { DASHBOARD_MODULES } from "@/features/dashboard/config";
import { useTranslation } from "@/localization";

const ICON_MAP: Record<string, React.ComponentType<{ size?: number }>> = {
  "layout-dashboard": LayoutDashboard,
  "shopping-cart": ShoppingCart,
  "utensils-crossed": UtensilsCrossed,
  users: Users,
  store: Store,
  truck: Truck,
  megaphone: Megaphone,
  lightbulb: Lightbulb,
  "file-text": FileText,
  bot: Bot,
  settings: Settings,
};

const SIDEBAR_MODULES = DASHBOARD_MODULES.filter((m) =>
  ["overview", "orders", "products", "customers", "branches", "delivery", "marketing", "insights", "reports", "artificial-intelligence", "settings"].includes(m.id)
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t } = useTranslation();
  const pathname = usePathname();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-bg-surface">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-primary">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-text-primary">{t("dashboard.sidebar.title")}</span>
        </Link>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-bg-surface-alt hover:text-text-primary lg:hidden"
          aria-label={t("dashboard.sidebar.close")}
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {SIDEBAR_MODULES.map((mod) => {
            const Icon = ICON_MAP[mod.iconId] ?? LayoutDashboard;
            const isActive = mod.id === "overview"
              ? pathname === "/dashboard"
              : pathname.startsWith(mod.route);

            return (
              <li key={mod.id}>
                <Link
                  href={mod.route}
                  onClick={() => onClose()}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary-light"
                      : "text-text-muted hover:bg-bg-surface-alt hover:text-text-primary"
                  )}
                >
                  <Icon size={18} />
                  <span>{mod.displayName}</span>
                  {mod.id === "insights" && (
                    <span className="ml-auto rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                      {t("dashboard.sidebar.aiBadge")}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        <p className="text-center text-[10px] uppercase tracking-widest text-text-muted">
          {t("dashboard.sidebar.version")}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col">
        <div className="flex grow flex-col border-r border-border bg-bg-surface">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-overlay bg-overlay lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-modal w-72 bg-bg-surface lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

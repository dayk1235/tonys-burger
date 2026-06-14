"use client"

import { cn } from "@/lib/utils"
import { Utensils, Clock, MapPin, Phone, HelpCircle } from "lucide-react"

interface QuickAction {
  label: string
  icon?: "menu" | "hours" | "location" | "phone" | "help"
  action: string
}

const iconMap = {
  menu: Utensils,
  hours: Clock,
  location: MapPin,
  phone: Phone,
  help: HelpCircle,
}

interface QuickActionButtonsProps {
  actions?: QuickAction[]
  onAction?: (action: string) => void
  className?: string
}

const defaultActions: QuickAction[] = [
  { label: "View Menu", icon: "menu", action: "Show me the menu" },
  { label: "Opening Hours", icon: "hours", action: "What are your opening hours?" },
  { label: "Location", icon: "location", action: "Where are you located?" },
  { label: "Contact", icon: "phone", action: "How can I contact you?" },
]

export function QuickActionButtons({
  actions = defaultActions,
  onAction,
  className,
}: QuickActionButtonsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((action) => {
        const Icon = action.icon ? iconMap[action.icon] : HelpCircle
        return (
          <button
            key={action.label}
            type="button"
            onClick={() => onAction?.(action.action)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-border bg-bg px-3 py-1.5",
              "font-sans text-xs text-text-secondary transition-all duration-fast",
              "hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            )}
            aria-label={action.label}
          >
            <Icon size={14} aria-hidden="true" />
            {action.label}
          </button>
        )
      })}
    </div>
  )
}

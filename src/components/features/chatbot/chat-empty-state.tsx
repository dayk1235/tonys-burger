"use client"

import { cn } from "@/lib/utils"
import { Bot } from "lucide-react"
import { QuickActionButtons } from "./quick-action-buttons"

interface ChatEmptyStateProps {
  title?: string
  description?: string
  onAction?: (action: string) => void
  className?: string
}

export function ChatEmptyState({
  title = "Hi there! I'm TonyBot",
  description = "I can help you with our menu, hours, location, and more. How can I assist you today?",
  onAction,
  className,
}: ChatEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center",
        className
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary/10">
        <Bot size={32} className="text-brand-primary" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-heading text-xl tracking-wide text-text-primary">
          {title}
        </h3>
        <p className="font-sans text-sm text-text-secondary">
          {description}
        </p>
      </div>
      <QuickActionButtons onAction={onAction} className="justify-center" />
    </div>
  )
}

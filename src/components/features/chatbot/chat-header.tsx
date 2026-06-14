"use client"

import { cn } from "@/lib/utils"
import { Bot, X } from "lucide-react"

interface ChatHeaderProps {
  title?: string
  subtitle?: string
  onClose?: () => void
  className?: string
}

export function ChatHeader({
  title = "TonyBot",
  subtitle = "How can we help you?",
  onClose,
  className,
}: ChatHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border bg-bg-surface-alt px-4 py-3",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
        <Bot size={20} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="font-heading text-lg tracking-wide text-text-primary truncate">
          {title}
        </h2>
        <p className="font-sans text-xs text-text-muted truncate">
          {subtitle}
        </p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-text-muted transition-colors duration-fast hover:bg-bg-elevated hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      )}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { LoadingDots } from "@/components/ui/loading-dots"

interface ChatLoadingStateProps {
  label?: string
  className?: string
}

export function ChatLoadingState({
  label = "TonyBot is typing",
  className,
}: ChatLoadingStateProps) {
  return (
    <div
      className={cn("flex items-center gap-3 px-4 py-2", className)}
      role="status"
      aria-label={label}
    >
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-bg-surface-alt px-4 py-2.5">
        <LoadingDots size="sm" />
      </div>
      <span className="sr-only">{label}</span>
    </div>
  )
}

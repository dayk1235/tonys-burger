"use client"

import { cn } from "@/lib/utils"
import { MessageCircle, X } from "lucide-react"

interface ChatLauncherProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
  unreadCount?: number
}

export function ChatLauncher({
  isOpen,
  onToggle,
  className,
  unreadCount = 0,
}: ChatLauncherProps) {
  return (
    <div className={cn("fixed bottom-6 right-6 z-toast", className)}>
      {unreadCount > 0 && !isOpen && (
        <div className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white animate-in fade-in zoom-in">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex size-14 items-center justify-center rounded-full shadow-xl transition-all duration-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary",
          isOpen
            ? "bg-bg-surface-alt text-text-primary rotate-90 scale-110"
            : "bg-brand-primary text-white hover:bg-brand-primary-hover hover:shadow-glow-primary"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}

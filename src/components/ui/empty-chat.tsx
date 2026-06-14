import { cn } from "@/lib/utils"
import { MessageCircleOff } from "lucide-react"

interface EmptyChatProps {
  className?: string
  message?: string
  description?: string
}

export function EmptyChat({
  className,
  message = "No messages yet",
  description = "Start a conversation with TonyBot to learn more about our menu and services.",
}: EmptyChatProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6 py-12 text-center",
        className
      )}
      role="status"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-bg-surface-alt">
        <MessageCircleOff size={28} className="text-text-muted" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="font-sans font-medium text-text-primary">{message}</p>
        <p className="font-sans text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  )
}

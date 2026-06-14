"use client"

import { cn } from "@/lib/utils"

export type MessageRole = "user" | "bot" | "system"

interface ChatMessageProps {
  content: string
  role: MessageRole
  timestamp?: string
  className?: string
}

export function ChatMessage({
  content,
  role,
  timestamp,
  className,
}: ChatMessageProps) {
  const isUser = role === "user"
  const isBot = role === "bot"

  return (
    <div
      className={cn(
        "flex w-full gap-2",
        isUser && "justify-end",
        className
      )}
      role="listitem"
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5",
          isUser &&
            "bg-brand-primary text-white rounded-br-md",
          isBot &&
            "bg-bg-surface-alt text-text-primary rounded-bl-md",
          role === "system" &&
            "mx-auto w-full max-w-xs bg-bg-elevated/50 text-center text-xs text-text-muted"
        )}
      >
        <p className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </p>
        {timestamp && (
          <time
            className={cn(
              "mt-1 block font-sans text-[10px]",
              isUser ? "text-white/60" : "text-text-muted"
            )}
          >
            {timestamp}
          </time>
        )}
      </div>
    </div>
  )
}

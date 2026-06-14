"use client"

import { cn } from "@/lib/utils"
import { Send, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

interface ChatInputProps {
  onSend?: (message: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  isTyping?: boolean
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
  className,
  isTyping = false,
}: ChatInputProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || disabled || isTyping) return
    onSend?.(trimmed)
    setValue("")
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t border-border bg-bg-surface-alt px-4 py-3",
        className
      )}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Chat message input"
        className={cn(
          "flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 font-sans text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors duration-fast",
          "focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!value.trim() || disabled || isTyping}
        aria-label="Send message"
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-fast",
          value.trim() && !disabled && !isTyping
            ? "bg-brand-primary text-white hover:bg-brand-primary-hover"
            : "bg-bg-elevated text-text-muted cursor-not-allowed"
        )}
      >
        {isTyping ? (
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
        ) : (
          <Send size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

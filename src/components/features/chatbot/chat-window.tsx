"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"

interface ChatWindowProps {
  children: React.ReactNode
  isOpen: boolean
  className?: string
}

export function ChatWindow({
  children,
  isOpen,
  className,
}: ChatWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          const closeEvent = new CustomEvent("chat-close-request")
          window.dispatchEvent(closeEvent)
        }
      }
      window.addEventListener("keydown", handleEscape)
      return () => window.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Chat with TonyBot"
      aria-modal="true"
      className={cn(
        "fixed bottom-24 right-6 z-overlay flex w-[calc(100vw-2rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-normal",
        "h-[600px] max-h-[calc(100vh-10rem)]",
        className
      )}
    >
      {children}
    </div>
  )
}

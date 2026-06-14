import { cn } from "@/lib/utils"

interface SectionBackgroundProps {
  children: React.ReactNode
  className?: string
  pattern?: "none" | "dots" | "grid"
  overlay?: boolean
}

export function SectionBackground({
  children,
  className,
  pattern = "none",
  overlay = false,
}: SectionBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      {pattern === "dots" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
          aria-hidden="true"
        />
      )}
      {pattern === "grid" && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-text-primary) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
          aria-hidden="true"
        />
      )}
      {overlay && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg"
          aria-hidden="true"
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}

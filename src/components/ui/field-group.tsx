import { cn } from "@/lib/utils"

interface FieldGroupProps {
  children: React.ReactNode
  className?: string
  orientation?: "vertical" | "horizontal"
}

export function FieldGroup({
  children,
  className,
  orientation = "vertical",
}: FieldGroupProps) {
  return (
    <div
      className={cn(
        orientation === "vertical" ? "flex flex-col gap-4" : "flex flex-wrap items-end gap-4",
        className
      )}
      role="group"
    >
      {children}
    </div>
  )
}

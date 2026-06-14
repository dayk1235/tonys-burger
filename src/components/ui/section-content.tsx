import { cn } from "@/lib/utils"

interface SectionContentProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "narrow" | "default" | "wide"
  columns?: 1 | 2 | 3 | 4
}

const maxWidthMap = {
  narrow: "max-w-container-narrow",
  default: "max-w-container-max",
  wide: "max-w-container-wide",
}

const columnMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
}

export function SectionContent({
  children,
  className,
  maxWidth = "default",
  columns,
}: SectionContentProps) {
  const Component = columns ? "div" : "div"

  return (
    <Component
      className={cn(
        "mx-auto",
        maxWidthMap[maxWidth],
        columns && `grid gap-6 md:gap-8 ${columnMap[columns]}`,
        !columns && "space-y-6",
        className
      )}
    >
      {children}
    </Component>
  )
}

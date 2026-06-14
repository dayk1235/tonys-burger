import { cn } from "@/lib/utils"

interface SectionSkeletonProps {
  className?: string
  hasHeader?: boolean
  columns?: 1 | 2 | 3 | 4
}

export function SectionSkeleton({
  className,
  hasHeader = true,
  columns = 1,
}: SectionSkeletonProps) {
  const columnGrid = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }

  return (
    <div
      className={cn("py-16 md:py-20 lg:py-24", className)}
      aria-hidden="true"
    >
      {hasHeader && (
        <div className="mx-auto mb-12 max-w-xl space-y-4 text-center md:mb-16">
          <div className="mx-auto h-10 w-64 animate-pulse rounded bg-bg-surface-alt md:h-12 md:w-80" />
          <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-bg-surface-alt" />
          <div className="mx-auto mt-6 h-1 w-16 animate-pulse rounded-full bg-bg-surface-alt" />
        </div>
      )}
      <div className={cn("mx-auto grid max-w-container-max gap-6 px-4 md:gap-8 md:px-6 lg:px-8", columnGrid[columns])}>
        {Array.from({ length: columns }, (_, i) => (
          <div
            key={i}
            className="aspect-video animate-pulse rounded-xl bg-bg-surface-alt"
          />
        ))}
      </div>
    </div>
  )
}

import { cn } from "@/lib/utils"

interface GalleryCardSkeletonProps {
  className?: string
  aspectRatio?: "square" | "video" | "portrait"
}

const aspectRatioMap = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
}

export function GalleryCardSkeleton({
  className,
  aspectRatio = "square",
}: GalleryCardSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-bg-surface",
        aspectRatioMap[aspectRatio],
        className
      )}
      aria-hidden="true"
    >
      <div className="h-full w-full animate-pulse bg-bg-surface-alt" />
    </div>
  )
}

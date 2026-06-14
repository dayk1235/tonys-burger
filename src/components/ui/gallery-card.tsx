"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Eye } from "lucide-react"

interface GalleryCardProps {
  src: string
  alt: string
  className?: string
  caption?: string
  aspectRatio?: "square" | "video" | "portrait"
  onView?: () => void
}

const aspectRatioMap = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
}

export function GalleryCard({
  src,
  alt,
  className,
  caption,
  aspectRatio = "square",
  onView,
}: GalleryCardProps) {
  return (
    <figure
      className={cn(
        "group/card relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-bg-surface shadow-sm transition-all duration-normal hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-primary/5",
        aspectRatioMap[aspectRatio],
        className
      )}
      onClick={onView}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onView?.()
        }
      }}
      aria-label={caption ?? alt}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-slow group-hover/card:scale-110"
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-normal group-hover/card:opacity-100" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-normal group-hover/card:opacity-100">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-primary/90 text-white shadow-lg">
          <Eye size={20} />
        </div>
      </div>
      {caption && (
        <figcaption className="absolute right-0 bottom-0 left-0 p-5 pt-12 text-sm font-medium text-white opacity-0 transition-opacity duration-normal group-hover/card:opacity-100">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

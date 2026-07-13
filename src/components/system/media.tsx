import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { cn } from "@/utils";
import type { MediaAsset } from "@/types";

/**
 * ImageCard displays a responsive image with optional caption.
 *
 * @example
 * <ImageCard image={{ src: "/photo.jpg", alt: "Community meeting" }} caption="Community dialogue" />
 */
export function ImageCard({ image, caption, className }: { image: MediaAsset; caption?: string; className?: string }) {
  return (
    <figure className={cn("overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800", className)}>
      <div className="relative aspect-[4/3] bg-neutral-100">
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
      </div>
      {caption && <figcaption className="p-4 text-sm text-neutral-600 dark:text-neutral-300">{caption}</figcaption>}
    </figure>
  );
}

/**
 * GalleryGrid arranges images into a responsive gallery.
 *
 * @example
 * <GalleryGrid images={[{ src: "/a.jpg", alt: "A" }]} />
 */
export function GalleryGrid({ images, className }: { images: MediaAsset[]; className?: string }) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {images.map((image) => (
        <ImageCard key={`${image.src}-${image.alt}`} image={image} />
      ))}
    </div>
  );
}

/**
 * VideoCard displays a video thumbnail and play action.
 *
 * @example
 * <VideoCard title="RHARK story" thumbnail={{ src: "/thumb.jpg", alt: "Video thumbnail" }} href="https://..." />
 */
export function VideoCard({ title, thumbnail, href, duration }: { title: string; thumbnail: MediaAsset; href: string; duration?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition hover:shadow-lg dark:bg-neutral-900 dark:ring-neutral-800">
      <div className="relative aspect-video bg-neutral-100">
        <Image src={thumbnail.src} alt={thumbnail.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/30">
          <PlayCircle className="text-white transition group-hover:scale-105" size={56} aria-hidden="true" />
        </div>
        {duration && <span className="absolute bottom-3 right-3 rounded bg-neutral-950/80 px-2 py-1 text-xs font-bold text-white">{duration}</span>}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-bold text-neutral-950 dark:text-white">{title}</h3>
      </div>
    </a>
  );
}

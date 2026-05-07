"use client";

import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContentImage } from "@/components/shared/content-image";

type LightboxImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  fill?: boolean;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
};

export function LightboxImage({
  src,
  alt,
  wrapperClassName,
  imageClassName,
  sizes,
  quality,
  priority,
  fill = true,
  intrinsicWidth,
  intrinsicHeight,
}: LightboxImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={wrapperClassName || "relative block h-full w-full cursor-zoom-in overflow-hidden"}
          aria-label={`Open image: ${alt}`}
        >
          <ContentImage
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            quality={quality}
            priority={priority}
            className={imageClassName}
            intrinsicWidth={intrinsicWidth}
            intrinsicHeight={intrinsicHeight}
          />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton
        className="max-w-6xl border-white/10 bg-black p-3 text-white shadow-2xl sm:p-4"
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative max-h-[82vh] overflow-hidden rounded-lg bg-black">
          <ContentImage
            src={src}
            alt={alt}
            className="max-h-[82vh] w-full object-contain"
            intrinsicWidth={intrinsicWidth ?? 1600}
            intrinsicHeight={intrinsicHeight ?? 1000}
            priority
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

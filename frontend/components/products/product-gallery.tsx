"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-[4/5] items-center justify-center rounded-md bg-surface-muted text-text-muted">
        No image available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse sm:gap-4">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden rounded-md bg-surface-muted">
        <Image
          key={active.id}
          src={active.url}
          alt={active.altText ?? productName}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:w-20 sm:flex-col sm:overflow-visible">
          {sorted.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${sorted.length}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-surface-muted ring-1 ring-transparent transition-all sm:h-20 sm:w-20",
                index === activeIndex && "ring-2 ring-accent"
              )}
            >
              <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

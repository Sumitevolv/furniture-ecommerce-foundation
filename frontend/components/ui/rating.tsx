"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps {
  value: number;
  count?: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

const sizeMap = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };

export function Rating({
  value,
  count,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: RatingProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const displayValue = hovered ?? value;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div
        className="flex items-center"
        role={interactive ? "radiogroup" : "img"}
        aria-label={interactive ? "Rate this product" : `Rated ${value.toFixed(1)} out of ${maxStars} stars`}
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const starValue = i + 1;
          const filled = starValue <= Math.round(displayValue);
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              aria-label={interactive ? `${starValue} star${starValue > 1 ? "s" : ""}` : undefined}
              onClick={() => interactive && onChange?.(starValue)}
              onMouseEnter={() => interactive && setHovered(starValue)}
              onMouseLeave={() => interactive && setHovered(null)}
              className={cn(!interactive && "cursor-default", "focus-visible:outline-none")}
            >
              <Star
                className={cn(
                  sizeMap[size],
                  filled ? "fill-bronze text-bronze" : "fill-transparent text-border-strong"
                )}
              />
            </button>
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-text-muted">({count.toLocaleString()})</span>
      )}
    </div>
  );
}

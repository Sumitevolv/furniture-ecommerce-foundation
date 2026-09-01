"use client";

import * as React from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];

interface CarouselContextValue {
  api: CarouselApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel subcomponents must be used within <Carousel>");
  return ctx;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, children, loop = false, ...props }, ref) => {
    const [emblaRef, api] = useEmblaCarousel({ loop, align: "start" });
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((emblaApi: NonNullable<CarouselApi>) => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    }, []);

    React.useEffect(() => {
      if (!api) return;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from the embla instance, not derivable during render
      onSelect(api);
      api.on("select", onSelect);
      api.on("reInit", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

    return (
      <CarouselContext.Provider value={{ api, canScrollPrev, canScrollNext, scrollPrev, scrollNext }}>
        <div
          ref={ref}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          <div ref={emblaRef} className="overflow-hidden">
            {children}
          </div>
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex -ml-4", className)} {...props} />
  )
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
      {...props}
    />
  )
);
CarouselItem.displayName = "CarouselItem";

function CarouselPrevious({ className }: { className?: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={cn(
        "absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/90 text-text-primary shadow-sm transition-opacity disabled:opacity-30",
        "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

function CarouselNext({ className }: { className?: string }) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={cn(
        "absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface/90 text-text-primary shadow-sm transition-opacity disabled:opacity-30",
        "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, useCarousel };

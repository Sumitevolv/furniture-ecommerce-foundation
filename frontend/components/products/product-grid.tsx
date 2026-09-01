import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProductListItem } from "@/types/product";

export function ProductGrid({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-serif text-lg text-text-primary">No pieces match your filters</p>
        <p className="mt-1 text-sm text-text-secondary">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm-lg:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

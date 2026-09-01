import { ProductGrid } from "@/components/products/product-grid";
import type { ProductListItem } from "@/types/product";

export function RelatedProducts({ products }: { products: ProductListItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 border-t border-border-subtle pt-14">
      <h2 className="mb-8 font-serif text-2xl text-charcoal">You may also like</h2>
      <ProductGrid products={products} />
    </section>
  );
}

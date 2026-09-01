import Link from "next/link";
import { ProductGrid } from "@/components/products/product-grid";
import { PLACEHOLDER_FEATURED_PRODUCTS } from "@/lib/placeholder-data";

export function FeaturedProducts() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl text-charcoal">Featured pieces</h2>
          <p className="mt-2 text-sm text-text-secondary">Editor&apos;s picks from this season&apos;s collection.</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-accent hover:text-accent-hover">
          View all &rarr;
        </Link>
      </div>
      <ProductGrid products={PLACEHOLDER_FEATURED_PRODUCTS} />
    </section>
  );
}

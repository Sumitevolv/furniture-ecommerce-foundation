import { Suspense } from "react";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getCatalogServer, CatalogFetchError, type ProductSearchParams } from "@/lib/catalog-server";
import { ProductGrid, ProductGridSkeleton } from "@/components/products/product-grid";
import { ProductFilters } from "@/components/products/product-filters";
import { ProductPagination } from "@/components/products/product-pagination";
import { CatalogUnavailable } from "@/components/products/catalog-unavailable";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = buildMetadata({
  title: "Shop all furniture",
  description: "Solid-wood furniture for living, dining, and bedroom — built to last for generations.",
  path: "/products",
});

interface ProductsPageProps {
  searchParams: Promise<ProductSearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const catalog = getCatalogServer();

  let categories: Awaited<ReturnType<typeof catalog.getCategories>> = [];
  try {
    categories = await catalog.getCategories();
  } catch {
    // Categories are non-critical for this page — filters just render empty.
  }

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Shop all" }]} className="mb-6" />

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal md:text-4xl">Shop all furniture</h1>
        <p className="mt-2 max-w-xl text-sm text-text-secondary">
          Every piece is solid hardwood, hand-joined, and backed by a 10-year guarantee on the frame.
        </p>
      </div>

      <ProductFilters categories={categories} />

      <div className="mt-8">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductResults params={params} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductResults({ params }: { params: ProductSearchParams }) {
  const catalog = getCatalogServer();

  let result: Awaited<ReturnType<typeof catalog.searchProducts>>;
  try {
    result = await catalog.searchProducts(params);
  } catch (error) {
    if (error instanceof CatalogFetchError) {
      return <CatalogUnavailable />;
    }
    throw error;
  }

  return (
    <>
      <p className="mb-6 text-sm text-text-muted">
        {result.totalItems} {result.totalItems === 1 ? "piece" : "pieces"}
      </p>
      <ProductGrid products={result.items} />
      <ProductPagination currentPage={result.page} totalPages={result.totalPages} />
    </>
  );
}

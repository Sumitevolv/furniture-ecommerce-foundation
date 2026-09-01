import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getCatalogServer, CatalogFetchError } from "@/lib/catalog-server";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductDetailTabs } from "@/components/products/product-detail-tabs";
import { RelatedProducts } from "@/components/products/related-products";
import { CatalogUnavailable } from "@/components/products/catalog-unavailable";
import { Breadcrumb } from "@/components/ui/breadcrumb";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string) {
  const catalog = getCatalogServer();
  try {
    return await catalog.getProductBySlug(slug);
  } catch (error) {
    if (error instanceof CatalogFetchError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const product = await loadProduct(slug);
    return buildMetadata({
      title: product.name,
      description: product.shortDescription ?? product.description.slice(0, 155),
      path: `/products/${product.slug}`,
      imageUrl: product.images[0]?.url,
    });
  } catch {
    return buildMetadata({ title: "Product", description: "Furniture from Fauteuil & Co.", path: `/products/${slug}` });
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const catalog = getCatalogServer();

  let product;
  try {
    product = await loadProduct(slug);
  } catch (error) {
    if (error instanceof CatalogFetchError) {
      return <CatalogUnavailable title="This product couldn't be loaded" description={error.message} />;
    }
    throw error;
  }

  const [reviews, related] = await Promise.all([
    catalog.getReviews(product.id).catch(() => []),
    catalog.getRelated(product.category.slug, product.id).catch(() => []),
  ]);

  return (
    <div className="container-page py-10 md:py-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop all", href: "/products" },
          { label: product.category.name, href: `/products?category=${product.category.slug}` },
          { label: product.name },
        ]}
        className="mb-8"
      />

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductDetailTabs product={product} reviews={reviews} />
      <RelatedProducts products={related} />
    </div>
  );
}

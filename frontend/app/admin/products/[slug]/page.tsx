"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminProductForm } from "@/components/admin/admin-product-form";
import { Skeleton } from "@/components/ui/skeleton";
import { productService } from "@/services/product-service";
import { ApiError } from "@/types/api";
import type { Product } from "@/types/product";

export default function EditProductPage() {
  const params = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getBySlug(params.slug)
      .then(setProduct)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load this product."))
      .finally(() => setIsLoading(false));
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !product) {
    return <p className="text-sm text-danger">{error ?? "Product not found."}</p>;
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Edit product</h1>
      <p className="mt-1 text-sm text-text-secondary">{product.name}</p>
      <div className="mt-8">
        <AdminProductForm product={product} />
      </div>
    </div>
  );
}

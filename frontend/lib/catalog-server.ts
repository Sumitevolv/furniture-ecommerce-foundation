import { publicEnv } from "@/lib/env";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Category, Product, ProductListItem, ProductReview } from "@/types/product";

/**
 * Thrown when the catalog API is unreachable or returns an error. Server
 * components catch this and render a real error state — never silently
 * fall back to placeholder data pretending to be live results.
 */
export class CatalogFetchError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "CatalogFetchError";
    this.status = status;
  }
}

async function fetchJson<T>(path: string, revalidateSeconds = 60): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${publicEnv.apiBaseUrl}${path}`, {
      next: { revalidate: revalidateSeconds },
    });
  } catch {
    throw new CatalogFetchError("Couldn't reach the catalog service.");
  }

  if (!res.ok) {
    if (res.status === 404) {
      throw new CatalogFetchError("Not found.", 404);
    }
    throw new CatalogFetchError(`Catalog service responded with ${res.status}.`, res.status);
  }

  const body = (await res.json()) as ApiResponse<T>;
  if (!body.success) {
    throw new CatalogFetchError(body.message ?? "The catalog service returned an error.");
  }
  return body.data;
}

export interface ProductSearchParams {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  material?: string;
  inStockOnly?: string;
  search?: string;
  sort?: string;
  page?: string;
}

const PAGE_SIZE = 12;

export function getCatalogServer() {
  return {
    async searchProducts(params: ProductSearchParams): Promise<PaginatedResponse<ProductListItem>> {
      const query = new URLSearchParams();
      if (params.category) query.set("categorySlug", params.category);
      if (params.minPrice) query.set("minPrice", params.minPrice);
      if (params.maxPrice) query.set("maxPrice", params.maxPrice);
      if (params.material) query.set("material", params.material);
      if (params.inStockOnly === "true") query.set("inStockOnly", "true");
      if (params.search) query.set("search", params.search);
      if (params.sort) {
        const [sortBy, direction] = params.sort.endsWith("-desc")
          ? [params.sort.replace("-desc", ""), "desc"]
          : [params.sort, "asc"];
        query.set("sortBy", sortBy);
        query.set("sortDirection", direction);
      }
      query.set("page", params.page ?? "1");
      query.set("pageSize", String(PAGE_SIZE));

      return fetchJson<PaginatedResponse<ProductListItem>>(`/products?${query.toString()}`, 30);
    },

    async getProductBySlug(slug: string): Promise<Product> {
      return fetchJson<Product>(`/products/${encodeURIComponent(slug)}`, 60);
    },

    async getReviews(productId: string): Promise<ProductReview[]> {
      return fetchJson<ProductReview[]>(`/products/${productId}/reviews`, 30);
    },

    async getCategories(): Promise<Category[]> {
      return fetchJson<Category[]>("/categories", 300);
    },

    async getRelated(categorySlug: string, excludeId: string): Promise<ProductListItem[]> {
      const query = new URLSearchParams({ categorySlug, pageSize: "4" });
      const result = await fetchJson<PaginatedResponse<ProductListItem>>(`/products?${query.toString()}`, 60);
      return result.items.filter((p) => p.id !== excludeId).slice(0, 4);
    },
  };
}

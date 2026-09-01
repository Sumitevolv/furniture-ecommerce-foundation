import { apiClient, unwrap } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse, PaginationParams } from "@/types/api";
import type { Category, Product, ProductFilters, ProductListItem, ProductReview } from "@/types/product";

export const productService = {
  list: (filters: ProductFilters = {}, pagination: PaginationParams = {}) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedResponse<ProductListItem>>>("/products", {
        params: { ...filters, ...pagination },
      })
    ),

  getBySlug: (slug: string) =>
    unwrap(apiClient.get<ApiResponse<Product>>(`/products/${slug}`)),

  getFeatured: () =>
    unwrap(apiClient.get<ApiResponse<ProductListItem[]>>("/products/featured")),

  getReviews: (productId: string) =>
    unwrap(apiClient.get<ApiResponse<ProductReview[]>>(`/products/${productId}/reviews`)),

  submitReview: (productId: string, payload: { rating: number; title?: string; comment: string }) =>
    unwrap(apiClient.post<ApiResponse<ProductReview>>(`/products/${productId}/reviews`, payload)),

  listCategories: () => unwrap(apiClient.get<ApiResponse<Category[]>>("/categories")),
};

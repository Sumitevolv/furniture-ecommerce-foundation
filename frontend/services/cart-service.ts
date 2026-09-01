import { apiClient, unwrap } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { Cart } from "@/types/cart";

export const cartService = {
  get: () => unwrap(apiClient.get<ApiResponse<Cart>>("/cart")),

  addItem: (payload: { productId: string; variantId?: string; quantity: number }) =>
    unwrap(apiClient.post<ApiResponse<Cart>>("/cart/items", payload)),

  updateItem: (itemId: string, quantity: number) =>
    unwrap(apiClient.patch<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity })),

  removeItem: (itemId: string) =>
    unwrap(apiClient.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`)),

  clear: () => unwrap(apiClient.delete<ApiResponse<Cart>>("/cart")),
};

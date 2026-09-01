import { apiClient, unwrap } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { AdminCustomer, AdminDashboardStats } from "@/types/admin";
import type { Order } from "@/types/cart";
import type { Product } from "@/types/product";

export interface AdminProductInput {
  name: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  categoryId: string;
  material?: string;
  stockQuantity: number;
  tags?: string[];
  isFeatured: boolean;
}

export const adminService = {
  getStats: () => unwrap(apiClient.get<ApiResponse<AdminDashboardStats>>("/admin/stats")),

  getCustomers: (page = 1, pageSize = 10, search?: string) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedResponse<AdminCustomer>>>("/admin/customers", {
        params: { page, pageSize, search },
      })
    ),

  getAllOrders: (page = 1, pageSize = 10, status?: string) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedResponse<Order>>>("/orders/admin/all", {
        params: { page, pageSize, status },
      })
    ),

  updateOrderStatus: (orderId: string, status: string) =>
    unwrap(apiClient.patch<ApiResponse<Order>>(`/orders/${orderId}/status`, { status })),

  createProduct: (payload: AdminProductInput) =>
    unwrap(apiClient.post<ApiResponse<Product>>("/products", payload)),

  updateProduct: (id: string, payload: AdminProductInput & { isActive: boolean }) =>
    unwrap(apiClient.put<ApiResponse<Product>>(`/products/${id}`, payload)),

  deleteProduct: (id: string) => apiClient.delete<ApiResponse<null>>(`/products/${id}`),
};

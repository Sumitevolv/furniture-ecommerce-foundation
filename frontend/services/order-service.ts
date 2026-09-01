import { apiClient, unwrap } from "@/lib/api-client";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type {
  CreateOrderPayload,
  Order,
  PaymentInitResponse,
  PaymentVerificationPayload,
} from "@/types/cart";

export const orderService = {
  create: (payload: CreateOrderPayload) =>
    unwrap(apiClient.post<ApiResponse<Order>>("/orders", payload)),

  list: (page = 1, pageSize = 10) =>
    unwrap(
      apiClient.get<ApiResponse<PaginatedResponse<Order>>>("/orders", {
        params: { page, pageSize },
      })
    ),

  getById: (orderId: string) =>
    unwrap(apiClient.get<ApiResponse<Order>>(`/orders/${orderId}`)),

  /** Step 1: ask the backend to create a Razorpay order and return checkout params. */
  initiatePayment: (orderId: string) =>
    unwrap(apiClient.post<ApiResponse<PaymentInitResponse>>(`/payments/razorpay/initiate`, { orderId })),

  /** Step 2: after Razorpay checkout succeeds client-side, verify the signature server-side. */
  verifyPayment: (payload: PaymentVerificationPayload) =>
    unwrap(apiClient.post<ApiResponse<Order>>(`/payments/razorpay/verify`, payload)),
};

import type { ProductListItem } from "./product";

export interface CartItem {
  id: string;
  product: ProductListItem;
  variantId?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  total: number;
  currency: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "authorized" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  productName: string;
  productImageUrl?: string;
  variantLabel?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  createdAt: string;
  /** Populated only on admin listing endpoints. */
  customerName?: string;
  customerEmail?: string;
}

export interface CreateOrderPayload {
  cartId: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
}

/** Razorpay checkout handoff payload returned by the backend. */
export interface PaymentInitResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  orderId: string;
}

export interface PaymentVerificationPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

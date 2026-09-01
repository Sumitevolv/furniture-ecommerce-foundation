"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { adminService } from "@/services/admin-service";
import { formatCurrency } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { Order, OrderStatus } from "@/types/cart";

const PAGE_SIZE = 10;
const STATUS_FILTERS = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
const STATUS_OPTIONS: OrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getAllOrders(page, PAGE_SIZE, statusFilter === "all" ? undefined : statusFilter);
      setOrders(result.items);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching from the API on mount/param change is synchronizing with an external system, not deriving state from props
    load();
  }, [load]);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await adminService.updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success("Order status updated.");
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Orders</h1>
      <p className="mt-1 text-sm text-text-secondary">Track and update order fulfillment.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`rounded-full border px-3 py-1.5 text-sm capitalize transition-colors ${
              statusFilter === status
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-border-subtle text-text-secondary hover:border-border-strong"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-md border border-border-subtle bg-surface p-12 text-center text-sm text-text-secondary">
            No orders found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-border-subtle bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-border-subtle bg-surface-muted text-left text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-3 font-medium text-text-primary">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{formatCurrency(order.total, order.currency)}</td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.paymentStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value)}
                          disabled={updatingId === order.id}
                        >
                          <SelectTrigger className="h-9 w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status} value={status} className="capitalize">
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
      </div>
    </div>
  );
}

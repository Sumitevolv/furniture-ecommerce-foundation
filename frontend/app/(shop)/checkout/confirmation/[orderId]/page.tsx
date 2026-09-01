"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { orderService } from "@/services/order-service";
import { formatCurrency } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { Order } from "@/types/cart";

export default function OrderConfirmationPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getById(params.orderId)
      .then(setOrder)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Couldn't load this order."))
      .finally(() => setIsLoading(false));
  }, [params.orderId]);

  if (isLoading) {
    return (
      <div className="container-page max-w-2xl py-16">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-6 h-48 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="font-serif text-lg text-text-primary">We couldn&apos;t find that order</p>
        <p className="mt-1 text-sm text-text-secondary">{error}</p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/account/orders">View your orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-16 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h1 className="mt-4 font-serif text-3xl text-charcoal">Order confirmed</h1>
      <p className="mt-2 text-sm text-text-secondary">
        Thank you — we&apos;ve received order <span className="font-medium text-text-primary">{order.orderNumber}</span> and
        will send updates as it ships.
      </p>

      <div className="mt-10 rounded-md border border-border-subtle bg-surface p-6 text-left">
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="text-text-primary">{item.productName}</p>
                {item.variantLabel && <p className="text-xs text-text-muted">{item.variantLabel}</p>}
                <p className="text-xs text-text-muted">Qty {item.quantity}</p>
              </div>
              <span className="text-text-primary">{formatCurrency(item.lineTotal, order.currency)}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between border-t border-border-subtle pt-4 font-medium">
          <span className="text-text-primary">Total</span>
          <span className="font-serif text-lg text-charcoal">{formatCurrency(order.total, order.currency)}</span>
        </div>
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link href="/products">Continue shopping</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/account/orders">View your orders</Link>
        </Button>
      </div>
    </div>
  );
}

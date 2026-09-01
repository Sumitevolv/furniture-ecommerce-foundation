"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { OrderSummary } from "@/components/cart/order-summary";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeItem } = useCart();

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-serif text-3xl text-charcoal">Your bag</h1>

      {isLoading ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center gap-4 py-16 text-center">
          <ShoppingBag className="h-10 w-10 text-text-muted" />
          <div>
            <p className="font-serif text-lg text-text-primary">Your bag is empty</p>
            <p className="mt-1 text-sm text-text-secondary">Explore the collection to find your next piece.</p>
          </div>
          <Button asChild size="lg" className="mt-2">
            <Link href="/products">Shop the collection</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-md border border-border-subtle bg-surface p-6">
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                currency={cart.currency}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div>
            <OrderSummary
              cart={cart}
              action={
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceed to checkout</Link>
                </Button>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

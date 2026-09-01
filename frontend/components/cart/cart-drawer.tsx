"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { useCart } from "@/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const { cart, updateQuantity, removeItem } = useCart();

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
      <DrawerContent side="right" className="flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Your bag {cart?.items.length ? `(${cart.items.length})` : ""}</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="font-serif text-lg text-text-primary">Your bag is empty</p>
              <p className="text-sm text-text-secondary">Explore the collection to find your next piece.</p>
            </div>
          ) : (
            <ul className="space-y-6">
              {cart.items.map((item) => (
                <li key={item.id} className="flex gap-4">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.images[0].altText ?? item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{item.product.name}</p>
                        {item.variantLabel && (
                          <p className="text-xs text-text-muted">{item.variantLabel}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        aria-label="Remove item"
                        onClick={() => removeItem(item.id)}
                        className="text-text-muted transition-colors hover:text-danger"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 rounded-sm border border-border-subtle">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="flex h-7 w-7 items-center justify-center text-text-secondary hover:text-text-primary"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-4 text-center text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          className="flex h-7 w-7 items-center justify-center text-text-secondary hover:text-text-primary"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-text-primary">
                        {formatCurrency(item.unitPrice * item.quantity, cart.currency)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <DrawerFooter className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Subtotal</span>
              <PriceDisplay price={cart.subtotal} currency={cart.currency} size="md" />
            </div>
            <Button asChild size="lg" className="w-full" onClick={closeDrawer}>
              <Link href="/checkout">Checkout</Link>
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

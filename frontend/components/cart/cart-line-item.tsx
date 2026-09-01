"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

export function CartLineItem({
  item,
  currency,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  currency: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}) {
  const primaryImage = item.product.images.find((img) => img.isPrimary) ?? item.product.images[0];

  return (
    <div className="flex gap-4 border-b border-border-subtle py-6 first:pt-0 last:border-0 last:pb-0">
      <Link href={`/products/${item.product.slug}`} className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
        {primaryImage && (
          <Image src={primaryImage.url} alt={primaryImage.altText ?? item.product.name} fill sizes="96px" className="object-cover" />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link href={`/products/${item.product.slug}`} className="text-sm font-medium text-text-primary hover:text-accent">
              {item.product.name}
            </Link>
            {item.variantLabel && <p className="mt-0.5 text-xs text-text-muted">{item.variantLabel}</p>}
          </div>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => onRemove(item.id)}
            className="text-text-muted transition-colors hover:text-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center gap-3 rounded-sm border border-border-subtle">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="flex h-9 w-9 items-center justify-center text-text-secondary hover:text-text-primary"
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-5 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="flex h-9 w-9 items-center justify-center text-text-secondary hover:text-text-primary"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm font-medium text-text-primary">
            {formatCurrency(item.unitPrice * item.quantity, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

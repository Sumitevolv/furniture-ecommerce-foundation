"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { MAX_CART_QUANTITY_PER_ITEM } from "@/utils/constants";
import type { Product } from "@/types/product";

const AVAILABILITY_LABEL: Record<Product["availability"], string> = {
  in_stock: "In stock",
  low_stock: "Only a few left",
  out_of_stock: "Out of stock",
  preorder: "Available for preorder",
};

export function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const selectedVariant = useMemo(
    () => product.variants.find((v) => v.id === selectedVariantId),
    [product.variants, selectedVariantId]
  );

  const effectivePrice = selectedVariant?.priceOverride ?? product.price;
  const isOutOfStock = product.availability === "out_of_stock";

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await addItem(product.id, quantity, selectedVariantId);
    } finally {
      setIsAdding(false);
    }
  };

  // Group variant attributes by key (e.g. "color") so we can render one
  // selector row per attribute rather than a flat list of variant names.
  const attributeGroups = useMemo(() => {
    const groups = new Map<string, Set<string>>();
    for (const variant of product.variants) {
      for (const [key, value] of Object.entries(variant.attributes)) {
        if (!groups.has(key)) groups.set(key, new Set());
        groups.get(key)!.add(value);
      }
    }
    return groups;
  }, [product.variants]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-bronze">{product.category.name}</p>
        <h1 className="mt-2 font-serif text-3xl text-charcoal md:text-4xl">{product.name}</h1>
        {product.reviewCount > 0 && (
          <div className="mt-3">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
        )}
      </div>

      <PriceDisplay price={effectivePrice} compareAtPrice={product.compareAtPrice} currency={product.currency} size="lg" />

      <Badge variant={isOutOfStock ? "muted" : product.availability === "low_stock" ? "warning" : "success"} className="w-fit">
        {AVAILABILITY_LABEL[product.availability]}
      </Badge>

      {product.shortDescription && (
        <p className="text-sm leading-relaxed text-text-secondary">{product.shortDescription}</p>
      )}

      {product.variants.length > 0 && (
        <div className="space-y-4">
          {Array.from(attributeGroups.entries()).map(([attrKey, values]) => (
            <div key={attrKey}>
              <p className="mb-2 text-sm font-medium capitalize text-text-primary">{attrKey}</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(values).map((value) => {
                  const matchingVariant = product.variants.find((v) => v.attributes[attrKey] === value);
                  const isSelected = selectedVariant?.attributes[attrKey] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => matchingVariant && setSelectedVariantId(matchingVariant.id)}
                      className={`rounded-sm border px-4 py-2 text-sm transition-colors ${
                        isSelected
                          ? "border-charcoal bg-charcoal text-ivory"
                          : "border-border-subtle text-text-secondary hover:border-border-strong"
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 rounded-sm border border-border-subtle px-1">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-text-primary"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-sm">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(MAX_CART_QUANTITY_PER_ITEM, q + 1))}
            className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-text-primary"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button size="lg" className="flex-1" disabled={isOutOfStock} isLoading={isAdding} onClick={handleAddToCart}>
          {isOutOfStock ? "Out of stock" : "Add to bag"}
        </Button>
      </div>

      {product.material && (
        <dl className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6 text-sm">
          <div>
            <dt className="text-text-muted">Material</dt>
            <dd className="mt-1 text-text-primary">{product.material}</dd>
          </div>
          {product.dimensions && (
            <div>
              <dt className="text-text-muted">Dimensions</dt>
              <dd className="mt-1 text-text-primary">
                {product.dimensions.widthCm} × {product.dimensions.heightCm} × {product.dimensions.depthCm} cm
              </dd>
            </div>
          )}
        </dl>
      )}
    </div>
  );
}

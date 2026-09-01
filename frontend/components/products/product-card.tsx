"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/ui/price-display";
import { Rating } from "@/components/ui/rating";
import type { ProductListItem } from "@/types/product";

export function ProductCard({ product }: { product: ProductListItem }) {
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-surface-muted">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-text-muted">No image</div>
          )}
          {product.isFeatured && (
            <Badge variant="accent" className="absolute left-3 top-3">
              Featured
            </Badge>
          )}
          {product.availability === "out_of_stock" && (
            <Badge variant="muted" className="absolute left-3 top-3">
              Sold out
            </Badge>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
            {product.name}
          </h3>
          <p className="text-xs text-text-muted">{product.categoryName}</p>
          <div className="flex items-center justify-between pt-1">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} currency={product.currency} size="sm" />
            {product.reviewCount > 0 && <Rating value={product.rating} count={product.reviewCount} size="sm" />}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { ProductListItem } from "@/types/product";

const AVAILABILITY_VARIANT: Record<string, "success" | "warning" | "muted"> = {
  in_stock: "success",
  low_stock: "warning",
  out_of_stock: "muted",
  preorder: "muted",
};

export function AdminProductsTable({
  products,
  onDelete,
  deletingId,
}: {
  products: ProductListItem[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-border-subtle bg-surface p-12 text-center text-sm text-text-secondary">
        No products yet. Add your first piece to get started.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-border-subtle bg-surface">
      <table className="w-full text-sm">
        <thead className="border-b border-border-subtle bg-surface-muted text-left text-xs uppercase tracking-wide text-text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Product</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Price</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-surface-muted">
                    {product.images[0] && (
                      <Image src={product.images[0].url} alt="" fill sizes="40px" className="object-cover" />
                    )}
                  </div>
                  <span className="font-medium text-text-primary">{product.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{product.categoryName}</td>
              <td className="px-4 py-3 text-text-secondary">{formatCurrency(product.price, product.currency)}</td>
              <td className="px-4 py-3">
                <Badge variant={AVAILABILITY_VARIANT[product.availability] ?? "muted"}>
                  {product.availability.replace("_", " ")}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild aria-label={`Edit ${product.name}`}>
                    <Link href={`/admin/products/${product.slug}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${product.name}`}
                    isLoading={deletingId === product.id}
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-danger" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

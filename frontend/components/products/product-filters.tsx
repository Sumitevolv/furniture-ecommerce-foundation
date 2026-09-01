"use client";

import { useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/product";

const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

export function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get("category") ?? "";
  const currentSort = searchParams.get("sort") ?? "";
  const currentInStock = searchParams.get("inStockOnly") === "true";

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page"); // any filter change resets pagination
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const activeCategoryLabel = categories.find((c) => c.slug === currentCategory)?.name;

  return (
    <div className="flex flex-col gap-4 border-b border-border-subtle pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-sm text-text-secondary">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
        </span>

        <button
          type="button"
          onClick={() => updateParam("category", null)}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            !currentCategory
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-border-subtle text-text-secondary hover:border-border-strong"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => updateParam("category", category.slug)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
              currentCategory === category.slug
                ? "border-charcoal bg-charcoal text-ivory"
                : "border-border-subtle text-text-secondary hover:border-border-strong"
            }`}
          >
            {category.name}
          </button>
        ))}

        <button
          type="button"
          onClick={() => updateParam("inStockOnly", currentInStock ? null : "true")}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
            currentInStock
              ? "border-charcoal bg-charcoal text-ivory"
              : "border-border-subtle text-text-secondary hover:border-border-strong"
          }`}
        >
          In stock only
        </button>

        {activeCategoryLabel && (
          <Badge variant="muted" className="ml-1">
            {isPending ? "Updating…" : activeCategoryLabel}
          </Badge>
        )}
      </div>

      <Select value={currentSort || "featured"} onValueChange={(v) => updateParam("sort", v === "featured" ? null : v)}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value || "featured"}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

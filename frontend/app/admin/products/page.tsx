"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminProductsTable } from "@/components/admin/admin-products-table";
import { productService } from "@/services/product-service";
import { adminService } from "@/services/admin-service";
import { useDebounce } from "@/hooks/use-debounce";
import { ApiError } from "@/types/api";
import type { ProductListItem } from "@/types/product";

const PAGE_SIZE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await productService.list(
        { search: debouncedSearch || undefined },
        { page, pageSize: PAGE_SIZE }
      );
      setProducts(result.items);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching from the API on mount/param change is synchronizing with an external system, not deriving state from props
    load();
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting pagination when the debounced search term changes
    setPage(1);
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this product from the catalog? It will no longer be visible to customers.")) return;

    setDeletingId(id);
    try {
      await adminService.deleteProduct(id);
      toast.success("Product removed.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl text-charcoal">Products</h1>
          <p className="mt-1 text-sm text-text-secondary">Manage your catalog.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" />
            Add product
          </Link>
        </Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="pl-9"
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <>
            <AdminProductsTable products={products} onDelete={handleDelete} deletingId={deletingId} />
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-6" />
          </>
        )}
      </div>
    </div>
  );
}

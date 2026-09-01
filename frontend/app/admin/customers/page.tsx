"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin-service";
import { useDebounce } from "@/hooks/use-debounce";
import { ApiError } from "@/types/api";
import type { AdminCustomer } from "@/types/admin";

const PAGE_SIZE = 10;

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await adminService.getCustomers(page, PAGE_SIZE, debouncedSearch || undefined);
      setCustomers(result.items);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching from the API on mount/param change is synchronizing with an external system, not deriving state from props
    load();
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting pagination when the debounced search term changes
    setPage(1);
  }, [debouncedSearch]);

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Customers</h1>
      <p className="mt-1 text-sm text-text-secondary">Everyone who has created an account.</p>

      <div className="relative mt-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
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
        ) : customers.length === 0 ? (
          <div className="rounded-md border border-border-subtle bg-surface p-12 text-center text-sm text-text-secondary">
            No customers found.
          </div>
        ) : (
          <div className="overflow-hidden rounded-md border border-border-subtle bg-surface">
            <table className="w-full text-sm">
              <thead className="border-b border-border-subtle bg-surface-muted text-left text-xs uppercase tracking-wide text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-4 py-3 font-medium text-text-primary">
                      {customer.firstName} {customer.lastName}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{customer.email}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {new Date(customer.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={customer.isActive ? "success" : "muted"}>
                        {customer.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {!customer.emailVerified && (
                        <Badge variant="warning" className="ml-1.5">
                          Unverified
                        </Badge>
                      )}
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

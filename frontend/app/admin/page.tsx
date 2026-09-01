"use client";

import { useEffect, useState } from "react";
import { Package, AlertTriangle, ShoppingCart, Clock, IndianRupee, Users } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { adminService } from "@/services/admin-service";
import { formatCurrency } from "@/lib/utils";
import { ApiError } from "@/types/api";
import type { AdminDashboardStats } from "@/types/admin";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    adminService
      .getStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch((error) => {
        if (!cancelled && error instanceof ApiError) toast.error(error.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal">Dashboard</h1>
      <p className="mt-1 text-sm text-text-secondary">An overview of your store&apos;s activity.</p>

      {isLoading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : stats ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Total products" value={stats.totalProducts.toLocaleString()} icon={Package} />
          <StatCard
            label="Low stock"
            value={stats.lowStockProducts.toLocaleString()}
            icon={AlertTriangle}
            tone={stats.lowStockProducts > 0 ? "warning" : "default"}
          />
          <StatCard label="Total orders" value={stats.totalOrders.toLocaleString()} icon={ShoppingCart} />
          <StatCard label="Pending orders" value={stats.pendingOrders.toLocaleString()} icon={Clock} />
          <StatCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} icon={IndianRupee} />
          <StatCard label="Customers" value={stats.totalCustomers.toLocaleString()} icon={Users} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-text-secondary">Couldn&apos;t load dashboard stats right now.</p>
      )}
    </div>
  );
}

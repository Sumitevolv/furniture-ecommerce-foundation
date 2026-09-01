"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
      return;
    }
    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container-page py-16">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-5rem)]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 bg-cream/40 p-6">{children}</main>
      </div>
    </div>
  );
}

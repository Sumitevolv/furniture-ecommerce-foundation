"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_LINKS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border-subtle bg-surface md:block">
      <div className="px-6 py-6">
        <p className="font-serif text-lg text-text-primary">Admin</p>
      </div>
      <nav className="flex flex-col gap-1 px-3">
        {ADMIN_LINKS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-surface-muted text-text-primary font-medium"
                  : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

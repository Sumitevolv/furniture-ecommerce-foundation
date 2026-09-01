"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { NAV_LINKS, APP_NAME } from "@/utils/constants";

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const openCartDrawer = useCartStore((s) => s.openDrawer);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/80">
      <div className="container-page flex h-16 items-center justify-between md:h-20">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-sm text-charcoal md:hidden"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/" className="font-serif text-xl tracking-tight text-charcoal md:text-2xl">
          {APP_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary transition-colors hover:text-text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            onClick={openCartDrawer}
            className="relative"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground"
              >
                {itemCount}
              </motion.span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}

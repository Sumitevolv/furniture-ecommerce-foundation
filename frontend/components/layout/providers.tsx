"use client";

import * as React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      {children}
      <CartDrawer />
      <MobileNav />
      <Toaster />
    </TooltipProvider>
  );
}

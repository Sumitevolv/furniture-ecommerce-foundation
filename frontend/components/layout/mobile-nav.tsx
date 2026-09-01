"use client";

import Link from "next/link";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useUiStore } from "@/store/ui-store";
import { NAV_LINKS } from "@/utils/constants";

export function MobileNav() {
  const isOpen = useUiStore((s) => s.isMobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);

  return (
    <Drawer open={isOpen} onOpenChange={setOpen}>
      <DrawerContent side="left">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <nav className="flex flex-col p-2" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-sm px-4 py-3 text-base text-text-primary transition-colors hover:bg-surface-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}

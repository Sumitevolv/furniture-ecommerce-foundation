"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function AdminTopbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-subtle bg-surface px-6">
      <Link href="/" className="text-sm text-text-secondary hover:text-text-primary">
        &larr; Back to store
      </Link>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-text-secondary">
            {user.firstName} {user.lastName}
          </span>
        )}
        <Button variant="outline" size="sm" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </header>
  );
}

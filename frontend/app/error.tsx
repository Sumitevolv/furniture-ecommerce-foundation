"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RouteError]", error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="font-serif text-2xl text-charcoal">This page hit a snag</h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        Something didn&apos;t load correctly. You can try again, or continue browsing.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to shop</Link>
        </Button>
      </div>
    </div>
  );
}

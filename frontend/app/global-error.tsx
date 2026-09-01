"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
        <p className="font-serif text-6xl text-charcoal">Oops</p>
        <h1 className="mt-4 font-serif text-2xl text-charcoal">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-sm text-text-secondary">
          We hit an unexpected error loading this page. Try again, or head back home.
        </p>
        <div className="mt-8 flex gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="outline" asChild>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- this boundary replaces <html>/<body>, so Link/router context may not be mounted */}
            <a href="/">Go home</a>
          </Button>
        </div>
      </body>
    </html>
  );
}

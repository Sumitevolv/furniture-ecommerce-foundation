import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CatalogUnavailable({
  title = "The catalog is temporarily unavailable",
  description = "We couldn't load products just now. This usually means the backend isn't running yet in this environment.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-serif text-2xl text-charcoal">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-text-secondary">{description}</p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/products">Try again</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back home</Link>
        </Button>
      </div>
    </div>
  );
}

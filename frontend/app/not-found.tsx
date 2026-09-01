import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-serif text-7xl text-sand">404</p>
      <h1 className="mt-4 font-serif text-2xl text-charcoal">This piece isn&apos;t here</h1>
      <p className="mt-2 max-w-sm text-sm text-text-secondary">
        The page you&apos;re looking for may have been moved or no longer exists.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">Return to the collection</Link>
      </Button>
    </div>
  );
}

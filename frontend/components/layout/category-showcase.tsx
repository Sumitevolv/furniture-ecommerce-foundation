import Link from "next/link";
import { NAV_LINKS } from "@/utils/constants";

export function CategoryShowcase() {
  const categories = NAV_LINKS.slice(0, 4);

  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-serif text-3xl text-charcoal">Shop by room</h2>
        <Link href="/products" className="text-sm font-medium text-accent hover:text-accent-hover">
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm bg-surface-muted"
          >
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 via-transparent to-transparent p-5 transition-opacity group-hover:from-black/55">
              <span className="font-serif text-lg text-white">{category.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

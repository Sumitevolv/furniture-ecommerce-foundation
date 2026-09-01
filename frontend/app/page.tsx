import { Hero } from "@/components/layout/hero";
import { CategoryShowcase } from "@/components/layout/category-showcase";
import { FeaturedProducts } from "@/components/products/featured-products";
import { ValuesStrip } from "@/components/layout/values-strip";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuesStrip />
      <CategoryShowcase />
      <FeaturedProducts />
    </>
  );
}

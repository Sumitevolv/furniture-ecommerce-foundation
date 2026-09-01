import { Rating } from "@/components/ui/rating";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Product, ProductReview } from "@/types/product";

export function ProductDetailTabs({ product, reviews }: { product: Product; reviews: ProductReview[] }) {
  return (
    <Tabs defaultValue="description" className="mt-16">
      <TabsList>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="care">Materials & care</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">{product.description}</p>
      </TabsContent>

      <TabsContent value="care">
        <div className="max-w-2xl space-y-3 text-sm leading-relaxed text-text-secondary">
          <p>
            {product.material
              ? `Crafted primarily from ${product.material.toLowerCase()}. `
              : ""}
            Wipe clean with a soft, dry cloth. Avoid direct sunlight and heat sources to preserve the
            finish, and use coasters or pads under hot or wet items.
          </p>
          <p>Every frame is covered by a 10-year structural guarantee.</p>
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        {reviews.length === 0 ? (
          <p className="text-sm text-text-secondary">No reviews yet — be the first to share your thoughts.</p>
        ) : (
          <ul className="max-w-2xl space-y-6">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-border-subtle pb-6 last:border-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text-primary">{review.userName}</p>
                  <span className="text-xs text-text-muted">
                    {new Date(review.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <Rating value={review.rating} size="sm" className="mt-1.5" />
                {review.title && <p className="mt-2 text-sm font-medium text-text-primary">{review.title}</p>}
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </TabsContent>
    </Tabs>
  );
}

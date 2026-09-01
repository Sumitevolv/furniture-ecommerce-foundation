import type { ProductListItem } from "@/types/product";

/**
 * Foundation-phase placeholder data ONLY. Once the backend catalog endpoints
 * are live, replace usages of this with `productService.getFeatured()` /
 * `productService.list()`. Kept here, isolated, so it's obvious what's real
 * data and what's scaffolding.
 */
export const PLACEHOLDER_FEATURED_PRODUCTS: ProductListItem[] = [
  {
    id: "demo-1",
    name: "Aldric Lounge Chair",
    slug: "aldric-lounge-chair",
    price: 42999,
    compareAtPrice: 49999,
    currency: "INR",
    images: [{ id: "img-1", url: "/images/placeholder-chair.svg", altText: "Aldric lounge chair", isPrimary: true, sortOrder: 0 }],
    availability: "in_stock",
    rating: 4.8,
    reviewCount: 124,
    isFeatured: true,
    categoryName: "Living",
  },
  {
    id: "demo-2",
    name: "Marlow Oak Dining Table",
    slug: "marlow-oak-dining-table",
    price: 68999,
    compareAtPrice: null,
    currency: "INR",
    images: [{ id: "img-2", url: "/images/placeholder-table.svg", altText: "Marlow oak dining table", isPrimary: true, sortOrder: 0 }],
    availability: "in_stock",
    rating: 4.9,
    reviewCount: 87,
    isFeatured: true,
    categoryName: "Dining",
  },
  {
    id: "demo-3",
    name: "Sela Bouclé Sofa",
    slug: "sela-boucle-sofa",
    price: 89999,
    compareAtPrice: 104999,
    currency: "INR",
    images: [{ id: "img-3", url: "/images/placeholder-sofa.svg", altText: "Sela bouclé sofa", isPrimary: true, sortOrder: 0 }],
    availability: "low_stock",
    rating: 4.7,
    reviewCount: 56,
    isFeatured: true,
    categoryName: "Living",
  },
  {
    id: "demo-4",
    name: "Beckett Walnut Bed Frame",
    slug: "beckett-walnut-bed-frame",
    price: 74999,
    compareAtPrice: null,
    currency: "INR",
    images: [{ id: "img-4", url: "/images/placeholder-bed.svg", altText: "Beckett walnut bed frame", isPrimary: true, sortOrder: 0 }],
    availability: "in_stock",
    rating: 4.6,
    reviewCount: 41,
    isFeatured: true,
    categoryName: "Bedroom",
  },
];

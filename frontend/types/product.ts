export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  priceOverride?: number;
  stockQuantity: number;
  attributes: Record<string, string>; // e.g. { color: "Walnut", size: "3-seater" }
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
}

export type ProductAvailability = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  currency: string;
  category: Category;
  material?: string;
  dimensions?: {
    widthCm: number;
    heightCm: number;
    depthCm: number;
  };
  images: ProductImage[];
  variants: ProductVariant[];
  availability: ProductAvailability;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem
  extends Pick<
    Product,
    | "id"
    | "name"
    | "slug"
    | "price"
    | "compareAtPrice"
    | "currency"
    | "images"
    | "availability"
    | "rating"
    | "reviewCount"
    | "isFeatured"
  > {
  categoryName: string;
}

export interface ProductFilters {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  inStockOnly?: boolean;
  search?: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

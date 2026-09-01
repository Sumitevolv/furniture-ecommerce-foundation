export const APP_NAME = "Fauteuil & Co.";
export const APP_TAGLINE = "Furniture built to be lived with, for generations.";

export const NAV_LINKS = [
  { label: "Living", href: "/products?category=living" },
  { label: "Bedroom", href: "/products?category=bedroom" },
  { label: "Dining", href: "/products?category=dining" },
  { label: "Lighting", href: "/products?category=lighting" },
  { label: "Journal", href: "/journal" },
] as const;

export const FOOTER_LINKS = {
  shop: [
    { label: "All furniture", href: "/products" },
    { label: "New arrivals", href: "/products?sort=newest" },
    { label: "Best sellers", href: "/products?sort=popular" },
  ],
  company: [
    { label: "Our story", href: "/about" },
    { label: "Sustainability", href: "/sustainability" },
    { label: "Careers", href: "/careers" },
  ],
  support: [
    { label: "Contact us", href: "/contact" },
    { label: "Shipping & returns", href: "/shipping" },
    { label: "Care guide", href: "/care" },
  ],
} as const;

export const DEFAULT_PAGE_SIZE = 12;
export const MAX_CART_QUANTITY_PER_ITEM = 10;

export const CURRENCY = "INR";
export const LOCALE = "en-IN";

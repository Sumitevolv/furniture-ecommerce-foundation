import { cn, formatCurrency } from "@/lib/utils";
import { CURRENCY, LOCALE } from "@/utils/constants";

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceDisplay({
  price,
  compareAtPrice,
  currency = CURRENCY,
  size = "md",
  className,
}: PriceDisplayProps) {
  const hasDiscount = !!compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice! - price) / compareAtPrice!) * 100)
    : 0;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-medium text-text-primary", sizeMap[size])}>
        {formatCurrency(price, currency, LOCALE)}
      </span>
      {hasDiscount && (
        <>
          <span className="text-sm text-text-muted line-through">
            {formatCurrency(compareAtPrice!, currency, LOCALE)}
          </span>
          <span className="text-xs font-medium text-success">-{discountPercent}%</span>
        </>
      )}
    </div>
  );
}

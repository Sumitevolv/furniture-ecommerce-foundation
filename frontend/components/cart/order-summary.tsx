import { formatCurrency } from "@/lib/utils";
import type { Cart } from "@/types/cart";

export function OrderSummary({ cart, action }: { cart: Cart; action?: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border-subtle bg-surface p-6">
      <h2 className="font-serif text-lg text-charcoal">Order summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-text-secondary">Subtotal</dt>
          <dd className="text-text-primary">{formatCurrency(cart.subtotal, cart.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Estimated tax</dt>
          <dd className="text-text-primary">{formatCurrency(cart.estimatedTax, cart.currency)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-text-secondary">Shipping</dt>
          <dd className="text-text-primary">
            {cart.estimatedShipping === 0 ? "Free" : formatCurrency(cart.estimatedShipping, cart.currency)}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex justify-between border-t border-border-subtle pt-4">
        <span className="font-medium text-text-primary">Total</span>
        <span className="font-serif text-lg text-charcoal">{formatCurrency(cart.total, cart.currency)}</span>
      </div>

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

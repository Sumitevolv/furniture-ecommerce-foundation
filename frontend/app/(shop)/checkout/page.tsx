"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressForm } from "@/components/checkout/address-form";
import { OrderSummary } from "@/components/cart/order-summary";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { orderService } from "@/services/order-service";
import { loadRazorpayScript } from "@/lib/load-razorpay-script";
import { publicEnv } from "@/lib/env";
import { APP_NAME } from "@/utils/constants";
import { ApiError } from "@/types/api";
import type { AddressFormValues } from "@/utils/validation";
import type { RazorpaySuccessResponse } from "@/types/razorpay";

const ADDRESS_FORM_ID = "checkout-address-form";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { cart, isLoading: isCartLoading } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?redirect=/checkout");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  const handleAddressSubmit = async (address: AddressFormValues) => {
    if (!cart || cart.items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Step 1: create the order server-side from the current cart.
      const order = await orderService.create({ cartId: cart.id, shippingAddress: address });

      // Step 2: ask the backend to open a Razorpay order for that amount.
      const paymentInit = await orderService.initiatePayment(order.id);

      // Step 3: load Razorpay's checkout.js and open the payment modal.
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        toast.error("Couldn't load the payment provider. Please check your connection and try again.");
        setIsPlacingOrder(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: paymentInit.razorpayKeyId || publicEnv.razorpayKeyId,
        amount: Math.round(paymentInit.amount * 100),
        currency: paymentInit.currency,
        name: APP_NAME,
        description: `Order ${order.orderNumber}`,
        order_id: paymentInit.razorpayOrderId,
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: address.phone,
        },
        theme: { color: "#A97C50" },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            await orderService.verifyPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success("Payment successful!");
            router.push(`/checkout/confirmation/${order.id}`);
          } catch (error) {
            toast.error(
              error instanceof ApiError
                ? error.message
                : "We couldn't confirm your payment. If you were charged, please contact support."
            );
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => setIsPlacingOrder(false),
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error.description || "Payment failed. Please try again.");
        setIsPlacingOrder(false);
      });

      razorpay.open();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "Something went wrong placing your order.");
      setIsPlacingOrder(false);
    }
  };

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="container-page py-14">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 md:py-14">
      <h1 className="font-serif text-3xl text-charcoal">Checkout</h1>

      {isCartLoading ? (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : !cart || cart.items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
          <p className="font-serif text-lg text-text-primary">Your bag is empty</p>
          <p className="text-sm text-text-secondary">Add something to your bag before checking out.</p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/products">Shop the collection</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="rounded-md border border-border-subtle bg-surface p-6">
            <h2 className="mb-6 font-serif text-lg text-charcoal">Shipping address</h2>
            <AddressForm formId={ADDRESS_FORM_ID} onSubmit={handleAddressSubmit} />
          </div>

          <div>
            <OrderSummary
              cart={cart}
              action={
                <Button type="submit" form={ADDRESS_FORM_ID} size="lg" className="w-full" isLoading={isPlacingOrder}>
                  Continue to payment
                </Button>
              }
            />
            <p className="mt-4 text-center text-xs text-text-muted">
              Payments are securely processed by Razorpay. We never store your card details.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

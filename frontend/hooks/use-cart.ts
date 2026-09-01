"use client";

import { useCallback, useEffect } from "react";
import { cartService } from "@/services/cart-service";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import { ApiError } from "@/types/api";

export function useCart() {
  const { cart, isLoading, setCart, setLoading, openDrawer } = useCartStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cartService.get();
      setCart(data);
    } catch (error) {
      if (error instanceof ApiError && error.status !== 401) {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [setCart, setLoading]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addItem = useCallback(
    async (productId: string, quantity = 1, variantId?: string) => {
      try {
        const data = await cartService.addItem({ productId, variantId, quantity });
        setCart(data);
        openDrawer();
        toast.success("Added to cart");
      } catch (error) {
        if (error instanceof ApiError) toast.error(error.message);
      }
    },
    [setCart, openDrawer]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      try {
        const data = await cartService.updateItem(itemId, quantity);
        setCart(data);
      } catch (error) {
        if (error instanceof ApiError) toast.error(error.message);
      }
    },
    [setCart]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      try {
        const data = await cartService.removeItem(itemId);
        setCart(data);
        toast.success("Removed from cart");
      } catch (error) {
        if (error instanceof ApiError) toast.error(error.message);
      }
    },
    [setCart]
  );

  return { cart, isLoading, refresh, addItem, updateQuantity, removeItem };
}

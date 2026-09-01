import { create } from "zustand";
import type { Cart } from "@/types/cart";

interface CartState {
  cart: Cart | null;
  isDrawerOpen: boolean;
  isLoading: boolean;
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isDrawerOpen: false,
  isLoading: false,
  setCart: (cart) => set({ cart }),
  setLoading: (isLoading) => set({ isLoading }),
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((s) => ({ isDrawerOpen: !s.isDrawerOpen })),
  itemCount: () => get().cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
}));

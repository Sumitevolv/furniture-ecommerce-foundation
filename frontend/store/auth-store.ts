import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setHydrated: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setHydrated: () => set({ isHydrated: true }),
      reset: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "furniture-auth-store",
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    }
  )
);

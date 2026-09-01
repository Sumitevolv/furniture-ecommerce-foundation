import { create } from "zustand";

interface UiState {
  isMobileNavOpen: boolean;
  theme: "light" | "dark";
  setMobileNavOpen: (open: boolean) => void;
  toggleTheme: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isMobileNavOpen: false,
  theme: "light",
  setMobileNavOpen: (isMobileNavOpen) => set({ isMobileNavOpen }),
  toggleTheme: () =>
    set((s) => {
      const theme = s.theme === "light" ? "dark" : "light";
      if (typeof document !== "undefined") {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }
      return { theme };
    }),
}));

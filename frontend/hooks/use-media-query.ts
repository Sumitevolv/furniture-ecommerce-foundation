"use client";

import { useEffect, useState } from "react";

/** Subscribes to a CSS media query and returns whether it currently matches. */
export function useMediaQuery(query: string): boolean {
  const getSnapshot = () => (typeof window === "undefined" ? false : window.matchMedia(query).matches);
  const [matches, setMatches] = useState(getSnapshot);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    // Reconcile in case the query result changed between render and mount
    // (e.g. SSR->hydration). Guarded so it only updates on an actual change.
    if (mediaQueryList.matches !== matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing local state from a browser API (matchMedia), which cannot be read during render
      setMatches(mediaQueryList.matches);
    }

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query, matches]);

  return matches;
}

export const breakpoints = {
  xs: "(min-width: 360px)",
  sm: "(min-width: 390px)",
  smLg: "(min-width: 430px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  xxl: "(min-width: 1440px)",
  xxxl: "(min-width: 1920px)",
} as const;

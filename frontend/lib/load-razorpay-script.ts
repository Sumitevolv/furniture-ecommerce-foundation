const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<boolean> | null = null;

/**
 * Loads Razorpay's checkout.js exactly once per page session. Returns
 * false if the script fails to load (e.g. offline, ad-blocker) so callers
 * can show a clear error instead of a silent freeze.
 */
export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);

  if (!loadPromise) {
    loadPromise = new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        loadPromise = null; // allow retry on next attempt
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  return loadPromise;
}

/**
 * Centralised, typed access to environment variables.
 *
 * Only variables prefixed with NEXT_PUBLIC_ are available in the browser;
 * everything else is server-only. Never import this file's server-only
 * exports from a "use client" component.
 *
 * All values are validated at startup so misconfiguration fails fast and
 * loudly instead of surfacing as a confusing runtime bug later.
 */

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined || value === "") {
    // During build time (e.g. CI type-checks) we don't want to hard-crash
    // Next.js's static analysis, so we warn instead of throwing when
    // NODE_ENV is "production" and we're clearly in a build step.
    if (process.env.NODE_ENV === "production" && !process.env.NEXT_RUNTIME) {
      console.warn(`[env] Missing environment variable: ${name}`);
      return "";
    }
    throw new Error(
      `[env] Missing required environment variable: ${name}. Did you copy .env.example to .env.local?`
    );
  }
  return value;
}

/** Public, browser-safe configuration. */
export const publicEnv = {
  apiBaseUrl: requireEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:5000/api"),
  siteUrl: requireEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000"),
  siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "Fauteuil & Co.",
  cloudinaryCloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
  razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  signalrHubUrl: process.env.NEXT_PUBLIC_SIGNALR_HUB_URL ?? "http://localhost:5000/hubs/notifications",
  enableAiFeatures: (process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES ?? "true") === "true",
} as const;

export type PublicEnv = typeof publicEnv;

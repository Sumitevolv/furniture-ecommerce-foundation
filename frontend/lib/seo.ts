import type { Metadata } from "next";
import { publicEnv } from "./env";

interface PageSeoOptions {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
  noIndex?: boolean;
}

/**
 * Build a consistent Metadata object for a page. Use in each route's
 * `export const metadata` or `generateMetadata` so title templates,
 * canonical URLs and OpenGraph/Twitter cards stay uniform site-wide.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  imageUrl,
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = new URL(path, publicEnv.siteUrl).toString();
  const image = imageUrl ?? new URL("/og-default.jpg", publicEnv.siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: publicEnv.siteName,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export const defaultTitleTemplate = `%s | ${publicEnv.siteName}`;

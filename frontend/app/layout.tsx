import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/layout/providers";
import { AiChatWidget } from "@/components/ai/ai-chat-widget";
import { buildMetadata, defaultTitleTemplate } from "@/lib/seo";
import { APP_TAGLINE } from "@/utils/constants";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Fauteuil & Co. — Furniture built to last",
    description: APP_TAGLINE,
    path: "/",
  }),
  title: {
    default: "Fauteuil & Co. — Furniture built to last",
    template: defaultTitleTemplate,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FBF8F3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a href="#main-content" className="sr-only-focusable fixed left-4 top-4 z-50 rounded-sm bg-charcoal px-4 py-2 text-sm text-ivory">
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <AiChatWidget />
        </Providers>
      </body>
    </html>
  );
}

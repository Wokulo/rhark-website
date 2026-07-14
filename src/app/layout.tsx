import type { Metadata } from "next";
import { Providers } from "@/providers";
import {
  Header,
  Footer,
  SkipToContent,
  ScrollToTop,
  CookieConsent,
} from "@/components/layout";
import { buildMetadata, buildOrganisationJsonLd } from "@/lib/metadata";
import "./globals.css";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// next/font: self-hosted at build time — zero layout shift, GDPR-safe,
// no runtime request to Google Fonts servers.

// ─── Root Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = buildMetadata();

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = buildOrganisationJsonLd();

  return (
    <html
      lang="en"
      // suppressHydrationWarning is required by next-themes to prevent
      // a hydration mismatch when the theme class is applied client-side.
      suppressHydrationWarning
    >
      <head>
        {/* JSON-LD structured data — enables Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-dvh flex-col bg-neutral-50 text-neutral-900 antialiased">
        <Providers>
          {/*
           * SkipToContent must be the FIRST focusable element in the DOM.
           * WCAG 2.2 AA — Success Criterion 2.4.1 (Bypass Blocks).
           */}
          <SkipToContent />

          {/*
           * Header is fixed/sticky — it manages its own top offset internally
           * to account for the announcement bar height.
           */}
          <Header />

          {/*
           * Main content area.
           * pt-16 / lg:pt-20 offsets the fixed header height.
           * tabIndex={-1} allows the SkipToContent link to programmatically
           * focus this element without it appearing in the natural tab order.
           */}
          <main
            id="main-content"
            className="flex-1 pt-16 lg:pt-20"
            tabIndex={-1}
          >
            {children}
          </main>

          <Footer />

          {/*
           * ScrollToTop renders a progress ring + arrow button.
           * Appears after 400px of scroll. Client component.
           */}
          <ScrollToTop />

          {/*
           * CookieConsent implements the Kenya Data Protection Act 2019.
           * Stores consent in localStorage. Re-prompts on policy version bump.
           */}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}

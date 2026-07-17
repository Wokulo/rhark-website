import type { Metadata } from "next";
import { SITE_NAME, SITE_FULL_NAME, SITE_URL, SITE_DESCRIPTION } from "@/constants";

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
  path?: string;
}

/**
 * Factory function that generates consistent Next.js Metadata objects.
 * Use on every page to ensure SEO consistency across the site.
 */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  keywords = [],
  ogImage = "/images/og-default.jpg",
  noIndex = false,
  path = "",
}: MetadataOptions = {}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_FULL_NAME} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;

  return {
    title: pageTitle,
    description,
    keywords: [
      "RHARK",
      "Reproductive Health Kenya",
      "SRHR Kenya",
      "Siaya County NGO",
      "Youth Empowerment Kenya",
      "Gender Equality Kenya",
      ...keywords,
    ],
    authors: [{ name: SITE_FULL_NAME, url: SITE_URL }],
    creator: SITE_FULL_NAME,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: canonicalUrl },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: pageTitle,
      description,
      siteName: SITE_FULL_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      locale: "en_KE",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
      creator: "@rharkkenya",
      site: "@rharkkenya",
    },
  };
}

/**
 * JSON-LD structured data for the organisation.
 * Injected into the root layout for Google Knowledge Panel eligibility.
 */
export function buildOrganisationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: SITE_FULL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo/rhark-logo.png`,
    description: SITE_DESCRIPTION,
    foundingDate: "2021",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ardhi House, DCC's Building, along Bondo–Kisumu Highway",
      addressLocality: "Bondo",
      addressRegion: "Siaya County",
      postalCode: "40601",
      addressCountry: "KE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "rharkenya@gmail.com",
      contactType: "customer support",
    },
    sameAs: [
      "https://www.facebook.com/RHARK-107471191627975",
      "https://twitter.com/RHARK?s=03",
      "https://www.instagram.com/p/CRv_3AOMiGT/?utm_meddium=copy_link",
      "https://www.linkedin.com/company/reproductive-health-accountability-and-response-kenya-rhark/",
    ],
  };
}

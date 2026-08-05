import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getHomepage } from "@/services/cms";
import { HeroSection } from "@/components/home/HeroSection";
import { ImpactStatsSection } from "@/components/home/ImpactStatsSection";
import { AboutPreviewSection } from "@/components/home/AboutPreviewSection";
import { ProgrammesSection } from "@/components/home/ProgrammesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { StoriesSection } from "@/components/home/StoriesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { GetInvolvedSection } from "@/components/home/GetInvolvedSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { PartnersSection } from "@/components/home/PartnersSection";

export const metadata: Metadata = buildMetadata({
  title: "Home",
  description:
    "Reproductive Health Action and Rights Kenya (RHARK) — advancing SRHR, gender equality, mental health, and youth empowerment in Siaya County, Kenya.",
  path: "/",
});

export default async function HomePage() {
  const homepage = await getHomepage();

  return (
    <>
      <HeroSection content={homepage.hero} />
      <ImpactStatsSection content={homepage.stats} />
      <AboutPreviewSection />
      <ProgrammesSection content={homepage.programmes} />
      <ProjectsSection content={{ heading: "Programmes in action", projects: homepage.projects.map((p) => ({ ...p, tagColor: "bg-primary-100 text-primary-700", image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80", alt: p.title, href: `/projects/${p.title.toLowerCase().replace(/\s+/g, "-")}` })) }} />
      <StoriesSection />
      <NewsSection content={homepage.announcements} />
      <GetInvolvedSection content={homepage.cta} />
      <NewsletterSection />
      <PartnersSection content={{ heading: homepage.partners.length > 0 ? "Working together for greater impact" : "", partners: homepage.partners.map((p: any, i: number) => ({ id: `partner-${i}`, name: p.name, logoUrl: p.logo })) }} />
    </>
  );
}

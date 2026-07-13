import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
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

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ImpactStatsSection />
      <AboutPreviewSection />
      <ProgrammesSection />
      <ProjectsSection />
      <StoriesSection />
      <NewsSection />
      <GetInvolvedSection />
      <NewsletterSection />
      <PartnersSection />
    </>
  );
}

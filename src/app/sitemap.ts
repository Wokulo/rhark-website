import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/constants";

const staticRoutes = [
  ROUTES.home,
  ROUTES.about,
  ROUTES.team,
  ROUTES.partners,
  ROUTES.programmes,
  "/programmes/srhr",
  "/programmes/mental-health",
  "/programmes/hiv-teen-pregnancy",
  "/programmes/gender-equality",
  "/programmes/governance-policy",
  "/programmes/climate-justice",
  ROUTES.projects,
  ROUTES.impact,
  ROUTES.resources,
  ROUTES.news,
  ROUTES.events,
  ROUTES.mediaCentre,
  ROUTES.publications,
  ROUTES.volunteer,
  ROUTES.partner,
  ROUTES.internship,
  ROUTES.donate,
  ROUTES.contact,
  "/privacy",
  "/terms",
  "/accessibility",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === ROUTES.home ? "weekly" : "monthly",
    priority: route === ROUTES.home ? 1 : 0.7,
  }));
}

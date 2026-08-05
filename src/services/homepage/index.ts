import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type HomepageRow = Database["public"]["Tables"]["homepage_content"]["Row"];

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  tertiaryCta: { label: string; href: string };
  videoSrc: string;
  trustBadges: Array<{ value: string; label: string }>;
  images: string[];
}

interface StatItem {
  value: number;
  suffix?: string;
  label: string;
  description: string;
  icon: string;
}

interface ProgrammePreview {
  previewCount: number;
  heading: string;
  subheading: string;
}

interface Partner {
  name: string;
  logo: string;
}

interface ProjectPreview {
  title: string;
  summary: string;
  location: string;
  beneficiaries: string;
  status: string;
  tag: string;
}

interface Announcement {
  title: string;
  excerpt: string;
  date: string;
}

interface CtaSection {
  heading: string;
  subheading: string;
  donate: { title: string; description: string; cta: string };
  volunteer: { title: string; description: string; cta: string };
  internship: { title: string; description: string; cta: string };
}

interface FooterContent {
  orgName: string;
  orgAbbreviation: string;
  orgFounded: string;
  orgType: string;
  orgCounty: string;
  orgAddress: string;
  orgPostalAddress: string;
  orgEmail: string;
  orgPhone: string;
}

interface HomepageContent {
  hero: HeroContent;
  stats: StatItem[];
  programmes: ProgrammePreview;
  partners: Partner[];
  projects: ProjectPreview[];
  announcements: Announcement[];
  cta: CtaSection;
  footer: FooterContent;
}

function parseJsonValue(val: unknown): unknown {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}

function extractField(rows: HomepageRow[], field: string): unknown {
  const row = rows.find((r) => r.field === field && r.is_active);
  if (!row) return null;
  return parseJsonValue(row.value);
}

function extractString(rows: HomepageRow[], field: string, lang: string = "en"): string {
  const val = extractField(rows, field);
  if (val && typeof val === "object" && val !== null && "en" in val) {
    return (val as Record<string, string>).en ?? "";
  }
  if (typeof val === "string") return val;
  return "";
}

function extractNumber(rows: HomepageRow[], field: string): number {
  const val = extractField(rows, field);
  if (typeof val === "number") return val;
  return 0;
}

function extractArray(rows: HomepageRow[], field: string): unknown[] {
  const val = extractField(rows, field);
  if (Array.isArray(val)) return val;
  return [];
}

export async function getHomepageContent(): Promise<HomepageContent> {
  const supabase = await createServerSupabaseClient();

  const { data: rows, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !rows) {
    return getFallbackContent();
  }

  // Hero
  const heroImages = extractArray(rows, "hero.images");
  const hero: HeroContent = {
    title: extractString(rows, "hero.title"),
    subtitle: extractString(rows, "hero.subtitle"),
    description: extractString(rows, "hero.description"),
    primaryCta: { label: extractString(rows, "hero.primary_cta", "en") ?? "", href: extractString(rows, "hero.primary_cta", "en") ?? "" },
    secondaryCta: { label: extractString(rows, "hero.secondary_cta", "en") ?? "", href: extractString(rows, "hero.secondary_cta", "en") ?? "" },
    tertiaryCta: { label: extractString(rows, "hero.tertiary_cta", "en") ?? "", href: extractString(rows, "hero.tertiary_cta", "en") ?? "" },
    videoSrc: extractString(rows, "hero.video_src"),
    trustBadges: [
      { value: extractString(rows, "hero.trust_badge_1"), label: extractString(rows, "hero.trust_badge_1") },
      { value: extractString(rows, "hero.trust_badge_2"), label: extractString(rows, "hero.trust_badge_2") },
      { value: extractString(rows, "hero.trust_badge_3"), label: extractString(rows, "hero.trust_badge_3") },
    ].filter((b) => b.value || b.label),
    images: heroImages.length > 0 ? heroImages.map(String) : [],
  };

  // Stats
  const stats: StatItem[] = [];
  for (let i = 1; i <= 7; i++) {
    const statVal = extractField(rows, `stats.stat_${i}`);
    if (statVal && typeof statVal === "object" && statVal !== null) {
      const s = statVal as Record<string, unknown>;
      stats.push({
        value: typeof s.value === "number" ? s.value : 0,
        suffix: typeof s.suffix === "string" ? s.suffix : undefined,
        label: typeof s.label === "string" ? s.label : "",
        description: typeof s.description === "string" ? s.description : "",
        icon: typeof s.icon === "string" ? s.icon : "Users",
      });
    }
  }

  // Programmes
  const programmes: ProgrammePreview = {
    previewCount: extractNumber(rows, "programmes.preview_count"),
    heading: extractString(rows, "programmes.heading"),
    subheading: extractString(rows, "programmes.subheading"),
  };

  // Partners
  const partners: Partner[] = [];
  for (let i = 1; i <= 3; i++) {
    const name = extractString(rows, `partners.partner_${i}_name`);
    const logo = extractString(rows, `partners.partner_${i}_logo`);
    if (name && logo) {
      partners.push({ name, logo });
    }
  }

  // Projects
  const projects: ProjectPreview[] = [];
  for (let i = 1; i <= 2; i++) {
    const title = extractString(rows, `projects.project_${i}_title`);
    if (title) {
      projects.push({
        title,
        summary: extractString(rows, `projects.project_${i}_summary`),
        location: extractString(rows, `projects.project_${i}_location`),
        beneficiaries: extractString(rows, `projects.project_${i}_beneficiaries`),
        status: extractString(rows, `projects.project_${i}_status`),
        tag: extractString(rows, `projects.project_${i}_tag`),
      });
    }
  }

  // Announcements
  const announcements: Announcement[] = [];
  for (let i = 1; i <= 3; i++) {
    const title = extractString(rows, `announcements.announcement_${i}_title`);
    if (title) {
      announcements.push({
        title,
        excerpt: extractString(rows, `announcements.announcement_${i}_excerpt`),
        date: extractString(rows, `announcements.announcement_${i}_date`),
      });
    }
  }

  // CTA
  const cta: CtaSection = {
    heading: extractString(rows, "cta.heading"),
    subheading: extractString(rows, "cta.subheading"),
    donate: {
      title: extractString(rows, "cta.donate_title"),
      description: extractString(rows, "cta.donate_description"),
      cta: extractString(rows, "cta.donate_cta"),
    },
    volunteer: {
      title: extractString(rows, "cta.volunteer_title"),
      description: extractString(rows, "cta.volunteer_description"),
      cta: extractString(rows, "cta.volunteer_cta"),
    },
    internship: {
      title: extractString(rows, "cta.internship_title"),
      description: extractString(rows, "cta.internship_description"),
      cta: extractString(rows, "cta.internship_cta"),
    },
  };

  // Footer
  const footer: FooterContent = {
    orgName: extractString(rows, "footer.org_name"),
    orgAbbreviation: extractString(rows, "footer.org_abbreviation"),
    orgFounded: extractString(rows, "footer.org_founded"),
    orgType: extractString(rows, "footer.org_type"),
    orgCounty: extractString(rows, "footer.org_county"),
    orgAddress: extractString(rows, "footer.org_address"),
    orgPostalAddress: extractString(rows, "footer.org_postal_address"),
    orgEmail: extractString(rows, "footer.org_email"),
    orgPhone: extractString(rows, "footer.org_phone"),
  };

  return { hero, stats, programmes, partners, projects, announcements, cta, footer };
}

function getFallbackContent(): HomepageContent {
  return {
    hero: {
      title: "Empowering Communities.",
      subtitle: "Community-Based Organization · Since 2021",
      description: "RHARK is a community-based organization in Siaya County, Kenya, dedicated to advancing SRHR, mental health, gender equality, HIV prevention, governance, and climate justice.",
      primaryCta: { label: "Learn About RHARK", href: "/about" },
      secondaryCta: { label: "Explore Our Programs", href: "/programmes" },
      tertiaryCta: { label: "Support Our Mission", href: "/get-involved/donate" },
      videoSrc: "/videos/rhark-story.mp4",
      trustBadges: [
        { value: "10K+", label: "People Reached" },
        { value: "50+", label: "Activities" },
        { value: "5+", label: "Partners" },
      ],
      images: [],
    },
    stats: [],
    programmes: { previewCount: 6, heading: "Integrated approaches to health and rights", subheading: "RHARK delivers holistic programmes across six thematic areas." },
    partners: [],
    projects: [],
    announcements: [],
    cta: { heading: "Join the movement for change", subheading: "", donate: { title: "Donate", description: "", cta: "Donate Now" }, volunteer: { title: "Volunteer", description: "", cta: "Become a Volunteer" }, internship: { title: "Internship", description: "", cta: "Apply for Internship" } },
    footer: { orgName: "RHARK", orgAbbreviation: "RHARK", orgFounded: "2021", orgType: "CBO", orgCounty: "Siaya County", orgAddress: "", orgPostalAddress: "", orgEmail: "rharkenya@gmail.com", orgPhone: "+254 733551415" },
  };
}
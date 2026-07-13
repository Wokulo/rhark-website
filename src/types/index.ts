// ─── Shared Primitive Types ───────────────────────────────────────────────────

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFn<T = void> = () => Promise<T>;

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
  isExternal?: boolean;
}

// ─── SEO / Metadata ───────────────────────────────────────────────────────────

export interface PageSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

// ─── Media ────────────────────────────────────────────────────────────────────

export interface MediaAsset {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
}

// ─── Programme ────────────────────────────────────────────────────────────────

export type ProgrammeSlug =
  | "srhr"
  | "mental-health"
  | "hiv-teen-pregnancy"
  | "gender-equality"
  | "governance-policy"
  | "climate-justice";

export interface Programme {
  id: string;
  slug: ProgrammeSlug;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  color: string;
  image: MediaAsset;
  objectives: string[];
  targetBeneficiaries: string[];
  featuredProjects?: string[]; // Project IDs
}

// ─── Project ──────────────────────────────────────────────────────────────────

export type ProjectStatus = "active" | "completed" | "upcoming";

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  programmeId: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  location: string;
  beneficiariesCount?: number;
  image: MediaAsset;
  gallery?: MediaAsset[];
  partners?: string[];
  tags: string[];
}

// ─── Team Member ──────────────────────────────────────────────────────────────

export type TeamRole = "leadership" | "staff" | "board" | "volunteer";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: TeamRole;
  bio: string;
  image: MediaAsset;
  email?: string;
  linkedin?: string;
  twitter?: string;
}

// ─── News / Blog ──────────────────────────────────────────────────────────────

export type NewsCategory =
  | "news"
  | "press-release"
  | "blog"
  | "success-story"
  | "announcement";

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: NewsCategory;
  author: Pick<TeamMember, "id" | "name" | "image">;
  publishedAt: string;
  updatedAt?: string;
  image: MediaAsset;
  tags: string[];
  readingTimeMinutes: number;
  isFeatured?: boolean;
}

// ─── Publication ──────────────────────────────────────────────────────────────

export type PublicationType =
  | "annual-report"
  | "research"
  | "policy-brief"
  | "factsheet"
  | "newsletter";

export interface Publication {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: PublicationType;
  publishedAt: string;
  fileUrl: string;
  fileSizeKb: number;
  coverImage: MediaAsset;
  tags: string[];
}

// Content prepared for CMS migration
export interface SuccessStory {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  programmeId?: string;
  projectId?: string;
  beneficiaryName?: string;
  beneficiaryLocation?: string;
  publishedAt: string;
  image: MediaAsset;
  tags: string[];
  isFeatured?: boolean;
}

export type DownloadType =
  | "report"
  | "toolkit"
  | "policy"
  | "factsheet"
  | "form"
  | "media-kit";

export interface DownloadAsset {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: DownloadType;
  fileUrl: string;
  fileSizeKb: number;
  publishedAt: string;
  tags: string[];
}

// ─── Event ────────────────────────────────────────────────────────────────────

export type EventType = "workshop" | "webinar" | "conference" | "community" | "training";

export interface RharkEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: EventType;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  registrationUrl?: string;
  image: MediaAsset;
  isFeatured?: boolean;
}

// ─── Impact Statistics ────────────────────────────────────────────────────────

export interface ImpactStat {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  description?: string;
  icon?: string;
}

// ─── Partner / Donor ──────────────────────────────────────────────────────────

export type PartnerType = "funder" | "implementing" | "government" | "media" | "academic";

export interface Partner {
  id: string;
  name: string;
  logo: MediaAsset;
  website?: string;
  type: PartnerType;
  description?: string;
  isFeatured?: boolean;
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
}

export interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  county: string;
  skills: string;
  availability: string;
  motivation: string;
}

export interface PartnershipInquiryFormData {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message: string;
}

export interface DonationInquiryFormData {
  donorName: string;
  email: string;
  phone?: string;
  amount?: number;
  donationType: "one-time" | "monthly" | "in-kind" | "corporate";
  message?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

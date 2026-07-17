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

// ─── Donation System Types ─────────────────────────────────────────────────────

export type DonationStatus = "pending" | "successful" | "failed" | "cancelled";

export type PaymentMethod = "mpesa" | "bank-transfer" | "card" | "other";

export interface Donation {
  id: string;
  transactionId: string;
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: DonationStatus;
  isRecurring: boolean;
  campaignId?: string;
  message?: string;
  mpesaReceiptNumber?: string;
  mpesaCheckoutRequestId?: string;
  createdAt: string;
  updatedAt: string;
  emailHistory: EmailMessageRef[];
}

export interface EmailMessageRef {
  emailId: string;
  type: string;
  sentAt: string;
}

// ─── Contact / Inquiry System Types ───────────────────────────────────────────

export type ContactStatus = "new" | "read" | "replied" | "closed";
export type InquiryType = "general" | "information" | "partnership" | "program";

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject: string;
  message: string;
  programOfInterest?: string;
  inquiryType: InquiryType;
  status: ContactStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  emailHistory: EmailMessageRef[];
}

// ─── Email System Types ────────────────────────────────────────────────────────

export type EmailStatus = "sent" | "failed" | "queued";

export type EmailTemplateType =
  | "welcome"
  | "contact-confirmation"
  | "info-request-confirmation"
  | "donation-thank-you"
  | "donation-receipt"
  | "donation-failed"
  | "admin-notification"
  | "contact-reply"
  | "password-reset"
  | "account-verification";

export interface EmailMessage {
  id: string;
  templateType: EmailTemplateType;
  to: string;
  from: string;
  subject: string;
  body: string;
  status: EmailStatus;
  errorMessage?: string;
  referenceId?: string; // link to ContactRequest or Donation id
  referenceType?: "contact" | "donation";
  createdAt: string;
  sentAt?: string;
}

export interface CommunicationThread {
  id: string;
  contactRequestId: string;
  messages: {
    from: "user" | "admin";
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

export interface Notification {
  id: string;
  type: "new-contact" | "new-donation" | "donation-success" | "donation-failed" | "email-failed";
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: "contact" | "donation";
  isRead: boolean;
  createdAt: string;
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  organization?: string;
  programOfInterest?: string;
}

export interface NewsletterFormData {
  email: string;
  firstName?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: string;
  source?: string;
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

export interface DonationFormData {
  donorName: string;
  email: string;
  phone: string;
  amount: number;
  paymentMethod: PaymentMethod;
  isRecurring: boolean;
  message?: string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalDonations: number;
  totalDonationAmount: number;
  pendingDonations: number;
  successfulDonations: number;
  totalContacts: number;
  newContacts: number;
  totalEmailsSent: number;
  failedEmails: number;
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface DonationFilter {
  status?: DonationStatus;
  paymentMethod?: PaymentMethod;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "amount" | "status";
  sortOrder?: "asc" | "desc";
}

export interface ContactFilter {
  status?: ContactStatus;
  inquiryType?: InquiryType;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "createdAt" | "status";
  sortOrder?: "asc" | "desc";
}
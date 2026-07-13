import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, Calendar, MapPin, Clock, Users } from "lucide-react";
import { cn } from "@/utils";
import { Badge } from "./data-display";

// ─── Programme Card ───────────────────────────────────────────────────────────

interface ProgrammeCardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
  color?: "primary" | "accent" | "secondary";
  className?: string;
}

const programmeColors = {
  primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
  accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
  secondary: "bg-secondary-50 text-secondary-500 group-hover:bg-secondary-100",
};

export function ProgrammeCard({ title, description, href, icon, color = "primary", className }: ProgrammeCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200",
        "transition-all duration-250 hover:shadow-lg hover:-translate-y-1 hover:ring-neutral-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
    >
      {icon && (
        <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-250", programmeColors[color])}>
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
        {title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-500 group-hover:gap-2 transition-all duration-150">
        Learn more <ArrowRight size={14} aria-hidden="true" />
      </span>
    </Link>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

interface ProjectCardProps {
  title: string;
  summary: string;
  href: string;
  image: { src: string; alt: string };
  status: "active" | "completed" | "upcoming";
  location?: string;
  beneficiariesCount?: number;
  tags?: string[];
  className?: string;
}

const statusBadge = {
  active: "success" as const,
  completed: "neutral" as const,
  upcoming: "accent" as const,
};

export function ProjectCard({ title, summary, href, image, status, location, beneficiariesCount, tags, className }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200",
        "transition-all duration-250 hover:shadow-lg hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute top-3 left-3">
          <Badge variant={statusBadge[status]} className="capitalize">{status}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{summary}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-400">
          {location && (
            <span className="flex items-center gap-1"><MapPin size={12} aria-hidden="true" />{location}</span>
          )}
          {beneficiariesCount && (
            <span className="flex items-center gap-1"><Users size={12} aria-hidden="true" />{beneficiariesCount.toLocaleString()} reached</span>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="neutral">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────

interface NewsCardProps {
  title: string;
  excerpt: string;
  href: string;
  image: { src: string; alt: string };
  category: string;
  publishedAt: string;
  readingTimeMinutes?: number;
  className?: string;
}

export function NewsCard({ title, excerpt, href, image, category, publishedAt, readingTimeMinutes, className }: NewsCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200",
        "transition-all duration-250 hover:shadow-lg hover:-translate-y-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
        className
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
        <Image src={image.src} alt={image.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <Badge variant="primary" className="capitalize">{category.replace("-", " ")}</Badge>
          <span className="flex items-center gap-1"><Calendar size={11} aria-hidden="true" />{publishedAt}</span>
          {readingTimeMinutes && (
            <span className="flex items-center gap-1"><Clock size={11} aria-hidden="true" />{readingTimeMinutes} min read</span>
          )}
        </div>
        <h3 className="mt-3 font-display text-base font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150 line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">{excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-500 group-hover:gap-2 transition-all duration-150">
          Read more <ArrowRight size={14} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

// ─── Publication Card ─────────────────────────────────────────────────────────

interface PublicationCardProps {
  title: string;
  description: string;
  type: string;
  publishedAt: string;
  fileUrl: string;
  fileSizeKb?: number;
  coverImage?: { src: string; alt: string };
  className?: string;
}

export function PublicationCard({ title, description, type, publishedAt, fileUrl, fileSizeKb, coverImage, className }: PublicationCardProps) {
  return (
    <div className={cn("flex gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-neutral-200", className)}>
      {coverImage && (
        <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          <Image src={coverImage.src} alt={coverImage.alt} fill className="object-cover" sizes="64px" />
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <Badge variant="primary" className="capitalize">{type.replace("-", " ")}</Badge>
          <span className="text-xs text-neutral-400">{publishedAt}</span>
        </div>
        <h3 className="mt-2 font-display text-sm font-bold text-neutral-900 line-clamp-2">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-neutral-500 line-clamp-2">{description}</p>
        <a
          href={fileUrl}
          download
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
        >
          <Download size={12} aria-hidden="true" />
          Download PDF{fileSizeKb && ` (${Math.round(fileSizeKb / 1024 * 10) / 10} MB)`}
        </a>
      </div>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  location?: string;
  image?: { src: string; alt: string };
  className?: string;
}

export function TestimonialCard({ quote, name, role, location, image, className }: TestimonialCardProps) {
  return (
    <figure className={cn("flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200", className)}>
      <blockquote className="flex-1">
        <p className="text-sm leading-relaxed text-neutral-600 italic">&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        {image ? (
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-neutral-100">
            <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="40px" />
          </div>
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-600">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-neutral-900">{name}</p>
          {(role || location) && (
            <p className="text-xs text-neutral-400">{[role, location].filter(Boolean).join(" · ")}</p>
          )}
        </div>
      </figcaption>
    </figure>
  );
}

// ─── Team Card ────────────────────────────────────────────────────────────────

interface TeamCardProps {
  name: string;
  title: string;
  bio?: string;
  image: { src: string; alt: string };
  email?: string;
  linkedin?: string;
  twitter?: string;
  className?: string;
}

export function TeamCard({ name, title, bio, image, email, linkedin, twitter, className }: TeamCardProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-neutral-200", className)}>
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-neutral-100 ring-4 ring-primary-50">
        <Image src={image.src} alt={image.alt} fill className="object-cover" sizes="96px" />
      </div>
      <h3 className="mt-4 font-display text-base font-bold text-neutral-900">{name}</h3>
      <p className="mt-1 text-sm text-primary-500 font-medium">{title}</p>
      {bio && <p className="mt-3 text-xs leading-relaxed text-neutral-500 line-clamp-3">{bio}</p>}
      {(email || linkedin || twitter) && (
        <div className="mt-4 flex items-center justify-center gap-3">
          {email && (
            <a href={`mailto:${email}`} className="text-xs text-neutral-400 hover:text-primary-500 transition-colors" aria-label={`Email ${name}`}>
              Email
            </a>
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-primary-500 transition-colors" aria-label={`${name} on LinkedIn`}>
              LinkedIn
            </a>
          )}
          {twitter && (
            <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-neutral-400 hover:text-primary-500 transition-colors" aria-label={`${name} on Twitter`}>
              Twitter
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Partner Card ─────────────────────────────────────────────────────────────

interface PartnerCardProps {
  name: string;
  logo: { src: string; alt: string };
  website?: string;
  type?: string;
  className?: string;
}

export function PartnerCard({ name, logo, website, type, className }: PartnerCardProps) {
  const inner = (
    <div className={cn(
      "flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200",
      "transition-all duration-250 hover:shadow-md hover:ring-neutral-300",
      className
    )}>
      <div className="relative h-12 w-full">
        <Image src={logo.src} alt={logo.alt} fill className="object-contain" sizes="200px" />
      </div>
      <p className="text-xs font-medium text-neutral-500">{name}</p>
      {type && <Badge variant="neutral" className="capitalize">{type}</Badge>}
    </div>
  );

  if (website) {
    return (
      <a href={website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${name} website`}
        className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl block">
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Statistic Card ───────────────────────────────────────────────────────────

interface StatisticCardProps {
  value: string | number;
  suffix?: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  tone?: "primary" | "accent" | "white";
  className?: string;
}

const statTones = {
  primary: "bg-primary-500 text-white",
  accent: "bg-accent-500 text-white",
  white: "bg-white text-neutral-900 ring-1 ring-neutral-200",
};

export function StatisticCard({ value, suffix, label, description, icon, tone = "white", className }: StatisticCardProps) {
  return (
    <div className={cn("rounded-2xl p-6 shadow-sm", statTones[tone], className)}>
      {icon && (
        <div className={cn("mb-3 flex h-10 w-10 items-center justify-center rounded-xl", tone === "white" ? "bg-primary-50 text-primary-500" : "bg-white/20 text-white")}>
          {icon}
        </div>
      )}
      <p className={cn("font-display text-4xl font-extrabold tracking-tight", tone === "white" ? "text-primary-600" : "text-white")}>
        {value}{suffix}
      </p>
      <p className={cn("mt-1 text-sm font-semibold", tone === "white" ? "text-neutral-700" : "text-white/90")}>
        {label}
      </p>
      {description && (
        <p className={cn("mt-1 text-xs leading-relaxed", tone === "white" ? "text-neutral-400" : "text-white/70")}>
          {description}
        </p>
      )}
    </div>
  );
}

import { cn } from "@/utils";

// ─── Container ────────────────────────────────────────────────────────────────

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean; // max-w-4xl for prose pages
}

export function Container({ children, className, narrow = false }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-4xl" : "max-w-7xl",
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

type SectionTone = "white" | "muted" | "dark" | "primary" | "accent";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tone?: SectionTone;
  as?: React.ElementType;
  contained?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  ariaLabel?: string;
}

const toneBg: Record<SectionTone, string> = {
  white: "bg-white",
  muted: "bg-neutral-50",
  dark: "bg-neutral-900 text-white",
  primary: "bg-primary-600 text-white",
  accent: "bg-accent-500 text-white",
};

const paddingMap = {
  none: "",
  sm: "py-10 md:py-14 lg:py-16",
  md: "py-16 md:py-20 lg:py-24",
  lg: "py-20 md:py-28 lg:py-32",
};

export function Section({
  children,
  className,
  id,
  tone = "white",
  as: Tag = "section",
  contained = true,
  padding = "md",
  ariaLabel,
}: SectionProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      className={cn(toneBg[tone], paddingMap[padding], className)}
    >
      {contained ? <Container>{children}</Container> : children}
    </Tag>
  );
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const gapMap = { sm: "gap-4", md: "gap-6", lg: "gap-8 lg:gap-10" };

export function Grid({ children, cols = 3, gap = "md", className }: GridProps) {
  return (
    <div className={cn("grid", colsMap[cols], gapMap[gap], className)}>
      {children}
    </div>
  );
}

// ─── Stack ────────────────────────────────────────────────────────────────────

interface StackProps {
  children: React.ReactNode;
  gap?: "xs" | "sm" | "md" | "lg";
  className?: string;
  as?: React.ElementType;
}

const stackGap = { xs: "space-y-2", sm: "space-y-4", md: "space-y-6", lg: "space-y-10" };

export function Stack({ children, gap = "md", className, as: Tag = "div" }: StackProps) {
  return <Tag className={cn(stackGap[gap], className)}>{children}</Tag>;
}

// ─── PageHeader ───────────────────────────────────────────────────────────────

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  className?: string;
}

export function PageHeader({ eyebrow, title, description, breadcrumb, className }: PageHeaderProps) {
  return (
    <section
      className={cn(
        "bg-gradient-to-br from-primary-600 to-primary-800 py-24 lg:py-32",
        className
      )}
      aria-labelledby="page-header-title"
    >
      <Container>
        <div className="text-center">
          {eyebrow && (
            <p className="text-sm font-bold uppercase tracking-widest text-primary-200">
              {eyebrow}
            </p>
          )}
          <h1
            id="page-header-title"
            className="mt-3 font-display text-4xl font-extrabold text-white text-balance lg:text-5xl"
          >
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-primary-200">
              {description}
            </p>
          )}
          {breadcrumb && breadcrumb.length > 0 && (
            <nav
              aria-label="Breadcrumb"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-primary-300"
            >
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {crumb.href ? (
                    <a href={crumb.href} className="hover:text-white transition-colors">
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-white" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>
      </Container>
    </section>
  );
}

import { cn } from "@/utils";

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = "primary" | "accent" | "secondary" | "success" | "warning" | "error" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-primary-100 text-primary-700",
  accent: "bg-accent-100 text-accent-700",
  secondary: "bg-secondary-100 text-secondary-700",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  error: "bg-error-50 text-error-600",
  neutral: "bg-neutral-100 text-neutral-600",
};

export function Badge({ variant = "primary", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export function Card({ children, className, hover = false, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200",
        hover && "transition-shadow duration-250 hover:shadow-lg hover:ring-neutral-300",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6 pb-0", className)}>{children}</div>;
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-t border-neutral-100 px-6 py-4", className)}>{children}</div>
  );
}

// ─── Section Container ────────────────────────────────────────────────────────

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
  contained?: boolean;
}

export function Section({ children, className, id, as: Tag = "section", contained = true }: SectionProps) {
  return (
    <Tag id={id} className={cn("section-padding", className)}>
      {contained ? <div className="container-site">{children}</div> : children}
    </Tag>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ eyebrow, title, description, centered = false, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-12", centered && "text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-fluid-lg font-display font-bold text-neutral-900 text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-lg text-neutral-600 text-balance">
          {description}
        </p>
      )}
    </div>
  );
}

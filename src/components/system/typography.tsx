import { cn } from "@/utils";

// ─── Heading ──────────────────────────────────────────────────────────────────

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
  balance?: boolean;
}

const headingSizes: Record<number, string> = {
  1: "text-4xl lg:text-5xl font-extrabold",
  2: "text-3xl lg:text-4xl font-extrabold",
  3: "text-2xl lg:text-3xl font-bold",
  4: "text-xl lg:text-2xl font-bold",
  5: "text-lg font-semibold",
  6: "text-base font-semibold",
};

export function Heading({ level = 2, children, className, id, balance = true }: HeadingProps) {
  const Tag = `h${level}` as React.ElementType;
  return (
    <Tag
      id={id}
      className={cn(
        "font-display text-neutral-900 tracking-tight",
        headingSizes[level],
        balance && "text-balance",
        className
      )}
    >
      {children}
    </Tag>
  );
}

// ─── SubHeading (eyebrow label above a heading) ───────────────────────────────

interface SubHeadingProps {
  children: React.ReactNode;
  className?: string;
  tone?: "primary" | "accent" | "neutral";
}

const subTones = {
  primary: "text-primary-500",
  accent: "text-accent-600",
  neutral: "text-neutral-500",
};

export function SubHeading({ children, className, tone = "primary" }: SubHeadingProps) {
  return (
    <p
      className={cn(
        "text-sm font-bold uppercase tracking-widest",
        subTones[tone],
        className
      )}
    >
      {children}
    </p>
  );
}

// ─── Paragraph ────────────────────────────────────────────────────────────────

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "base" | "lg";
  muted?: boolean;
}

const paraSize = { sm: "text-sm", base: "text-base", lg: "text-lg" };

export function Paragraph({ children, className, size = "base", muted = false }: ParagraphProps) {
  return (
    <p
      className={cn(
        "leading-relaxed",
        paraSize[size],
        muted ? "text-neutral-500" : "text-neutral-600",
        className
      )}
    >
      {children}
    </p>
  );
}

// ─── Caption ──────────────────────────────────────────────────────────────────

export function Caption({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-xs text-neutral-400 leading-relaxed", className)}>
      {children}
    </p>
  );
}

// ─── Blockquote ───────────────────────────────────────────────────────────────

interface BlockquoteProps {
  quote: string;
  attribution?: string;
  role?: string;
  className?: string;
}

export function Blockquote({ quote, attribution, role: attributionRole, className }: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "relative border-l-4 border-primary-400 pl-6 py-2",
        className
      )}
    >
      <p className="text-lg font-medium italic leading-relaxed text-neutral-700">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <footer className="mt-3 text-sm text-neutral-500">
          <cite className="not-italic font-semibold text-neutral-700">{attribution}</cite>
          {attributionRole && <span className="ml-1">— {attributionRole}</span>}
        </footer>
      )}
    </blockquote>
  );
}

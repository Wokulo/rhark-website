import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "destructive" | "outline" | "link";
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

// ─── Shared style maps ────────────────────────────────────────────────────────

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white shadow-teal-sm hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
  secondary:
    "border-2 border-primary-500 text-primary-600 bg-transparent hover:bg-primary-50 active:bg-primary-100 disabled:border-neutral-300 disabled:text-neutral-400",
  accent:
    "bg-accent-500 text-white shadow-amber hover:bg-accent-600 active:bg-accent-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
  destructive:
    "bg-error-500 text-white hover:bg-error-600 active:bg-error-600 disabled:bg-neutral-300 disabled:text-neutral-500",
  outline:
    "border border-neutral-300 text-neutral-700 bg-white hover:border-primary-400 hover:text-primary-600 disabled:text-neutral-400",
  link: "bg-transparent text-primary-500 underline-offset-4 hover:underline disabled:text-neutral-400 p-0 h-auto rounded-none",
};

const sizes: Record<ButtonSize, string> = {
  xs: "h-8 px-3 text-xs gap-1",
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  icon: "h-11 w-11 p-0",
};

const base =
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed";

// ─── Button ───────────────────────────────────────────────────────────────────

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" className="mr-1.5" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  )
);
Button.displayName = "Button";

// ─── ButtonLink ───────────────────────────────────────────────────────────────
// Use for navigation CTAs — renders a Next.js Link styled as a button.

interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className,
  children,
  external = false,
}: ButtonLinkProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
      {children}
      {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
    </Link>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────
// Icon-only button — always requires an aria-label.

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ ariaLabel, variant = "ghost", size = "icon", className, children, ...props }, ref) => (
    <button
      ref={ref}
      aria-label={ariaLabel}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
    </button>
  )
);
IconButton.displayName = "IconButton";

// ─── Spinner (internal) ───────────────────────────────────────────────────────

function Spinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const s = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <svg
      className={cn("animate-spin", s[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

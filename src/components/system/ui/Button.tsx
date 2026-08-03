import { forwardRef } from "react";
import { cn } from "@/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "destructive" | "link";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

// ─── Variant & Size Maps ──────────────────────────────────────────────────────

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white shadow-teal-sm hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
  secondary:
    "border-2 border-primary-500 text-primary-500 bg-transparent hover:bg-primary-50 active:bg-primary-100 disabled:border-neutral-300 disabled:text-neutral-400",
  accent:
    "bg-accent-500 text-white shadow-amber hover:bg-accent-600 active:bg-accent-700 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-none",
  ghost:
    "bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 disabled:text-neutral-400",
  destructive:
    "bg-error-500 text-white hover:bg-error-600 active:bg-error-600 disabled:bg-neutral-300 disabled:text-neutral-500",
  link: "bg-transparent text-primary-500 underline-offset-4 hover:underline disabled:text-neutral-400 p-0 h-auto",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
  icon: "h-11 w-11 p-0",
};

// ─── Component ────────────────────────────────────────────────────────────────

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
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center rounded-full font-semibold",
          "transition-all duration-150 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed",
          // Variant & size
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" aria-hidden="true" />
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
    );
  }
);

Button.displayName = "Button";

// ─── Loading Spinner (used internally by Button) ──────────────────────────────

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: SpinnerProps) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  return (
    <svg
      className={cn("animate-spin", sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading"
      role="status"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

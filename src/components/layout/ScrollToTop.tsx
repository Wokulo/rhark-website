"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/utils";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const SHOW_THRESHOLD = 400;
const CIRCUMFERENCE = 2 * Math.PI * 18; // radius = 18

export function ScrollToTop() {
  const { scrollY } = useScrollPosition();
  const [mounted, setMounted] = useState(false);
  const [docHeight, setDocHeight] = useState(0);

  useEffect(() => {
    setMounted(true);
    const updateHeight = () => {
      setDocHeight(document.documentElement.scrollHeight - window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  if (!mounted) return null;

  const isVisible = scrollY > SHOW_THRESHOLD;
  const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label={`Scroll to top of page — ${Math.round(progress * 100)}% read`}
      className={cn(
        "fixed bottom-6 right-6 z-sticky",
        "flex h-12 w-12 items-center justify-center",
        "rounded-full bg-white shadow-lg ring-1 ring-neutral-200",
        "transition-all duration-300",
        "hover:shadow-teal hover:ring-primary-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 44 44"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="2.5"
        />
        {/* Progress */}
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke="#0D6E6E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          className="transition-[stroke-dashoffset] duration-150"
        />
      </svg>
      {/* Arrow icon */}
      <ArrowUp
        size={16}
        className="relative z-10 text-primary-600"
        aria-hidden="true"
      />
    </button>
  );
}

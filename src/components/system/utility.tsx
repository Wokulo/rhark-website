"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Loader2, X } from "lucide-react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { cn } from "@/utils";
import { Button, IconButton } from "./buttons";

/**
 * SystemThemeProvider enables class-based dark mode for future expansion.
 *
 * @example
 * <SystemThemeProvider><App /></SystemThemeProvider>
 */
export function SystemThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}

/**
 * ScrollToTopButton appears after scrolling and returns users to page top.
 *
 * @example
 * <ScrollToTopButton />
 */
export function ScrollToTopButton({ threshold = 400 }: { threshold?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > threshold);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [threshold]);

  if (!visible) return null;
  return (
    <IconButton
      ariaLabel="Scroll to top"
      className="fixed bottom-6 right-6 z-tooltip shadow-lg"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </IconButton>
  );
}

/**
 * CookieBanner requests consent and persists the response locally.
 *
 * @example
 * <CookieBanner version="2026-07" />
 */
export function CookieBanner({ version = "1", className }: { version?: string; className?: string }) {
  const key = `rhark-cookie-consent-${version}`;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(key) !== "accepted");
  }, [key]);

  const accept = () => {
    localStorage.setItem(key, "accepted");
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className={cn("fixed bottom-4 left-4 right-4 z-toast rounded-2xl bg-white p-5 shadow-xl ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800 md:left-auto md:max-w-md", className)} role="region" aria-label="Cookie consent">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="font-display text-base font-bold text-neutral-950 dark:text-white">Cookie preferences</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">RHARK uses essential cookies to improve site reliability and remember consent choices.</p>
        </div>
        <IconButton ariaLabel="Close cookie banner" variant="ghost" className="h-9 w-9" onClick={() => setVisible(false)}>
          <X size={18} aria-hidden="true" />
        </IconButton>
      </div>
      <Button className="mt-4 w-full" onClick={accept}>Accept</Button>
    </div>
  );
}

/**
 * LoadingScreen covers full-page loading states.
 *
 * @example
 * <LoadingScreen label="Loading RHARK" />
 */
export function LoadingScreen({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-white text-primary-600 dark:bg-neutral-950" role="status" aria-label={label}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden="true" />
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{label}</p>
      </div>
    </div>
  );
}

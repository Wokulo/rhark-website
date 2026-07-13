"use client";

import { ThemeProvider } from "next-themes";

/**
 * Wraps the application with next-themes ThemeProvider.
 * Enables dark mode via the "class" strategy (adds/removes "dark" on <html>).
 * disableTransitionOnChange prevents flash of unstyled content during theme switch.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}

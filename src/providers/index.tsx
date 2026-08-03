"use client";

import { useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  attribute?: "class" | "data-theme";
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  enableSystem = false,
  disableTransitionOnChange = false,
  attribute = "class",
}: ThemeProviderProps) {
  useEffect(() => {
    const getSystemTheme = (): Theme =>
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

    const stored = localStorage.getItem("theme") as Theme | null;
    let resolved: Theme;

    if (stored) {
      resolved = stored;
    } else if (enableSystem) {
      resolved = getSystemTheme();
    } else {
      resolved = defaultTheme;
    }

    const root = document.documentElement;
    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
    } else if (attribute === "data-theme") {
      root.setAttribute("data-theme", resolved);
    }

    let style: HTMLStyleElement | undefined;
    if (disableTransitionOnChange) {
      style = document.createElement("style");
      style.appendChild(
        document.createTextNode(
          "*,*::before,*::after{transition:none!important;}",
        ),
      );
      document.head.appendChild(style);
    }

    return () => style?.remove();
  }, [defaultTheme, enableSystem, disableTransitionOnChange, attribute]);

  return <>{children}</>;
}

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

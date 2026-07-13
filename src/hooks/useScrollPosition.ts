"use client";

import { useState, useEffect } from "react";

/**
 * Tracks vertical scroll position and direction.
 * Used for sticky header show/hide behaviour and scroll-to-top button.
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setIsAtTop(currentY < 10);
      setDirection(currentY > lastY ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, direction, isAtTop };
}

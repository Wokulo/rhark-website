"use client";

import { useState, useEffect, useRef, type RefObject } from "react";

interface Options extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

/**
 * Observes when an element enters the viewport.
 * Used for triggering animations and lazy-loading content.
 *
 * @param options.freezeOnceVisible - Stop observing after first intersection (default: true)
 */
export function useIntersectionObserver<T extends Element>(
  options: Options = {}
): { ref: RefObject<T | null>; isVisible: boolean } {
  const { threshold = 0.1, root = null, rootMargin = "0px", freezeOnceVisible = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (freezeOnceVisible) observer.unobserve(element);
        } else if (!freezeOnceVisible) {
          setIsVisible(false);
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref, isVisible };
}

"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to error reporting service (e.g. Sentry) when integrated
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-error-500">Error</p>
      <h1 className="mt-4 text-4xl font-bold text-neutral-900">Something went wrong</h1>
      <p className="mt-4 max-w-md text-neutral-600">
        An unexpected error occurred. Please try again or return to the homepage.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          onClick={reset}
          className="inline-flex h-11 items-center rounded-full bg-primary-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex h-11 items-center rounded-full border-2 border-primary-500 px-6 text-sm font-semibold text-primary-500 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

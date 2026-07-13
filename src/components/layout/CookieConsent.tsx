"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Cookie, X, Check, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConsentState = "pending" | "accepted" | "declined" | "custom";

interface ConsentPreferences {
  necessary: true; // Always true — cannot be disabled
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEY = "rhark-cookie-consent";
const STORAGE_VERSION = "1"; // Bump to re-prompt after policy changes

// ─── Cookie Consent Banner ────────────────────────────────────────────────────

export function CookieConsent() {
  const [state, setState] = useState<ConsentState | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === "pending" && bannerRef.current) {
      const updatePadding = () => {
        if (bannerRef.current) {
          const height = bannerRef.current.getBoundingClientRect().height;
          document.body.style.paddingBottom = `${height + 16}px`;
        }
      };
      updatePadding();
      return () => {
        document.body.style.paddingBottom = "";
      };
    }
  }, [state, showDetails]);

  // Read stored consent on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Re-prompt if version changed (policy update)
        if (parsed.version === STORAGE_VERSION) {
          setState(parsed.state);
          return;
        }
      }
    } catch {
      // Ignore parse errors — treat as no consent stored
    }
    setState("pending");
  }, []);

  const saveConsent = useCallback(
    (newState: ConsentState, prefs: ConsentPreferences) => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ state: newState, preferences: prefs, version: STORAGE_VERSION })
        );
      } catch {
        // localStorage may be unavailable in private browsing
      }
      setState(newState);
      // TODO: When analytics is integrated, conditionally load scripts here
      // if (prefs.analytics) loadAnalytics();
    },
    []
  );

  const acceptAll = useCallback(() => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(prefs);
    saveConsent("accepted", prefs);
  }, [saveConsent]);

  const declineAll = useCallback(() => {
    const prefs: ConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(prefs);
    saveConsent("declined", prefs);
  }, [saveConsent]);

  const saveCustom = useCallback(() => {
    saveConsent("custom", preferences);
  }, [saveConsent, preferences]);

  // Don't render until we know the consent state (avoids SSR flash)
  if (state === null || state === "accepted" || state === "declined" || state === "custom") {
    return null;
  }

  return (
    <>
      {/* Backdrop blur on mobile */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[490] bg-neutral-900/20 backdrop-blur-[2px] sm:hidden"
      />

      {/* Banner */}
      <div
        ref={bannerRef}
        role="dialog"
        aria-modal="false"
        aria-label="Cookie consent"
        aria-describedby="cookie-desc"
        className={cn(
          "fixed bottom-4 left-4 right-4 z-[495] mx-auto max-w-2xl",
          "rounded-2xl bg-white shadow-2xl ring-1 ring-neutral-200",
          "animate-fade-up"
        )}
      >
        {/* Main content */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50">
              <Cookie size={20} className="text-primary-500" aria-hidden="true" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-display text-base font-bold text-neutral-900">
                We use cookies
              </h2>
              <p id="cookie-desc" className="mt-1 text-sm leading-relaxed text-neutral-600">
                RHARK uses cookies to improve your experience and analyse site usage. We comply
                with the{" "}
                <strong className="font-semibold">Kenya Data Protection Act 2019</strong>.{" "}
                <Link
                  href="/privacy"
                  className="text-primary-500 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
                >
                  Read our Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Expandable details */}
          <div className="mt-4">
            <button
              onClick={() => setShowDetails((v) => !v)}
              aria-expanded={showDetails}
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium text-neutral-500",
                "hover:text-primary-500 transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
              )}
            >
              <Settings size={12} aria-hidden="true" />
              Manage preferences
              <ChevronDown
                size={12}
                aria-hidden="true"
                className={cn(
                  "transition-transform duration-200",
                  showDetails && "rotate-180"
                )}
              />
            </button>

            {showDetails && (
              <div className="mt-4 space-y-3 rounded-xl bg-neutral-50 p-4">
                {/* Necessary — always on */}
                <CookieToggle
                  id="cookie-necessary"
                  label="Strictly Necessary"
                  description="Required for the website to function. Cannot be disabled."
                  checked={true}
                  disabled={true}
                  onChange={() => {}}
                />
                {/* Analytics */}
                <CookieToggle
                  id="cookie-analytics"
                  label="Analytics"
                  description="Help us understand how visitors use the site (e.g. Google Analytics)."
                  checked={preferences.analytics}
                  onChange={(v) =>
                    setPreferences((p) => ({ ...p, analytics: v }))
                  }
                />
                {/* Marketing */}
                <CookieToggle
                  id="cookie-marketing"
                  label="Marketing"
                  description="Used to show relevant content and measure campaign effectiveness."
                  checked={preferences.marketing}
                  onChange={(v) =>
                    setPreferences((p) => ({ ...p, marketing: v }))
                  }
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            {showDetails ? (
              <>
                <button
                  onClick={declineAll}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-600",
                    "border border-neutral-200 hover:bg-neutral-50 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  )}
                >
                  Decline all
                </button>
                <button
                  onClick={saveCustom}
                  className={cn(
                    "rounded-full border-2 border-primary-500 px-4 py-2.5 text-sm font-semibold text-primary-600",
                    "hover:bg-primary-50 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  )}
                >
                  Save preferences
                </button>
                <button
                  onClick={acceptAll}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-5 py-2.5 text-sm font-bold text-white",
                    "hover:bg-primary-600 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  )}
                >
                  <Check size={14} aria-hidden="true" />
                  Accept all
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={declineAll}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-600",
                    "border border-neutral-200 hover:bg-neutral-50 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                  )}
                >
                  Decline
                </button>
                <button
                  onClick={acceptAll}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-6 py-2.5 text-sm font-bold text-white",
                    "hover:bg-primary-600 transition-colors duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                  )}
                >
                  <Check size={14} aria-hidden="true" />
                  Accept all cookies
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Cookie Toggle Row ────────────────────────────────────────────────────────

interface CookieToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

function CookieToggle({
  id,
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-semibold",
            disabled ? "text-neutral-400" : "text-neutral-800"
          )}
        >
          {label}
          {disabled && (
            <span className="ml-2 rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
              Always on
            </span>
          )}
        </label>
        <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{description}</p>
      </div>
      {/* Toggle switch */}
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
          "transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          checked ? "bg-primary-500" : "bg-neutral-300",
          disabled && "cursor-not-allowed opacity-60"
        )}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm",
            "transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

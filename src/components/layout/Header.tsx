"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Heart,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/utils";
import { NAV_ITEMS, ORG, ROUTES } from "@/constants";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import type { NavItem } from "@/types";

// ─── Announcement Bar ─────────────────────────────────────────────────────────

function AnnouncementBar({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      role="banner"
      aria-label="Site announcement"
      className="relative bg-primary-600 px-4 py-2.5 text-center text-xs font-medium text-white sm:text-sm"
    >
      <span>
        🌍 RHARK is hiring — join our team in Siaya County.{" "}
        <Link
          href="/get-involved/volunteer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          Learn more <ChevronRight size={12} aria-hidden="true" />
        </Link>
      </span>
      <button
        onClick={onDismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}

// ─── Desktop Mega Dropdown ────────────────────────────────────────────────────

function MegaDropdown({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive =
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    ) ?? pathname === item.href;

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  if (!item.children) {
    return (
      <Link
        href={item.href}
        className={cn(
          "relative rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
          "hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
          isActive ? "text-primary-500" : "text-neutral-700"
        )}
        aria-current={pathname === item.href ? "page" : undefined}
      >
        {item.label}
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-500" />
        )}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "relative flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150",
          "hover:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1",
          isActive ? "text-primary-500" : "text-neutral-700"
        )}
      >
        {item.label}
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180"
          )}
        />
        {isActive && (
          <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary-500" />
        )}
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        aria-label={`${item.label} submenu`}
        onMouseLeave={() => setOpen(false)}
        className={cn(
          "absolute left-0 top-full z-dropdown mt-2 min-w-[240px] rounded-2xl bg-white p-2",
          "shadow-xl ring-1 ring-neutral-200/80",
          "transition-all duration-200 origin-top",
          open
            ? "pointer-events-auto translate-y-0 opacity-100 scale-100"
            : "pointer-events-none -translate-y-2 opacity-0 scale-95"
        )}
      >
        {item.children.map((child) => {
          const childActive =
            pathname === child.href ||
            pathname.startsWith(child.href + "/");
          return (
            <Link
              key={child.href}
              href={child.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-4 py-3 transition-colors duration-150",
                childActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">
                  {child.label}
                </p>
                {child.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-neutral-500 group-hover:text-neutral-600">
                    {child.description}
                  </p>
                )}
              </div>
              <ChevronRight
                size={14}
                aria-hidden="true"
                className="mt-0.5 shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile Accordion Item ────────────────────────────────────────────────────

function MobileNavItem({
  item,
  pathname,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isActive =
    pathname === item.href ||
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href + "/")
    );

  if (!item.children) {
    return (
      <li>
        <Link
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-150",
            isActive
              ? "bg-primary-50 text-primary-600"
              : "text-neutral-800 hover:bg-neutral-50 hover:text-primary-600"
          )}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors duration-150",
          isActive
            ? "bg-primary-50 text-primary-600"
            : "text-neutral-800 hover:bg-neutral-50 hover:text-primary-600"
        )}
      >
        {item.label}
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={cn(
            "transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>

      {expanded && (
        <ul
          className="ml-4 mt-1 space-y-0.5 border-l-2 border-primary-100 pl-4"
          role="list"
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                  pathname === child.href
                    ? "font-semibold text-primary-600"
                    : "text-neutral-600 hover:text-primary-600"
                )}
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header() {
  const { isAtTop, direction } = useScrollPosition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useFocusTrap(mobileMenuRef, mobileOpen);

  // Show announcement bar only if not previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem("rhark-announcement-dismissed");
    if (!dismissed) setAnnouncementVisible(true);
  }, []);

  const dismissAnnouncement = useCallback(() => {
    setAnnouncementVisible(false);
    localStorage.setItem("rhark-announcement-dismissed", "1");
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isScrolled = !isAtTop;
  const isHidden = direction === "down" && isScrolled && !mobileOpen;

  return (
    <>
      {/* ── Announcement Bar ── */}
      {announcementVisible && (
        <div
          className={cn(
            "fixed left-0 right-0 top-0 z-sticky transition-transform duration-300",
            isHidden && "-translate-y-full"
          )}
        >
          <AnnouncementBar onDismiss={dismissAnnouncement} />
        </div>
      )}

      {/* ── Main Header ── */}
      <header
        role="banner"
        className={cn(
          "fixed left-0 right-0 z-sticky transition-all duration-300",
          announcementVisible ? "top-[38px] sm:top-[42px]" : "top-0",
          isScrolled
            ? "bg-white/95 shadow-sm backdrop-blur-md"
            : "bg-transparent",
          isHidden && "-translate-y-[calc(100%+42px)]"
        )}
      >
        {/* Top utility bar — visible on desktop only */}
        <div
          className={cn(
            "hidden border-b border-neutral-100 transition-all duration-300 lg:block",
            isScrolled ? "h-0 overflow-hidden border-transparent" : "h-auto"
          )}
        >
          <div className="container-site flex items-center justify-between py-2">
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <a
                href={`mailto:${ORG.email}`}
                className="flex items-center gap-1.5 hover:text-primary-500 transition-colors duration-150"
              >
                <Mail size={12} aria-hidden="true" />
                {ORG.email}
              </a>
              <a
                href={`tel:${ORG.phone}`}
                className="flex items-center gap-1.5 hover:text-primary-500 transition-colors duration-150"
              >
                <Phone size={12} aria-hidden="true" />
                {ORG.phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <span>{ORG.county}, {ORG.country}</span>
              <span aria-hidden="true">·</span>
              <Link
                href={ROUTES.publications}
                className="hover:text-primary-500 transition-colors duration-150"
              >
                Publications
              </Link>
              <span aria-hidden="true">·</span>
              <Link
                href={ROUTES.events}
                className="hover:text-primary-500 transition-colors duration-150"
              >
                Events
              </Link>
            </div>
          </div>
        </div>

        {/* ── Primary Nav Bar ── */}
        <div className="container-site">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">

            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              aria-label="RHARK — Reproductive Health Action and Rights Kenya, go to homepage"
            >
              {/* Logo mark */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500 shadow-teal-sm transition-all duration-200 group-hover:bg-primary-600 group-hover:shadow-teal">
                <Heart
                  size={18}
                  className="text-white"
                  aria-hidden="true"
                  fill="currentColor"
                />
              </div>
              {/* Wordmark */}
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-extrabold tracking-tight text-primary-600 lg:text-xl">
                  RHARK
                </span>
                <span className="hidden text-[10px] font-medium tracking-wide text-neutral-500 xs:block">
                  Kenya
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden flex-1 items-center justify-center gap-0.5 lg:flex"
            >
              {NAV_ITEMS.map((item) => (
                <MegaDropdown
                  key={item.href}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </nav>

            {/* Desktop CTAs */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <Link
                href={ROUTES.donate}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-bold text-white shadow-amber",
                  "transition-all duration-150 hover:bg-accent-600 hover:shadow-amber",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                )}
              >
                <Heart size={14} aria-hidden="true" fill="currentColor" />
                Donate
              </Link>
            </div>

            {/* Mobile: Donate + Hamburger */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href={ROUTES.donate}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-accent-500 px-3.5 py-2 text-xs font-bold text-white",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                )}
                aria-label="Donate to RHARK"
              >
                <Heart size={12} aria-hidden="true" fill="currentColor" />
                Donate
              </Link>
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                aria-label={
                  mobileOpen ? "Close navigation menu" : "Open navigation menu"
                }
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-150",
                  "text-neutral-700 hover:bg-neutral-100",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                )}
              >
                {mobileOpen ? (
                  <X size={22} aria-hidden="true" />
                ) : (
                  <Menu size={22} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Overlay ── */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-0 z-overlay flex flex-col bg-white lg:hidden",
          "transition-all duration-300",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        {/* Mobile header bar */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-100 px-4">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="RHARK homepage"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
              <Heart size={16} className="text-white" aria-hidden="true" fill="currentColor" />
            </div>
            <span className="font-display text-lg font-extrabold text-primary-600">
              RHARK
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable nav list */}
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-4 py-4"
        >
          <ul className="space-y-1" role="list">
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </ul>
        </nav>

        {/* Mobile footer actions */}
        <div className="shrink-0 space-y-3 border-t border-neutral-100 p-4">
          <Link
            href={ROUTES.donate}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full bg-accent-500 py-3.5 text-sm font-bold text-white shadow-amber",
              "transition-colors duration-150 hover:bg-accent-600",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            )}
          >
            <Heart size={16} aria-hidden="true" fill="currentColor" />
            Donate to RHARK
          </Link>
          <div className="flex items-center justify-center gap-4 text-xs text-neutral-500">
            <a
              href={`mailto:${ORG.email}`}
              className="flex items-center gap-1 hover:text-primary-500"
            >
              <Mail size={12} aria-hidden="true" />
              {ORG.email}
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile menu */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[250] bg-neutral-900/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}

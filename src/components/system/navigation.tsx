"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import type { NavItem } from "@/types";
import { IconButton } from "./buttons";

/**
 * Breadcrumbs gives users location context and supports screen readers.
 *
 * @example
 * <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Programs" }]} />
 */
export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="transition hover:text-primary-600">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-neutral-900 dark:text-white" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight size={14} aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * MegaMenu renders accessible grouped navigation for desktop layouts.
 *
 * @example
 * <MegaMenu item={programsNavItem} />
 */
export function MegaMenu({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!item.children?.length) {
    return <Link href={item.href} className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:text-primary-600 dark:text-neutral-200">{item.label}</Link>;
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 dark:text-neutral-200"
      >
        {item.label}
        <ChevronDown size={14} aria-hidden="true" className={cn("transition", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute left-0 top-full z-dropdown mt-2 grid min-w-[280px] gap-1 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800"
          >
            {item.children.map((child) => (
              <Link key={child.href} href={child.href} role="menuitem" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 transition hover:bg-primary-50 dark:hover:bg-neutral-800">
                <span className="block text-sm font-bold text-neutral-900 dark:text-white">{child.label}</span>
                {child.description && <span className="mt-1 block text-xs leading-5 text-neutral-500 dark:text-neutral-400">{child.description}</span>}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Navbar renders a responsive navigation bar from NavItem data.
 *
 * @example
 * <Navbar items={NAV_ITEMS} logo={<Logo />} actions={<ButtonLink href="/donate">Donate</ButtonLink>} />
 */
export function Navbar({ items, logo, actions, className }: { items: NavItem[]; logo: React.ReactNode; actions?: React.ReactNode; className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className={cn("sticky top-0 z-sticky bg-white/95 backdrop-blur dark:bg-neutral-950/95", className)}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{logo}</Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {items.map((item) => <MegaMenu key={item.href} item={item} />)}
        </nav>
        <div className="hidden lg:block">{actions}</div>
        <IconButton ariaLabel="Open menu" variant="ghost" className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <Menu size={22} aria-hidden="true" />
        </IconButton>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} items={items} logo={logo} actions={actions} />
    </header>
  );
}

/**
 * MobileMenu presents navigation in an accessible drawer pattern.
 *
 * @example
 * <MobileMenu open={open} onClose={close} items={NAV_ITEMS} />
 */
export function MobileMenu({ open, onClose, items, logo, actions }: { open: boolean; onClose: () => void; items: NavItem[]; logo?: React.ReactNode; actions?: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-modal lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-950/50" onClick={onClose} aria-label="Close menu backdrop" />
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl dark:bg-neutral-950">
            <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
              {logo}
              <IconButton ariaLabel="Close menu" variant="ghost" onClick={onClose}><X size={22} aria-hidden="true" /></IconButton>
            </div>
            <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
              <ul className="space-y-1">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className="block rounded-xl px-4 py-3 font-semibold text-neutral-800 hover:bg-primary-50 dark:text-neutral-100 dark:hover:bg-neutral-800">
                      {item.label}
                    </Link>
                    {item.children && (
                      <ul className="ml-4 border-l border-neutral-200 pl-3 dark:border-neutral-800">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={onClose} className="block rounded-lg px-3 py-2 text-sm text-neutral-600 hover:text-primary-600 dark:text-neutral-300">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            {actions && <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">{actions}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Pagination supports paginated lists with accessible labels.
 *
 * @example
 * <Pagination currentPage={1} totalPages={5} onPageChange={setPage} />
 */
export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2">
      <button type="button" className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-40" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1} aria-label="Previous page">
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
        <button key={page} type="button" onClick={() => onPageChange(page)} aria-current={page === currentPage ? "page" : undefined} className={cn("h-9 min-w-9 rounded-full px-3 text-sm font-bold", page === currentPage ? "bg-primary-500 text-white" : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200")}>
          {page}
        </button>
      ))}
      <button type="button" className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-40" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages} aria-label="Next page">
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}

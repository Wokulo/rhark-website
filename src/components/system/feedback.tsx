"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, Loader2, X } from "lucide-react";
import { cn } from "@/utils";
import { IconButton } from "./buttons";

type Tone = "info" | "success" | "warning" | "error";

const toneStyles = {
  info: "border-info-500 bg-info-50 text-info-800",
  success: "border-success-500 bg-success-50 text-success-800",
  warning: "border-warning-500 bg-warning-50 text-warning-800",
  error: "border-error-500 bg-error-50 text-error-800",
};

const toneIcons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
  error: AlertCircle,
};

/**
 * Alert communicates status messages inline.
 *
 * @example
 * <Alert tone="success" title="Saved">Your changes were saved.</Alert>
 */
export function Alert({ tone = "info", title, children, onDismiss, className }: { tone?: Tone; title?: string; children: React.ReactNode; onDismiss?: () => void; className?: string }) {
  const Icon = toneIcons[tone];
  return (
    <div role="alert" className={cn("flex gap-3 rounded-2xl border-l-4 p-4", toneStyles[tone], className)}>
      <Icon className="mt-0.5 shrink-0" size={20} aria-hidden="true" />
      <div className="flex-1">
        {title && <p className="font-bold">{title}</p>}
        <div className="text-sm leading-6">{children}</div>
      </div>
      {onDismiss && <IconButton ariaLabel="Dismiss alert" variant="ghost" className="h-8 w-8" onClick={onDismiss}><X size={16} /></IconButton>}
    </div>
  );
}

/** @example <Toast tone="success" message="Saved" onDismiss={close} /> */
export function Toast({ tone = "info", message, onDismiss }: { tone?: Tone; message: string; onDismiss?: () => void }) {
  useEffect(() => {
    if (!onDismiss) return;
    const id = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(id);
  }, [onDismiss]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} className="rounded-2xl bg-white p-4 shadow-xl ring-1 ring-neutral-200 dark:bg-neutral-900 dark:ring-neutral-800">
      <Alert tone={tone} onDismiss={onDismiss}>{message}</Alert>
    </motion.div>
  );
}

/** @example <ToastViewport><Toast message="Saved" /></ToastViewport> */
export function ToastViewport({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-4 right-4 z-toast flex w-[min(100%-2rem,24rem)] flex-col gap-3">{children}</div>;
}

/** @example <Modal open={open} onClose={close} title="Confirm">...</Modal> */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-modal flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="system-modal-title">
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-neutral-950/60" onClick={onClose} aria-label="Close modal backdrop" />
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-neutral-200 p-5 dark:border-neutral-800">
              <h2 id="system-modal-title" className="font-display text-lg font-bold text-neutral-950 dark:text-white">{title}</h2>
              <IconButton ariaLabel="Close modal" variant="ghost" onClick={onClose}><X size={20} /></IconButton>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** @example <Drawer open={open} side="right" onClose={close}>...</Drawer> */
export function Drawer({ open, onClose, children, side = "right" }: { open: boolean; onClose: () => void; children: React.ReactNode; side?: "left" | "right" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-modal" role="dialog" aria-modal="true">
          <motion.button className="absolute inset-0 bg-neutral-950/50" onClick={onClose} aria-label="Close drawer backdrop" />
          <motion.aside initial={{ x: side === "right" ? "100%" : "-100%" }} animate={{ x: 0 }} exit={{ x: side === "right" ? "100%" : "-100%" }} className={cn("absolute top-0 h-full w-full max-w-md bg-white p-6 shadow-2xl dark:bg-neutral-900", side === "right" ? "right-0" : "left-0")}>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** @example <SkeletonLoader className="h-40" /> */
export function SkeletonLoader({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-800", className)} aria-hidden="true" />;
}

/** @example <Spinner label="Loading content" /> */
export function Spinner({ label = "Loading" }: { label?: string }) {
  return <Loader2 className="h-5 w-5 animate-spin text-primary-600" role="status" aria-label={label} />;
}

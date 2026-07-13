"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

/** @example <Badge variant="success">Active</Badge> */
export function Badge({ children, variant = "primary", className }: { children: React.ReactNode; variant?: "primary" | "secondary" | "accent" | "success" | "warning" | "error" | "neutral"; className?: string }) {
  const variants = {
    primary: "bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-200",
    secondary: "bg-secondary-100 text-secondary-700",
    accent: "bg-accent-100 text-accent-700",
    success: "bg-success-50 text-success-700",
    warning: "bg-warning-50 text-warning-700",
    error: "bg-error-50 text-error-700",
    neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize", variants[variant], className)}>{children}</span>;
}

/** @example <Tag>SRHR</Tag> */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-600 dark:border-neutral-700 dark:text-neutral-300", className)}>{children}</span>;
}

/** @example <Accordion items={[{ id: "1", title: "Question", content: "Answer" }]} /> */
export function Accordion({ items }: { items: { id: string; title: string; content: React.ReactNode }[] }) {
  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {items.map((item) => (
        <details key={item.id} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-neutral-900 dark:text-white">
            {item.title}
            <ChevronDown className="transition group-open:rotate-180" size={18} aria-hidden="true" />
          </summary>
          <div className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

/** @example <Tabs tabs={[{ id: "a", label: "A", content: <p>A</p> }]} /> */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const baseId = useId();
  const activeTab = tabs.find((tab) => tab.id === active);
  return (
    <div>
      <div role="tablist" className="flex gap-2 overflow-x-auto border-b border-neutral-200 dark:border-neutral-800">
        {tabs.map((tab) => (
          <button key={tab.id} id={`${baseId}-${tab.id}-tab`} role="tab" aria-selected={active === tab.id} aria-controls={`${baseId}-${tab.id}-panel`} onClick={() => setActive(tab.id)} className={cn("border-b-2 px-4 py-3 text-sm font-bold", active === tab.id ? "border-primary-500 text-primary-600" : "border-transparent text-neutral-500 hover:text-neutral-900")}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab && (
        <div id={`${baseId}-${activeTab.id}-panel`} role="tabpanel" aria-labelledby={`${baseId}-${activeTab.id}-tab`} className="py-5">
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

/** @example <Timeline items={[{ title: "Founded", date: "2021" }]} /> */
export function Timeline({ items }: { items: { title: string; date?: string; description?: string }[] }) {
  return (
    <ol className="relative border-l border-primary-200 pl-6 dark:border-primary-900">
      {items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="mb-8 last:mb-0">
          <span className="absolute -left-2 mt-1 h-4 w-4 rounded-full bg-primary-500 ring-4 ring-white dark:ring-neutral-950" />
          {item.date && <p className="text-xs font-bold uppercase tracking-widest text-primary-600">{item.date}</p>}
          <h3 className="mt-1 font-display text-lg font-bold text-neutral-950 dark:text-white">{item.title}</h3>
          {item.description && <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.description}</p>}
        </li>
      ))}
    </ol>
  );
}

/** @example <StatisticsCounter value={5000} suffix="+" /> */
export function StatisticsCounter({ value, suffix = "", duration = 900 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) requestAnimationFrame(tick);
    };
    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

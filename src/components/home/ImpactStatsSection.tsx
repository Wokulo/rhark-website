"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  FolderKanban,
  Handshake,
  MapPin,
  MessageCircle,
  School,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/utils";
import { IMPACT_STATS, ROUTES } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const STAT_PRESENTATION = [
  { icon: Users, color: "text-primary-500", bg: "bg-primary-50" },
  { icon: TrendingUp, color: "text-secondary-500", bg: "bg-secondary-50" },
  { icon: MessageCircle, color: "text-accent-600", bg: "bg-accent-50" },
  { icon: School, color: "text-info-500", bg: "bg-info-50" },
  { icon: FolderKanban, color: "text-primary-600", bg: "bg-primary-50" },
  { icon: MapPin, color: "text-secondary-400", bg: "bg-secondary-50" },
  { icon: Handshake, color: "text-success-500", bg: "bg-success-50" },
];

const STATS = IMPACT_STATS.map((stat, index) => ({
  ...stat,
  valueText: `${stat.value.toLocaleString()}${stat.suffix ?? ""}`,
  ...STAT_PRESENTATION[index % STAT_PRESENTATION.length],
}));

export function ImpactStatsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      aria-labelledby="impact-heading"
      className="bg-[radial-gradient(circle_at_top,rgba(13,110,110,0.07),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-16 lg:py-20"
    >
      <div className="container-site">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">
            Our Impact
          </p>
          <h2
            id="impact-heading"
            className="mt-3 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-5xl"
          >
            Measurable change in communities
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.id}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 1}
              className="group rounded-[1.75rem] border border-white/75 bg-white/90 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)] backdrop-blur-sm"
            >
              <div className={cn("mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 ring-black/5", stat.bg)}>
                <stat.icon size={22} className={stat.color} aria-hidden="true" />
              </div>
              <p className={cn("font-display text-4xl font-extrabold tracking-tight", stat.color)}>
                {stat.valueText}
              </p>
              <p className="mt-1 font-semibold text-neutral-900">{stat.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={5}
          className="mt-10 text-center"
        >
          <Link
            href={ROUTES.impact}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
          >
            View the impact dashboard →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

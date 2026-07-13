"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const NEWS = [
  {
    title: "RHARK Launches New SRHR Awareness Campaign in Bondo Sub-County",
    excerpt: "RHARK has launched a comprehensive SRHR awareness campaign targeting over 2,000 youth in Bondo Sub-County, focusing on family planning, HIV prevention, and gender-based violence.",
    category: "News",
    date: "15 January 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    alt: "RHARK staff conducting SRHR awareness session with youth in Bondo",
    href: ROUTES.news,
    categoryColor: "bg-primary-100 text-primary-700",
  },
  {
    title: "Community Health Volunteers Trained in Maternal Health Support",
    excerpt: "Forty community health volunteers from across Siaya County completed a five-day training on maternal and newborn health, equipping them to support pregnant women in their communities.",
    category: "Press Release",
    date: "8 January 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&q=80",
    alt: "Community health volunteers receiving training certificates at RHARK workshop",
    href: ROUTES.news,
    categoryColor: "bg-accent-100 text-accent-700",
  },
  {
    title: "RHARK Partners with County Government on Mental Health Policy",
    excerpt: "RHARK has entered into a memorandum of understanding with the Siaya County Government to co-develop a county-level mental health policy framework for youth and adolescents.",
    category: "Announcement",
    date: "2 January 2025",
    readTime: "2 min read",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
    alt: "RHARK executive director signing MOU with Siaya County Government representative",
    href: ROUTES.news,
    categoryColor: "bg-secondary-100 text-secondary-600",
  },
];

export function NewsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="news-heading" className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Latest News</p>
            <h2 id="news-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
              Updates from RHARK
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
            <Link href={ROUTES.news}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
              All news <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {NEWS.map((article, i) => (
            <motion.article
              key={article.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-50 ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-100">
                <Image src={article.image} alt={article.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className={cn("rounded-full px-3 py-1 text-xs font-bold", article.categoryColor)}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-400">
                    <Clock size={11} aria-hidden="true" /> {article.readTime}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">{article.excerpt}</p>
                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <time className="text-xs text-neutral-400">{article.date}</time>
                  <Link href={article.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
                    Read <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

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

interface NewsSectionProps {
  content?: Array<{
    title: string;
    excerpt: string;
    date: string;
    category?: string;
    readTime?: string;
    image?: string;
    alt?: string;
    href?: string;
    categoryColor?: string;
  }>;
}

const DEFAULT_NEWS = [
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
    image: "https://images.unsplash.com/photo-1559757148-5c1593375356?w=600&q=80",
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

export function NewsSection({ content }: NewsSectionProps) {
  const news = content ?? DEFAULT_NEWS;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="news-heading" className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-12 lg:py-16">
      <div className="container-site">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">Latest News</p>
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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article, i) => (
            <motion.article
              key={article.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/75 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm"
            >
               <div className="relative h-44 overflow-hidden bg-neutral-100">
                 <Image src={article.image ?? "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80"} alt={article.alt ?? article.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" quality={90} />
               </div>
               <div className="flex flex-1 flex-col p-5">
                 <div className="flex items-center justify-between">
                   <span className={cn("rounded-full px-3 py-1 text-xs font-bold", article.categoryColor ?? "bg-primary-100 text-primary-700")}>
                     {article.category ?? "News"}
                   </span>
                   <span className="flex items-center gap-1 text-xs text-neutral-400">
                     <Clock size={11} aria-hidden="true" /> {article.readTime ?? "3 min read"}
                   </span>
                 </div>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                  {article.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">{article.excerpt}</p>
                <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <time className="text-xs text-neutral-400">{article.date}</time>
                  <Link href={article.href ?? ROUTES.news}
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

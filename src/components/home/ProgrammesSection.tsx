"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";
import { getProgrammes, type Programme } from "@/services/programmes";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

// Programme slugs that have dedicated detail pages. Any other slug
// falls back to the /programmes listing to avoid 404s.
const PROGRAMME_ROUTES = new Set([
  "srhr",
  "mental-health",
  "hiv-teen-pregnancy",
  "gender-equality",
  "governance-policy",
  "climate-justice",
]);

const ICON_MAP: Record<string, React.ElementType> = {
  Heart: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Brain: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M12 18v4"/></svg>,
  Shield: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>,
  Users: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Landmark: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 21 9-9 9 9"/><path d="M3 10l9-9 9 9"/><rect x="5" y="10" width="14" height="11"/><rect x="9" y="14" width="6" height="7"/></svg>,
  Leaf: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3 17 3a13.2 13.2 0 0 0-3 17"/><path d="M15.5 21a7 7 0 0 1-1.5-4.5C14 8 14.5 2.5 14.5 2.5a13 13 0 0 0-3 17.5c1.5.5 3 1 4.5 2Z"/></svg>,
  MessageCircle: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>,
  BookOpen: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Home: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  GraduationCap: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
};

const IMAGE_MAP: Record<string, string> = {
  srhr: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  "mental-health": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80",
  "hiv-teen-pregnancy": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
  "gender-equality": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  "governance-policy": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  "climate-justice": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
  "deep-canvassing": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  "inschool-cse": "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
  "community-safe-space": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  "gumzo-chuoni": "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80",
};

interface ProgrammesSectionProps {
  content?: { heading: string; subheading: string; previewCount: number };
}

export function ProgrammesSection({ content }: ProgrammesSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProgrammes();
        setProgrammes(data);
      } catch {
        // Silently handle error
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const heading = content?.heading ?? "Integrated approaches to health and rights";
  const subheading = content?.subheading ?? "RHARK delivers holistic programmes across six thematic areas to create lasting impact in Siaya County and beyond.";
  const previewCount = content?.previewCount ?? 6;

  if (loading) {
    return (
      <section ref={ref} aria-labelledby="programmes-heading" className="bg-[radial-gradient(circle_at_top,rgba(13,110,110,0.06),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-12 lg:py-16">
        <div className="container-site">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">Our Programmes</p>
            <h2 id="programmes-heading" className="mt-3 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-5xl">
              {heading}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-[1.6rem] bg-neutral-100 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-labelledby="programmes-heading" className="bg-[radial-gradient(circle_at_top,rgba(13,110,110,0.06),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fbfb_100%)] py-12 lg:py-16">
      <div className="container-site">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">Our Programmes</p>
          <h2 id="programmes-heading" className="mt-3 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-neutral-600">
            {subheading}
          </p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {programmes.slice(0, previewCount).map((programme, i) => {
            const Icon = ICON_MAP[programme.icon] || ICON_MAP.Heart;
            const imageSrc = programme.imageUrl || IMAGE_MAP[programme.slug] || IMAGE_MAP.srhr;

            return (
              <motion.article
                key={programme.id}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 1}
              >
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-white/75 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm">
                  <div className="relative h-52 overflow-hidden bg-neutral-100">
                    <Image
                      src={imageSrc}
                      alt={programme.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-transparent" aria-hidden="true" />
                    <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold shadow-sm backdrop-blur-sm", programme.color === "primary" ? "bg-primary-100/90 text-primary-700" : programme.color === "secondary" ? "bg-secondary-100/90 text-secondary-600" : "bg-accent-100/90 text-accent-700")}>
                      {programme.shortTitle}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 ring-1 ring-primary-100">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-neutral-900 transition-colors duration-150 group-hover:text-primary-600">
                      {programme.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500 line-clamp-3">{programme.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {programme.targetBeneficiaries.slice(0, 3).map((beneficiary) => (
                        <span key={beneficiary} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                          {beneficiary}
                        </span>
                      ))}
                    </div>
<Link
                      href={PROGRAMME_ROUTES.has(programme.slug) ? `/programmes/${programme.slug}` : ROUTES.programmes}
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                    >
                      Learn more <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={7} className="mt-12 text-center">
          <Link href={ROUTES.programmes} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
            View all programmes <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
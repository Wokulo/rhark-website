"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Heart, Brain, Shield, Users, Landmark, Leaf } from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";
import { programmesData } from "@/data/programmes";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const ICON_MAP: Record<string, React.ElementType> = {
  Heart,
  Brain,
  Shield,
  Users,
  Landmark,
  Leaf,
};

const IMAGE_MAP: Record<string, string> = {
  srhr: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80",
  "mental-health": "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80",
  "hiv-teen-pregnancy": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
  "gender-equality": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
  "governance-policy": "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
  "climate-justice": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
};

export function ProgrammesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="programmes-heading" className="bg-white py-20 lg:py-28">
      <div className="container-site">
        <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Our Programmes</p>
          <h2 id="programmes-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
            Integrated approaches to health and rights
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">
            RHARK delivers holistic programmes across six thematic areas to create lasting impact in Siaya County and beyond.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programmesData.map((programme, i) => {
            const Icon = ICON_MAP[programme.icon] || Heart;
            const imageSrc = IMAGE_MAP[programme.slug] || IMAGE_MAP.srhr;

            return (
              <motion.article
                key={programme.id}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 1}
                className="group flex flex-col overflow-hidden rounded-2xl bg-neutral-50 shadow-sm ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-100">
                  <img
                    src={imageSrc}
                    alt={programme.image?.alt || programme.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent" aria-hidden="true" />
                  <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold", programme.color === "primary" ? "bg-primary-100 text-primary-700" : programme.color === "secondary" ? "bg-secondary-100 text-secondary-600" : "bg-accent-100 text-accent-700")}>
                    {programme.shortTitle}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
                    {programme.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{programme.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {programme.targetBeneficiaries.slice(0, 3).map((beneficiary) => (
                      <span key={beneficiary} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                        {beneficiary}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/programmes/${programme.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
                  >
                    Learn more <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                  </Link>
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

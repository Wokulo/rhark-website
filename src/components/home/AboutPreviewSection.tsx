"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ROUTES, ORG } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.12 },
  }),
};

const VALUES = [
  "Transparency & Accountability",
  "Equity & Intersectionality",
  "Integrity",
  "Innovation",
  "Collaboration",
];

export function AboutPreviewSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      aria-labelledby="about-heading"
      className="bg-neutral-50 py-20 lg:py-28"
    >
      <div className="container-site">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Image side */}
          <motion.div
            variants={{ hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] } } }}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <div className="relative aspect-[4/3] w-full bg-primary-100">
                <Image
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=85"
                  alt="RHARK team members working with community members in Siaya County on reproductive health education"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -right-4 rounded-2xl bg-white p-5 shadow-xl ring-1 ring-neutral-100 lg:-right-8">
              <p className="font-display text-3xl font-extrabold text-primary-500">2021</p>
              <p className="mt-0.5 text-sm font-medium text-neutral-600">Year Established</p>
              <p className="mt-0.5 text-xs text-neutral-400">{ORG.county}, Kenya</p>
            </div>
          </motion.div>

          {/* Content side */}
          <div className="flex flex-col gap-6">
            <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}
              className="text-sm font-bold uppercase tracking-widest text-primary-500">
              About RHARK
            </motion.p>

            <motion.h2 variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}
              id="about-heading"
              className="font-display text-3xl font-extrabold leading-tight text-neutral-900 text-balance lg:text-4xl">
              A community-driven force for health and rights in Kenya
            </motion.h2>

            <motion.p variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={2}
              className="text-lg leading-relaxed text-neutral-600">
              {ORG.mission}
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={3}>
              <p className="mb-3 text-sm font-semibold text-neutral-700">Our Core Values</p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2" role="list">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 size={15} className="shrink-0 text-primary-500" aria-hidden="true" />
                    {v}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={4}
              className="flex flex-wrap gap-3 pt-2">
              <Link href={ROUTES.about}
                className="inline-flex items-center gap-2 rounded-full bg-primary-500 px-6 py-3 text-sm font-bold text-white shadow-teal-sm transition-all duration-200 hover:bg-primary-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                Learn More About Us <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link href={ROUTES.team}
                className="inline-flex items-center gap-2 rounded-full border-2 border-neutral-200 px-6 py-3 text-sm font-bold text-neutral-700 transition-all duration-200 hover:border-primary-300 hover:text-primary-600 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                Meet Our Team
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: i * 0.1 },
  }),
};

const PROJECTS = [
  {
    title: "Ujana Salama",
    summary: "Safe youth spaces providing SRHR education and counselling for adolescents in Bondo Sub-County.",
    location: "Bondo Sub-County, Siaya",
    beneficiaries: "1,200+",
    status: "Active",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=600&q=80",
    alt: "Youth group participating in SRHR education session in Bondo, Siaya County",
    href: "/projects/ujana-salama",
    tag: "SRHR",
    tagColor: "bg-primary-100 text-primary-700",
  },
  {
    title: "Mama na Mtoto",
    summary: "Maternal and newborn health programme supporting pregnant women and new mothers in rural Siaya.",
    location: "Siaya County",
    beneficiaries: "800+",
    status: "Active",
    image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80",
    alt: "Community health worker providing maternal health support to a mother in rural Siaya",
    href: "/projects/mama-na-mtoto",
    tag: "Maternal Health",
    tagColor: "bg-secondary-100 text-secondary-600",
  },
  {
    title: "Vijana na Afya",
    summary: "Adolescent mental health awareness and peer support programme in secondary schools across Siaya.",
    location: "Siaya County Schools",
    beneficiaries: "600+",
    status: "Active",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80",
    alt: "Students participating in mental health awareness session at a secondary school in Siaya",
    href: "/projects",
    tag: "Mental Health",
    tagColor: "bg-accent-100 text-accent-700",
  },
];

export function ProjectsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} aria-labelledby="projects-heading" className="bg-[radial-gradient(circle_at_top_left,rgba(13,110,110,0.08),transparent_30%),linear-gradient(180deg,#f8fbfb_0%,#ffffff_100%)] py-16 lg:py-20">
      <div className="container-site">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary-500">Featured Projects</p>
            <h2 id="projects-heading" className="mt-3 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-5xl">
              Programmes in action
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
            <Link href={ROUTES.projects}
            className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white/80 px-4 py-2 text-sm font-semibold text-primary-600 shadow-sm backdrop-blur-sm hover:border-primary-200 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
              All projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex flex-col overflow-hidden rounded-[1.6rem] border border-white/75 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur-sm"
              >
                <div className="relative h-56 overflow-hidden bg-neutral-100">
                <Image src={project.image} alt={project.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/35 via-transparent to-transparent" aria-hidden="true" />
                <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold", project.tagColor)}>
                  {project.tag}
                </span>
                  <span className="absolute right-4 top-4 rounded-full bg-success-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  {project.status}
                </span>
              </div>
                <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-bold text-neutral-900 transition-colors duration-150 group-hover:text-primary-600">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{project.summary}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <MapPin size={12} aria-hidden="true" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-600">
                    <Users size={12} aria-hidden="true" />
                    {project.beneficiaries}
                  </div>
                </div>
                <Link href={project.href}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-0 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  Read more <ArrowRight size={13} aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

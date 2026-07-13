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
    <section ref={ref} aria-labelledby="projects-heading" className="bg-neutral-50 py-20 lg:py-28">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
            <p className="text-sm font-bold uppercase tracking-widest text-primary-500">Featured Projects</p>
            <h2 id="projects-heading" className="mt-2 font-display text-3xl font-extrabold text-neutral-900 text-balance lg:text-4xl">
              Programmes in action
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"} custom={1}>
            <Link href={ROUTES.projects}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
              All projects <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.title}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={i + 2}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 transition-all duration-250 hover:shadow-lg hover:ring-neutral-300"
            >
              <div className="relative h-52 overflow-hidden bg-neutral-100">
                <Image src={project.image} alt={project.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/30 to-transparent" aria-hidden="true" />
                <span className={cn("absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold", project.tagColor)}>
                  {project.tag}
                </span>
                <span className="absolute right-4 top-4 rounded-full bg-success-500 px-2.5 py-1 text-xs font-bold text-white">
                  {project.status}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors duration-150">
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
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded">
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
